'use strict';

const RequestData = require('./../RequestData');

/**
 * Abstract class that all transformers should extend and
 * implement the interface as below
 * @abstract
 */
class Transformer {
  /**
   * @param {function} bodyParser
   **/
  constructor(bodyParser) {
    this.bodyParser = bodyParser;
  }

  /**
   * @param {object} event - lambda integration event
   * @return {RequestData}
   **/
  parseFromEvent(event) {
    return new RequestData(
      this.parsePath(event),
      this.parseMethod(event),
      this.parseHeaders(event),
      this.parseBody(event),
      this.parseQuery(event)
    );
  }

  /**
   * @abstract
   * @param {object} event - lambda integration event
   * @return {object}
   **/
  parsePath(event) {
    throw new Error('must be implemented by subclass!');
  }

  /**
   * @abstract
   * @param {object} event - lambda integration event
   * @return {object}
   **/
  parseMethod(event) {
    throw new Error('must be implemented by subclass!');
  }

  /**
   * @abstract
   * @param {object} event - lambda integration event
   * @return {object}
   **/
  parseHeaders(event) {
    throw new Error('must be implemented by subclass!');
  }

  /**
   * @abstract
   * @param {object} event - lambda integration event
   * @return {object}
   **/
  parseQuery(event) {
    throw new Error('must be implemented by subclass!');
  }

  /**
   * Return the raw body string from the event structure
   * @abstract
   * @param {object} event
   * @return {string}
   **/
  getRawBody(event) {
    throw new Error('must be implemented by subclass!');
  }

  /**
   * Use the subclass' raw method with the provided
   * parser to get the final parsed request body
   * @private
   * @param {object} event
   * @return {object}
   **/
  parseBody(event) {
    return this.bodyParser(
      this.getRawBody(event)
    );
  }
}

module.exports = Transformer;