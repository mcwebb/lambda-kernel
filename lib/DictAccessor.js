'use strict';

class DictAccessor {
  constructor(dict) {
    this.dict = dict;
  }

  has(key) {
    return this.dict.hasOwnProperty(key);
  }

  get(key, defaultVal) {
    if (!defaultVal) defaultVal = null;

    if (this.dict.hasOwnProperty(key))
      return this.dict[key];
    else return defaultVal;
  }

  all() {
    return Object.assign({}, this.dict);
  }
}

module.exports = DictAccessor;