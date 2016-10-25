'use strict';

const Request = require('./Request');
const Response = require('./Response');
const ServerlessTransformer = require('./transformers/ServerlessTransformer');


function parseErr(err) {
  let message = '';
  if (err.hasOwnProperty('message'))
    message = err.message;
  else message = err;

  const codes = /^\[([0-9]{3})]\s/.exec(message);
  if (!codes) return new Response({message}, 500);
  else return new Response({message}, codes[1]);
}

/**
 * @param {object} event
 * @param {object} context
 * @param {function} cb
 * @param {function} action
 * @param {Middleware[]} middlewares
 * @param {Transformer} transformer
 * @return {void}
 **/
function dispatcher(event, context, cb, action, middlewares, transformer) {
  const stage = event.requestContext.stage.toUpperCase();
  const env = {
    stage: stage,
    debug: ['DEV', 'QA', 'TEST'].indexOf(stage) > -1
  };

  // actually want an array, but y'know, JavaScript.
  if (typeof middlewares !== 'object')
    middlewares = [];

  // default to the Serverless transformer and parsing the body as JSON
  if (typeof transformer === 'undefined')
    transformer = new ServerlessTransformer(JSON.parse);

  try {
    // construct the request from the event using provided transformer
    const req = new Request(event, transformer);
    const mwObjects = middlewares.map(mw => mw.create(req, env));
    // construct response from provided method
    const res = action.apply(null, [req, env].concat(mwObjects));

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
        context.done(null, parseErr(err).simplify());
      });
    } else throw new TypeError('controller methods must return a Response or a Promise');
  } catch (err) {
    // using context.done instead of cb because of cb() holding connection open
    context.done(null, parseErr(err).simplify());
  } finally {
    middlewares.forEach(mw => mw.destroy());
  }
}

module.exports = dispatcher;