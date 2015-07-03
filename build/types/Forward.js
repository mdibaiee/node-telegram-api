'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Base2 = require('./Base');

var _Base3 = _interopRequireDefault(_Base2);

/**
 * Forward class, used to forward messages from a chat to another
 */

var Forward = (function (_Base) {
  /**
   * Create a new forward message
   * @param  {object} properties Forward Message properties, as defined by
   *                             Telegram API
   */

  function Forward() {
    var properties = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Forward);

    _get(Object.getPrototypeOf(Forward.prototype), 'constructor', this).call(this, 'forwardMessage');

    this.properties = properties;
    this._keyboard = new _Base3['default']();
  }

  _inherits(Forward, _Base);

  _createClass(Forward, [{
    key: 'to',

    /**
     * Set chat_id of the message
     * @param  {number} chat
     * @return {object} returns the message object
     */
    value: function to(chat) {
      this.properties.chat_id = chat;
      return this;
    }
  }, {
    key: 'from',

    /**
     * Set from_chat_id, source of message's chat's id
     * @param  {number} chat Source chat id
     * @return {object} returns the message object
     */
    value: function from(chat) {
      this.properties.from_chat_id = chat;
      return this;
    }
  }, {
    key: 'message',

    /**
     * Sets message_id, the message to forward from source to target chat
     * @param  {number} message ID of the message to forward
     * @return {object} returns the message object
     */
    value: function message(_message) {
      this.properties.message_id = _message;
      return this;
    }

    // This class inherits Base's send method

  }]);

  return Forward;
})(_Base3['default']);

exports['default'] = Forward;
module.exports = exports['default'];
