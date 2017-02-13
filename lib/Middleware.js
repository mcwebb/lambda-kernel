'use strict';

/**
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
   * Return the object which should be
   * passed to the controller method.
   * @abstract
   * @param {Request} req
   * @param {object} env
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