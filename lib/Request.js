'use strict';

const DictAccessor = require('./DictAccessor');

class Request {
  constructor(event, transformer) {
    this.data = transformer.parseFromEvent(event);
  }

  get path() {
    return this.data.path;
  }

  get method() {
    return this.data.method;
  }

  get query() {
    return new DictAccessor(this.data.query);
  }

  get headers() {
    return new DictAccessor(this.data.headers);
  }

  get body() {
    return new DictAccessor(this.data.body);
  }
}

module.exports = Request;