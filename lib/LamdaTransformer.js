'use strict';

const RequestData = require('./RequestData');

class LamdaTransformer {
  /**
   * @param event
   * @return RequestData
   **/
  parseFromEvent(event) {
    return new RequestData(
      this.parsePath(event.path),
      this.parseMethod(event.httpMethod),
      this.parseHeaders(event.headers),
      this.parseBody(event.body),
      this.parseQuery(event.queryStringParameters)
    );
  }

  parsePath(val) {
    return val;
  }

  parseMethod(val) {
    return val;
  }

  parseHeaders(val) {
    return val;
  }

  parseBody(val) {
    return JSON.parse(val);
  }

  parseQuery(val) {
    return val;
  }
}

module.exports = LamdaTransformer;