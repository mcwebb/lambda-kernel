'use strict';

class Response {
  constructor(body, code, headers) {
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

    if (!headers) {
      this.headers = {
        'Access-Control-Allow-Origin': '*'
      };
    } else this.headers = headers;
  }

  simplify() {
    return {
      statusCode: this.code,
      body: JSON.stringify(this.body),
      headers: this.headers
    };
  }
}

module.exports = Response;