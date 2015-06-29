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

    _get(Object.getPrototypeOf(Message.prototype), 'constructor', this).call(this);

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
  }, {
    key: 'send',

    /**
     * Sends the message, you should only use this method yourself if
     * you are extending this class. Normally you should call bot.send(message)
     *
     * Events: message:sent => Emitted after sending the message to API, gets the
     * 												  API's response
     *
     *			message:answer => Emitted when your message gets an answer from
     *				                 the contact (reply in case of groups)
     *				                 gets the Update object containing message
     *
     * @param  {object} bot
     * @return {promise} returns a promise, resolved with message:answer
     */
    value: function send(bot) {
      var _this = this;

      console.log('sending message');

      var messageId = undefined;
      var reply_markup = JSON.stringify(this._keyboard.getProperties());
      this.properties.reply_markup = reply_markup;

      return new Promise(function (resolve) {
        bot.api.sendMessage(_this.properties).then(function (response) {
          messageId = response.result.message_id;
          _this.emit('message:sent', response);
        });

        if (_this._keyboard.one_time_keyboard) {
          _this._keyboard.replyMarkup = '';
        }

        var chat = _this.properties.chat_id;
        bot.on('update', function listener(result) {
          var update = result.find(function (_ref) {
            var message = _ref.message;

            // if in a group, there will be a reply to this message
            if (chat < 0) {
              return message.chat.id === chat && message.reply_to_message && message.reply_to_message.message_id === messageId;
            } else {
              return message.chat.id === chat;
            }
          });

          if (update) {
            resolve(update.message);

            this.emit('message:answer', update.message);

            bot.removeListener('update', listener);
          }
        });
      })['catch'](console.error);
    }
  }]);

  return Message;
})(_Base3['default']);

exports['default'] = Message;
module.exports = exports['default'];
