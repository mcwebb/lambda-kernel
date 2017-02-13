'use strict';

const DictAccessor = require('./DictAccessor');

/**
 * Request object provided to your action by the dispatcher.
 * You use this to access the event request data.
 */
class Request {
  constructor(event, transformer) {
    this._data = transformer.parseFromEvent(event);
  }

  /**
   * The HTTP path requested
   * @return {string}
   */
  get path() {
    return this._data.path;
  }

  /**
   * The HTTP request method
   * @return {string}
   */
  get method() {
    return this._data.method;
  }

  /**
   * The HTTP request path query params
   * @return {DictAccessor}
   */
  get query() {
    return new DictAccessor(this._data.query);
  }

  /**
   * The HTTP request headers
   * @return {DictAccessor}
   */
  get headers() {
    return new DictAccessor(this._data.headers);
  }

  /**
   * The HTTP request body
   * @return {DictAccessor}
   */
  get body() {
    return new DictAccessor(this._data.body);
  }
}

module.exports = Request;