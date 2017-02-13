'use strict';

/**
 * You must return a Response from your action.
 */
class Response {
  /**
   * Construct a new response
   * @param {object} body - object to be serialized for HTTP body
   * @param {number} [code=200] - integer HTTP code
   * @param {object} [headers] - key/value map of any HTTP headers
   */
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

  /**
   * Generate and return Lambda integration object for the response.
   * @return {{statusCode: number, body: string, headers: Object}}
   */
  simplified() {
    return {
      statusCode: this.code,
      body: JSON.stringify(this.body),
      headers: this.headers
    };
  }
}

module.exports = Response;