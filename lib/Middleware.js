'use strict';

class Middleware {
  constructor(req, env) {
    this.req = req;
    this.env = env;
  }

  create() {}

  destroy() {}
}

module.exports = Middleware;