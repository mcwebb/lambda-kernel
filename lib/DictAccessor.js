'use strict';

/**
 * Simple Dictionary (Map) accessor for data.
 */
class DictAccessor {
  constructor(dict) {
    this.dict = dict;
  }

  /**
   * Check whether the dictionary has the provided key.
   * @param {string} key - dictionary key to check
   * @return {boolean}
   */
  has(key) {
    return this.dict.hasOwnProperty(key);
  }

  /**
   * Ger the value for the provided key,
   * or the provided default value if the key
   * does not exist. Otherwise returns null.
   * @param {string} key - dictionary key to get
   * @param defaultVal - default value if key doesn't exist
   * @return {*}
   */
  get(key, defaultVal) {
    if (!defaultVal) defaultVal = null;

    if (this.dict.hasOwnProperty(key))
      return this.dict[key];
    else return defaultVal;
  }

  /**
   * Return a clone of this dictionary as
   * a simple JavaScript Object.
   * @return {Object}
   */
  all() {
    return Object.assign({}, this.dict);
  }
}

module.exports = DictAccessor;