'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _events = require('events');

/**
 * Base class of all classes
 */

var Base = (function (_EventEmitter) {
  function Base() {
    _classCallCheck(this, Base);

    _get(Object.getPrototypeOf(Base.prototype), 'constructor', this).call(this);
    this.properties = {};
  }

  _inherits(Base, _EventEmitter);

  _createClass(Base, [{
    key: 'getProperties',

    /**
     * Returns properties of the object
     * @return {object} properties of object
     */
    value: function getProperties() {
      return this.properties;
    }
  }, {
    key: 'setProperties',

    /**
     * Set properties of the object
     * @param {object} object properties to set
     * @param {boolean} extend A boolean indicating if the properties should be
     *                         extended by the object provided (Object.assign)
     *                         or properties should be replaced by the object
     *                         defaults to true
     * @return {object} returns the properties (same as getProperties)
     */
    value: function setProperties(object) {
      var extend = arguments[1] === undefined ? true : arguments[1];

      this.properties = extend ? Object.assign(this.properties, object) : object;

      return this.getProperties();
    }
  }]);

  return Base;
})(_events.EventEmitter);

exports['default'] = Base;
module.exports = exports['default'];
