'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Base2 = require('./Base');

var _Base3 = _interopRequireDefault(_Base2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Forward class, used to forward messages from a chat to another
 */

var Forward = function (_Base) {
  _inherits(Forward, _Base);

  /**
   * Create a new forward message
   * @param  {object} properties Forward Message properties, as defined by
   *                             Telegram API
   */

  function Forward() {
    var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Forward);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Forward).call(this, 'forwardMessage'));

    _this.properties = properties;
    _this._keyboard = new _Base3.default();
    return _this;
  }

  /**
   * Set chat_id of the message
   * @param  {number} chat
   * @return {object} returns the message object
   */


  _createClass(Forward, [{
    key: 'to',
    value: function to(chat) {
      this.properties.chat_id = chat;
      return this;
    }

    /**
     * Set from_chat_id, source of message's chat's id
     * @param  {number} chat Source chat id
     * @return {object} returns the message object
     */

  }, {
    key: 'from',
    value: function from(chat) {
      this.properties.from_chat_id = chat;
      return this;
    }

    /**
     * Sets message_id, the message to forward from source to target chat
     * @param  {number} message ID of the message to forward
     * @return {object} returns the message object
     */

  }, {
    key: 'message',
    value: function message(_message) {
      this.properties.message_id = _message;
      return this;
    }

    // This class inherits Base's send method

  }]);

  return Forward;
}(_Base3.default);

exports.default = Forward;
module.exports = exports['default'];
