'use strict';

const isArray = require('lodash.isarray');
const partialRight = require('lodash.partialright');
const Request = require('./Request');
const Response = require('./Response');
const Transformer = require('./transformers/Transformer');
const Middleware = require('./Middleware');
const ServerlessTransformer = require('./transformers/ServerlessTransformer');

class Kernel {
  /**
   * @param {Transformer} transformer
   * @param {Middleware[]} middlewares
   */
  constructor(transformer, middlewares) {
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

    if (!isArray(middlewares)) {
      throw new TypeError(
        'middlewares provided to Kernel is' +
        'not an Array, it is: ' + typeof middlewares
      );
    }

    for (let i of middlewares) {
      if (!(middlewares[i] instanceof Middleware)) {
        throw new TypeError(
          `middleware ${i} provided to Kernel is not an ` +
          'instance of Middleware, it is: ' + typeof middlewares[i]
        );
      }
    }

    this.middlewares = middlewares;
  }

  /**
   * @access public
   * @param action
   * @param middleware
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
   * @access private
   * @param {object} event
   * @param {object} context
   * @param {function} cb
   * @param {function} action
   * @param {Middleware[]} middlewares
   * @return {void}
   **/
  dispatcher(event, context, cb, action, middlewares) {
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
      const res = action.apply(null, [req, env].concat(mwValues));

      if (typeof res !== 'object') {
        throw new TypeError('controller methods must return a Response or a Promise');
      } else if (res instanceof Response) {
        context.done(null, res.simplify());
      } else if (typeof res.then === 'function') {
        res.then(promised => {
          if (promised instanceof Response) {
            context.done(null, promised.simplify());
          } else {
            throw new TypeError('Promises returned by controller methods must resolve to a Response');
          }
        }, err => {
          context.done(null, Kernel.parseErr(err).simplify());
        });
      } else throw new TypeError('controller methods must return a Response or a Promise');
    } catch (err) {
      // using context.done instead of cb because of cb() holding connection open
      context.done(null, Kernel.parseErr(err).simplify());
    } finally {
      middlewares.forEach(mw => mw.destroy());
    }
  }

  /**
   * @access private
   * @param err
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