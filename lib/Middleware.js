'use strict';

/**
 * Abstract class that your Middleware must extend and implement
 * the interface as below.
 * @abstract
 **/
class Middleware {
  /**
   * The constructor is the opportune time
   * to pass any config information which can
   * be later used in the create() method.
   **/
  constructor() {}

  /**
   * Return the value which should be
   * passed to the controller method.
   * @abstract
   * @param {Request} req - Request transformed from Lambda integration event
   * @param {{ stage: string, debug: boolean }} env - Lambda context information
   * @return any
   **/
  create(req, env) {}

  /**
   * Perform any cleanup required before
   * the termination of the request.
   * @abstract
   **/
  destroy() {}
}

module.exports = Middleware;