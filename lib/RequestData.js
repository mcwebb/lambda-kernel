'use strict';

class RequestData {
  constructor(path, method, headers, body, query) {
    this.path = path;
    this.method = method;
    this.headers = headers;
    this.body = body;
    this.query = query;
  }
}

module.exports = RequestData;