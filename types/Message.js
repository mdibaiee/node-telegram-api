'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Base2 = require('./Base');

var _Base3 = _interopRequireDefault(_Base2);

/**
 * Message class, used to send message to a chat
 */

var Message = (function (_Base) {
  /**
   * Create a new message
   * @param  {object} properties Message properties, as defined by Telegram API
   */

  function Message() {
    var properties = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Message);

    _get(Object.getPrototypeOf(Message.prototype), 'constructor', this).call(this, 'sendMessage');

    this.properties = properties;
    this._keyboard = new _Base3['default']();
  }

  _inherits(Message, _Base);

  _createClass(Message, [{
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
    key: 'text',

    /**
     * Set text of the message
     * @param  {string} text Message's content
     * @return {object} returns the message object
     */
    value: function text(_text) {
      this.properties.text = _text;
      return this;
    }
  }, {
    key: 'reply',

    /**
     * Set reply_to_message_id of the message
     * @param  {number} id message_id of the message to reply to
     * @return {object} returns the message object
     */
    value: function reply(id) {
      this.properties.reply_to_message_id = id;
      return this;
    }
  }, {
    key: 'preview',

    /**
     * Set disable_web_page_preview of the message
     * @param  {boolean} enable
     * @return {object} returns the message object
     */
    value: function preview() {
      var enable = arguments[0] === undefined ? true : arguments[0];

      this.properties.disable_web_page_preview = !enable;
      return this;
    }
  }, {
    key: 'keyboard',

    /**
     * Sets keyboard of the message
     * The value of reply_markup is set to the sanitized keyboard properties
     * i.e. reply_markup = JSON.stringify(kb.getProperties())
     * @param  {object} kb A Keyboard instance
     * @return {object} returns the message object
     */
    value: function keyboard(kb) {
      this._keyboard = kb;
      return this;
    }

    // This class inherits Base's send method

  }]);

  return Message;
})(_Base3['default']);

exports['default'] = Message;
module.exports = exports['default'];
