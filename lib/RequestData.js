'use strict';

class RequestData {
  constructor(path, method, headers, body, query) {
    this.private = {};
    this.private.path = path;
    this.private.method = method;
    this.private.headers = headers;
    this.private.body = body;
    this.private.query = query;
  }

  get path() {
    return this.private.path;
  }

  get method() {
    return this.private.method;
  }

  get headers() {
    return this.private.headers;
  }

  get body() {
    return this.private.body;
  }

  get query() {
    return this.private.query;
  }
}

module.exports = RequestData;