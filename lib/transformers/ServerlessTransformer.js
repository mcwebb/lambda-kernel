'use strict';

const Transformer = require('./Transformer');

class ServerlessTransformer extends Transformer {
  parsePath(event) {
    return event.path;
  }

  parseMethod(event) {
    return event.httpMethod;
  }

  parseHeaders(event) {
    return event.headers;
  }

  parseQuery(event) {
    return event.queryStringParameters;
  }

  getRawBody(event) {
    return event.body;
  }
}

module.exports = ServerlessTransformer;