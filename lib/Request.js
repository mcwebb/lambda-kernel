'use strict';

const DictAccessor = require('./DictAccessor');

class Request {
  constructor(event, transformer) {
    this._data = transformer.parseFromEvent(event);
  }

  get path() {
    return this._data.path;
  }

  get method() {
    return this._data.method;
  }

  get query() {
    return new DictAccessor(this._data.query);
  }

  get headers() {
    return new DictAccessor(this._data.headers);
  }

  get body() {
    return new DictAccessor(this._data.body);
  }
}

module.exports = Request;