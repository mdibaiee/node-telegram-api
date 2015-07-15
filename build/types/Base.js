'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _events = require('events');

var ANSWER_THRESHOLD = 10;

/**
 * Base class of all classes
 */

var Base = (function (_EventEmitter) {
  function Base(method) {
    _classCallCheck(this, Base);

    _get(Object.getPrototypeOf(Base.prototype), 'constructor', this).call(this);

    this.method = method;
    this.properties = {};
  }

  _inherits(Base, _EventEmitter);

  _createClass(Base, [{
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

      if (this._keyboard) {
        var reply_markup = JSON.stringify(this._keyboard.getProperties());
        this.properties.reply_markup = reply_markup;
      }

      var messageId = undefined;
      return new Promise(function (resolve) {
        bot.api[_this.method](_this.properties).then(function (response) {
          messageId = response.result.message_id;
          _this.emit('message:sent', response);
        });

        if (_this._keyboard.one_time_keyboard) {
          _this._keyboard.replyMarkup = '';
        }

        var chat = _this.properties.chat_id;
        var answers = 0;
        bot.on('update', function listener(result) {
          answers += result.length;

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

          if (answers >= ANSWER_THRESHOLD) {
            bot.removeListener('update', listener);
          }
        });
      });
    }
  }, {
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
