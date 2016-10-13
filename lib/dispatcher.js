'use strict';

const Request = require('./Request');
const LamdaTransformer = require('./LamdaTransformer');

function dispatcher(event, context, cb, action, middleware) {
  const stage = event.requestContext.stage.toUpperCase();
  const env = {
    stage: stage,
    debug: ['DEV', 'QA', 'TEST'].indexOf(stage) > -1
  };

  // actually want an array, but y'know, JavaScript.
  if (typeof middleware !== 'object')
    middleware = [];
  let mwInstances = [];

  try {
    // construct the request from Lambda/Serverless event
    const req = new Request(event, new LamdaTransformer());
    // initialize middleware
    mwInstances = middleware.map(m => new m(req, env));
    const mwObjects = mwInstances.map(instance => instance.create());
    // construct response from provided method
    const res = action.apply(null, [req, env].concat(mwObjects));
    // return formatted response to Lambda
    context.done(null, res.simplify());
  } catch (err) {
    // using context.done instead of cb because of odd bugs when using cb
    context.done(err);
  } finally {
    mwInstances.forEach(instance => instance.destroy());
  }
}

module.exports = dispatcher;