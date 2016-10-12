'use strict';

class Response {
  constructor(body, code) {
    this.body = body;

    switch (typeof code) {
      case 'undefined':
        this.code = 200;
        break;
      case 'number':
        this.code = code;
        break;
      default:
        throw new TypeError('Response code must be an integer');
        break;
    }
  }

  simplify() {
    return {
      statusCode: this.code,
      body: JSON.stringify(this.body)
    };
  }
}

module.exports = Response;