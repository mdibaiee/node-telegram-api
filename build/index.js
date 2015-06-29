'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

require('babel/polyfill');

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _events = require('events');

var DEFAULTS = {
  update: {
    offset: 0,
    timeout: 0.5,
    limit: 100
  }
};

process.on('uncaughtException', function (err) {
  console.error(err.stack);
});

/**
 * Bot class used to connect to a new bot
 * Bots have an api property which gives access to all Telegram API methods,
 * see API class
 */

var Bot = (function (_EventEmitter) {
  /**
   * Create and connect to a new bot
   * @param  {object} options Bot properties.
   */

  function Bot() {
    var options = arguments[0] === undefined ? { update: {} } : arguments[0];

    _classCallCheck(this, Bot);

    _get(Object.getPrototypeOf(Bot.prototype), 'constructor', this).call(this);

    if (!options.token) {
      throw new Error('Token cannot be empty');
    }

    this.token = options.token;
    this.update = Object.assign(options.update || {}, DEFAULTS.update);

    this.api = new _api2['default'](this.token);

    this.msg = {};

    // EventEmitter
    this._events = {};
    this._userEvents = [];
  }

  _inherits(Bot, _EventEmitter);

  _createClass(Bot, [{
    key: 'start',

    /**
     * Gets information about the bot and then starts polling updates from API
     * Emits an `update` event after polling with the response from server
     * Returns a promise which is resolved after the bot information is received
     * and set to it's `info` property i.e. bot.info
     * @return {promise} A promise which is resolved with the response of getMe
     */
    value: function start() {
      var _this2 = this;

      var poll = (function () {
        var _this = this;

        return this.api.getUpdates(this.update).then(function (response) {
          var again = wait(_this.update.timeout * 1000).then(poll);

          var result = response.result;
          if (!result.length) {
            return again;
          }

          if (!_this.update.offset) {
            var updateId = result[result.length - 1].update_id;
            _this.update.offset = updateId;
          }
          if (_this.update) {
            _this.update.offset += 1;
          }

          _this.emit('update', result);

          result.forEach(function (res) {
            var text = res.message.text;
            if (text.startsWith('/')) {
              // Commands are sent in /command@botusername format in groups
              var regex = new RegExp('@' + _this.info.username + '$');
              text = text.replace(regex, '');
            }

            var ev = _this._userEvents.find(function (_ref) {
              var pattern = _ref.pattern;
              return pattern.test(text);
            });

            if (!ev) {
              return;
            }
            ev.listener(res.message);
          });

          return again;
        });
      }).bind(this);

      return this.api.getMe().then(function (response) {
        _this2.info = response.result;
        return poll();
      });
    }
  }, {
    key: 'get',

    /**
     * Listens on specific message matching the pattern which can be an string
     * or a regexp.
     * @param  {string/regex} pattern
     * @param  {function} listener function to call when a message matching the
     *                             pattern is found, gets the Update
     *                             In case of string, the message should start
     *                             with the string i.e. /^yourString/
     * @return {object} returns the bot object
     */
    value: function get(pattern, listener) {
      if (typeof pattern === 'string') {
        pattern = new RegExp('^' + pattern);
      }

      this._userEvents.push({
        pattern: pattern, listener: listener
      });

      return this;
    }
  }, {
    key: 'command',

    /**
     * Listens on a command
     * @param  {string} cmd the command string, should not include slash (/)
     * @param  {function} listener function to call when the command is received,
     *                           gets the update
     * @return {object} returns the bot object
     */
    value: function command(cmd, listener) {
      this._userEvents.push({
        pattern: new RegExp('/' + cmd),
        listener: listener
      });

      return this;
    }
  }, {
    key: 'send',

    /**
     * Sends the message provided
     * @param  {object} message The message to send. Gets it's send method called
     * @return {unknown} returns the result of calling message's send method
     */
    value: function send(message) {
      return message.send(this)['catch'](console.error);
    }
  }]);

  return Bot;
})(_events.EventEmitter);

exports['default'] = Bot;

var wait = function wait(miliseconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, miliseconds);
  });
};
module.exports = exports['default'];
