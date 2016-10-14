'use strict';

const RequestData = require('./../RequestData');

class Transformer {
  /**
   * @param {function} bodyParser
   **/
  constructor(bodyParser) {
    this.bodyParser = bodyParser;
  }

  /**
   * @param {object} event
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