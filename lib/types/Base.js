import {EventEmitter} from 'events';

/**
 * Base class of all classes
 */
export default class Base extends EventEmitter {
  constructor() {
    super();
    this.properties = {};
  }

  /**
   * Returns properties of the object
   * @return {object} properties of object
   */
  getProperties() {
    return this.properties;
  }

  /**
   * Set properties of the object
   * @param {object} object properties to set
   * @param {boolean} extend A boolean indicating if the properties should be
   *                         extended by the object provided (Object.assign)
   *                         or properties should be replaced by the object
   *                         defaults to true
   * @return {object} returns the properties (same as getProperties)
   */
  setProperties(object, extend = true) {
    this.properties = extend ? Object.assign(this.properties, object)
                             : object;

    return this.getProperties();
  }
}
