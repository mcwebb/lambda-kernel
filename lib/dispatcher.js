'use strict';

const Request = require('./Request');
const Response = require('./Response');
const ServerlessTransformer = require('./transformers/ServerlessTransformer');

/**
 * @param {object} event
 * @param {object} context
 * @param {function} cb
 * @param {function} action
 * @param {Middleware[]} middleware
 * @param {Transformer} transformer
 * @return {void}
 **/
function dispatcher(event, context, cb, action, middleware, transformer) {
  const stage = event.requestContext.stage.toUpperCase();
  const env = {
    stage: stage,
    debug: ['DEV', 'QA', 'TEST'].indexOf(stage) > -1
  };

  // actually want an array, but y'know, JavaScript.
  if (typeof middleware !== 'object')
    middleware = [];
  let mwInstances = [];

  // default to the Serverless transformer and parsing the body as JSON
  if (typeof transformer === 'undefined')
    transformer = new ServerlessTransformer(JSON.parse);

  try {
    // construct the request from the event using provided transformer
    const req = new Request(event, transformer);
    // initialize middleware
    mwInstances = middleware.map(m => new m(req, env));
    const mwObjects = mwInstances.map(instance => instance.create());
    // construct response from provided method
    const res = action.apply(null, [req, env].concat(mwObjects));
    // allow for returning promises
    if (typeof res.then === 'function') {
      res.then(promised => {
        if (promised instanceof Response) {
          context.done(null, promised.simplify());
        } else throw new TypeError('must return a Response');
      }, err => {
        context.done(err);
      });
    } else if (res instanceof Response) {
      context.done(null, res.simplify());
    } else throw new TypeError('must return a Response');
  } catch (err) {
    // using context.done instead of cb because of cb() holding connection open
    context.done(err);
  } finally {
    mwInstances.forEach(instance => instance.destroy());
  }
}

module.exports = dispatcher;