'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Message2 = require('./Message');

var _Message3 = _interopRequireDefault(_Message2);

/**
 * Message class, used to send a message to multiple chats
 */

var BulkMessage = (function (_Message) {
  /**
   * Create a new message
   * @param  {object} properties Message properties, as defined by Telegram API
   */

  function BulkMessage() {
    var properties = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BulkMessage);

    _get(Object.getPrototypeOf(BulkMessage.prototype), 'constructor', this).call(this, properties);

    this.chats = [];
  }

  _inherits(BulkMessage, _Message);

  _createClass(BulkMessage, [{
    key: 'to',

    /**
     * Set multiple chat_id's for the message
     * @param  {number} chat
     * @return {object} returns the message object
     */
    value: function to() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var chats = args.reduce(function (a, b) {
        return a.concat(b);
      }, []);

      this.chats = chats;
      return this;
    }
  }, {
    key: 'send',

    /**
     * Send the message to all chats
     * @param  {Bot} bot
     * @return {Promise} Resolved when the message is sent to all chats
     */
    value: function send(bot) {
      var _this = this;

      var promises = this.chats.map(function (chat) {
        var clone = Object.assign({}, _this.properties);
        var message = new _Message3['default'](clone).to(chat);
        return message.send(bot);
      });

      return Promise.all(promises);
    }
  }]);

  return BulkMessage;
})(_Message3['default']);

exports['default'] = BulkMessage;
module.exports = exports['default'];
