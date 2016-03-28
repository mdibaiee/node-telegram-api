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
 * Message class, used to send message to a chat
 */

var Message = function (_Base) {
  _inherits(Message, _Base);

  /**
   * Create a new message
   * @param  {object} properties Message properties, as defined by Telegram API
   */

  function Message() {
    var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Message);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Message).call(this, 'sendMessage'));

    _this.properties = properties;
    _this._keyboard = new _Base3.default();
    return _this;
  }

  /**
   * Set chat_id of the message
   * @param  {number} chat
   * @return {object} returns the message object
   */


  _createClass(Message, [{
    key: 'to',
    value: function to(chat) {
      this.properties.chat_id = chat;
      return this;
    }

    /**
     * Set text of the message
     * @param  {string} text Message's content
     * @return {object} returns the message object
     */

  }, {
    key: 'text',
    value: function text(_text) {
      this.properties.text = _text;
      return this;
    }

    /**
     * Set text of the message in HTML format
     * @param  {string} text Message's content in HTML format
     * @return {object} returns the message object
     */

  }, {
    key: 'html',
    value: function html(text) {
      this.properties.parse_mode = 'HTML';
      if (text) {
        this.properties.text = text;
      }
      return this;
    }

    /**
     * Set text of the message in Markdown format
     * @param  {string} text Message's content in Markdown format
     * @return {object} returns the message object
     */

  }, {
    key: 'markdown',
    value: function markdown(text) {
      this.properties.parse_mode = 'Markdown';
      if (text) {
        this.properties.text = text;
      }
      return this;
    }

    /**
     * Set reply_to_message_id of the message
     * @param  {number} id message_id of the message to reply to
     * @return {object} returns the message object
     */

  }, {
    key: 'reply',
    value: function reply(id) {
      this.properties.reply_to_message_id = id;
      return this;
    }

    /**
     * Set disable_web_page_preview of the message
     * @param  {boolean} enable
     * @return {object} returns the message object
     */

  }, {
    key: 'preview',
    value: function preview() {
      var enable = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      this.properties.disable_web_page_preview = !enable;
      return this;
    }

    /**
     * Sets keyboard of the message
     * The value of reply_markup is set to the sanitized keyboard properties
     * i.e. reply_markup = JSON.stringify(kb.getProperties())
     * @param  {object} kb A Keyboard instance
     * @return {object} returns the message object
     */

  }, {
    key: 'keyboard',
    value: function keyboard(kb) {
      this._keyboard = kb;
      return this;
    }

    // This class inherits Base's send method

  }]);

  return Message;
}(_Base3.default);

exports.default = Message;
module.exports = exports['default'];
