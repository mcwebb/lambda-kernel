'use strict';

const isArray = require('lodash.isarray');
const partialRight = require('lodash.partialright');
const Request = require('./Request');
const Response = require('./Response');
const Transformer = require('./transformers/Transformer');
const Middleware = require('./Middleware');
const ServerlessTransformer = require('./transformers/ServerlessTransformer');

/**
 * The core class of Lambda-Kernel, use this at the root of your application
 * to handle the request to response lifecycle.
 */
class Kernel {
  /**
   * Construct a new kernel with the provided options.
   * @param {Transformer} [transformer]
   * @param {Middleware[]} [middlewares]
   * @param {Object} [options]
   */
  constructor(transformer, middlewares, options) {
    // default to the Serverless transformer and parsing the body as JSON
    if (typeof transformer === 'undefined') {
      transformer = new ServerlessTransformer(JSON.parse);
    } else if (!(transformer instanceof Transformer)) {
      throw new TypeError(
        'transformer provided to Kernel is not an ' +
        'instance of Transformer, it is: ' + typeof transformer
      );
    }

    this.transformer = transformer;

    if (isArray(middlewares)) {
      for (const mw of middlewares) {
        if (mw instanceof Middleware) continue;
        else throw new TypeError(
          'middleware provided to Kernel is not an ' +
          'instance of Middleware, it is: ' + typeof mw
        );
      }

      this.middlewares = middlewares;
    } else {
      this.middlewares = [];
    }

    const defaultOptions = {
      forceEnd: true,
    };

    if (typeof options === 'object') {
      this.options = Object.assign(defaultOptions, options);
    } else this.options = defaultOptions;
  }

  /**
   * Public dispatch method to interface with
   * the Lambda integration layer.
   * @access public
   * @param {function} action - function to invoke for the request
   * @param {Middleware[]} [middleware] - any additional middleware for this request
   * @return function
   */
  dispatch(action, middleware) {
    return partialRight(
      this.dispatcher.bind(this),
      action,
      middleware
    );
  }

  /**
   * Core dispatcher to invoke provided action
   * for the request with any provided middleware.
   * @access private
   * @param {object} event - Lambda integration event
   * @param {object} context - Lambda context
   * @param {function} cb - Lambda callback
   * @param {function} action - function to invoke for the request
   * @param {Middleware[]} middlewares - any additional middleware for this request
   * @return {void}
   **/
  dispatcher(event, context, cb, action, middlewares) {
    const respond = this.respond.bind(this, context, cb);
    const stage = event.requestContext.stage.toUpperCase();
    const env = {
      stage: stage,
      debug: ['DEV', 'QA', 'TEST'].indexOf(stage) > -1
    };

    if (typeof action !== 'function') {
      throw new TypeError(
        'action provided to dispatcher must be a callable'
      );
    }

    if (!isArray(middlewares)) {
      middlewares = this.middlewares;
    } else {
      middlewares = this.middlewares.concat(middlewares);
    }

    try {
      // construct the request from the event using provided transformer
      const req = new Request(event, this.transformer);
      const mwValues = middlewares.map(mw => mw.create(req, env));
      // construct response from provided method
      const response = action.apply(null, [req, env].concat(mwValues));

      if (typeof response !== 'object') {
        throw new TypeError('controller methods must return a Response or a Promise');
      } else if (response instanceof Response) {
        respond(null, response.simplified());
      } else if (typeof response.then === 'function') {
        response.then(promised => {
          if (promised instanceof Response) {
            respond(null, promised.simplified());
          } else {
            throw new TypeError('Promises returned by controller methods must resolve to a Response');
          }
        }, err => {
          respond(null, Kernel.parseErr(err).simplified());
        });
      } else throw new TypeError('controller methods must return a Response or a Promise');
    } catch (err) {
      // using context.done instead of cb because of cb() holding connection open
      respond(null, Kernel.parseErr(err).simplified());
    } finally {
      middlewares.forEach(mw => mw.destroy());
    }
  }


  /**
   * Respond to the Lambda integration layer with
   * the provided error or response.
   * @access private
   * @param {object} context - Lambda context
   * @param {function} cb - Lambda integration callback
   * @param {object} [err] - error to send to Lambda
   * @param {Response} [response] - response to send to Lambda
   * @return {void}
   **/
  respond(context, cb, err, response) {
    if (this.options.forceEnd) {
      context.done(err, response);
    } else cb(err, response);
  };

  /**
   * Internal helper to generate a standardized
   * response from a JavaScript error
   * @access private
   * @param err - unknown error to parse into a response
   * @return {Response}
   */
  static parseErr(err) {
    let message = '';
    if (err.hasOwnProperty('message'))
      message = err.message;
    else message = err;

    const codes = /^\[([0-9]{3})]\s/.exec(message);
    if (!codes) return new Response({message}, 500);
    else return new Response({message}, codes[1]);
  }
}


module.exports = Kernel;