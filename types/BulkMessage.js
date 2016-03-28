'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Message2 = require('./Message');

var _Message3 = _interopRequireDefault(_Message2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Message class, used to send a message to multiple chats
 */

var BulkMessage = function (_Message) {
  _inherits(BulkMessage, _Message);

  /**
   * Create a new message
   * @param  {object} properties Message properties, as defined by Telegram API
   */

  function BulkMessage() {
    var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BulkMessage);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BulkMessage).call(this, properties));

    _this.chats = [];
    return _this;
  }

  /**
   * Set multiple chat_id's for the message
   * @param  {number} chat
   * @return {object} returns the message object
   */


  _createClass(BulkMessage, [{
    key: 'to',
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

    /**
     * Send the message to all chats
     * @param  {Bot} bot
     * @return {Promise} Resolved when the message is sent to all chats
     */

  }, {
    key: 'send',
    value: function send(bot) {
      var _this2 = this;

      var promises = this.chats.map(function (chat) {
        var clone = Object.assign({}, _this2.properties);
        var message = new _Message3.default(clone).to(chat);
        return message.send(bot);
      });

      return Promise.all(promises);
    }
  }]);

  return BulkMessage;
}(_Message3.default);

exports.default = BulkMessage;
module.exports = exports['default'];
