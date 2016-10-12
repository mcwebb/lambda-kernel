const partialRight = require('lodash.partialright');
const dispatcher = require('./lib/dispatcher');

module.exports = {
  dispatch: function (action, middleware) {
    return partialRight(dispatcher, action, middleware)
  }
};