'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Keyboard = exports.Question = exports.Forward = exports.BulkMessage = exports.Message = exports.File = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('babel-polyfill');

var _api = require('./functions/api');

var _api2 = _interopRequireDefault(_api);

var _webhook = require('./functions/webhook');

var _webhook2 = _interopRequireDefault(_webhook);

var _poll = require('./functions/poll');

var _poll2 = _interopRequireDefault(_poll);

var _argumentParser = require('./functions/argument-parser');

var _argumentParser2 = _interopRequireDefault(_argumentParser);

var _events = require('events');

var _Message = require('./types/Message');

var _Message2 = _interopRequireDefault(_Message);

var _File = require('./types/File');

var _File2 = _interopRequireDefault(_File);

var _Keyboard = require('./types/Keyboard');

var _Keyboard2 = _interopRequireDefault(_Keyboard);

var _BulkMessage = require('./types/BulkMessage');

var _BulkMessage2 = _interopRequireDefault(_BulkMessage);

var _Question = require('./types/Question');

var _Question2 = _interopRequireDefault(_Question);

var _Forward = require('./types/Forward');

var _Forward2 = _interopRequireDefault(_Forward);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULTS = {
  update: {
    offset: 0,
    timeout: 20,
    limit: 100
  }
};

var REQUIRED = 0;

console.log(_poll2.default);

/**
 * Bot class used to connect to a new bot
 * Bots have an api property which gives access to all Telegram API methods,
 * see API class
 */

var Bot = function (_EventEmitter) {
  _inherits(Bot, _EventEmitter);

  /**
   * Create and connect to a new bot
   * @param  {object} options Bot properties.
   */

  function Bot() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? { update: {} } : arguments[0];

    _classCallCheck(this, Bot);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Bot).call(this));

    if (!options.token) {
      throw new Error('Token cannot be empty');
    }

    _this.token = options.token;
    _this.update = Object.assign(options.update || {}, DEFAULTS.update);

    _this.api = new _api2.default(_this.token);

    _this.msg = {};

    // EventEmitter
    _this._events = {};
    _this._userEvents = [];

    _this.setMaxListeners(100);
    return _this;
  }

  /**
   * Gets information about the bot and then
   * 1) starts polling updates from API
   * 2) sets a webhook as defined by the first parameter and listens for updates
   * Emits an `update` event after polling with the response from server
   * Returns a promise which is resolved after the bot information is received
   * and set to it's `info` property i.e. bot.info
   *
   * @param {object} hook An object containg options passed to webhook
   *                      properties:
   *                       - url: HTTPS url to listen on POST requests coming
   *                              from the Telegram API
   *                       - port: the port to listen to, defaults to 443
   *                       - server: An object passed to https.createServer
   *
   * @return {promise} A promise which is resolved with the response of getMe
   */


  _createClass(Bot, [{
    key: 'start',
    value: function start(hook) {
      var _this2 = this;

      if (hook) {
        return (0, _webhook2.default)(hook, this);
      }
      return this.api.getMe().then(function (response) {
        _this2.info = response.result;

        _this2.on('update', _this2._update);

        if (hook) {
          return (0, _webhook2.default)(hook, _this2);
        } else {
          return (0, _poll2.default)(_this2);
        }
      });
    }

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

  }, {
    key: 'get',
    value: function get(pattern, listener) {
      if (typeof pattern === 'string') {
        pattern = new RegExp('^' + pattern);
      }

      this._userEvents.push({
        pattern: pattern, listener: listener
      });

      return this;
    }

    /**
     * Listens on a command
     * @param  {string} command the command string, should not include slash (/)
     * @param  {function} listener function to call when the command is received,
     *                           gets the update
     * @return {object} returns the bot object
     */

  }, {
    key: 'command',
    value: function command(_command, listener) {
      var regex = /[^\s]+/;

      var cmd = _command.match(regex)[0].trim();

      this._userEvents.push({
        pattern: new RegExp('^/' + cmd),
        parse: _argumentParser2.default.bind(null, _command),
        listener: listener
      });

      return this;
    }

    /**
     * Sends the message provided
     * @param  {object} message The message to send. Gets it's send method called
     * @return {unknown} returns the result of calling message's send method
     */

  }, {
    key: 'send',
    value: function send(message) {
      return message.send(this).catch(console.error);
    }

    /**
     * Stops the bot, deattaching all listeners and polling
     */

  }, {
    key: 'stop',
    value: function stop() {
      this._stop = true;

      if (this._webhookServer) {
        this._webhookServer.close();
      }

      this.removeListener('update', this._update);
      this._events = {};
    }

    /**
     * The internal update event listener, used to parse messages and fire
     * command/get events - YOU SHOULD NOT USE THIS
     *
     * @param  {object} update
     */

  }, {
    key: '_update',
    value: function _update(update) {
      var _this3 = this;

      if (!this.update.offset) {
        var updateId = update[update.length - 1].update_id;
        this.update.offset = updateId;
      }
      if (this.update) {
        this.update.offset += 1;
      }

      update.forEach(function (res) {
        var _marked = [getAnswer].map(regeneratorRuntime.mark);

        var text = res.message.text;
        if (!text) {
          return;
        }

        var selfUsername = '@' + _this3.info.username;

        if (text.startsWith('/') && text.indexOf(selfUsername) > -1) {
          // Commands are sent in /command@thisusername format in groups
          var regex = new RegExp('(/.*)@' + _this3.info.username);
          text = text.replace(regex, '$1');
          res.message.text = text;
        }

        var ev = _this3._userEvents.find(function (_ref) {
          var pattern = _ref.pattern;
          return pattern.test(text);
        });

        if (!ev) {
          _this3.emit('command-notfound', res.message);
          return;
        }

        if (!ev.parse) {
          ev.listener(res.message);
          return;
        }

        var _ev$parse = ev.parse(res.message.text);

        var params = _ev$parse.params;
        var args = _ev$parse.args;

        res.message.args = args;

        var requiredParams = Object.keys(params).filter(function (param) {
          return params[param] === REQUIRED && !args[param];
        });

        if (!requiredParams.length) {
          ev.listener(res.message);
          return;
        }

        var bot = _this3;
        function getAnswer() {
          var _this4 = this;

          var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

          return regeneratorRuntime.wrap(function getAnswer$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _iteratorNormalCompletion = true;
                  _didIteratorError = false;
                  _iteratorError = undefined;
                  _context2.prev = 3;
                  _loop = regeneratorRuntime.mark(function _loop() {
                    var param, msg;
                    return regeneratorRuntime.wrap(function _loop$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            param = _step.value;
                            msg = new _Message2.default().to(res.message.chat.id).text('Enter value for ' + param);
                            _context.next = 4;
                            return bot.send(msg).then(function (answer) {
                              args[param] = answer.text;
                            });

                          case 4:
                          case 'end':
                            return _context.stop();
                        }
                      }
                    }, _loop, _this4);
                  });
                  _iterator = requiredParams[Symbol.iterator]();

                case 6:
                  if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                    _context2.next = 11;
                    break;
                  }

                  return _context2.delegateYield(_loop(), 't0', 8);

                case 8:
                  _iteratorNormalCompletion = true;
                  _context2.next = 6;
                  break;

                case 11:
                  _context2.next = 17;
                  break;

                case 13:
                  _context2.prev = 13;
                  _context2.t1 = _context2['catch'](3);
                  _didIteratorError = true;
                  _iteratorError = _context2.t1;

                case 17:
                  _context2.prev = 17;
                  _context2.prev = 18;

                  if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                  }

                case 20:
                  _context2.prev = 20;

                  if (!_didIteratorError) {
                    _context2.next = 23;
                    break;
                  }

                  throw _iteratorError;

                case 23:
                  return _context2.finish(20);

                case 24:
                  return _context2.finish(17);

                case 25:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _marked[0], this, [[3, 13, 17, 25], [18,, 20, 24]]);
        }

        var iterator = getAnswer();
        (function loop() {
          var next = iterator.next();
          if (next.done) {
            ev.listener(res.message);
            return;
          }

          next.value.then(loop);
        })();
      });
    }
  }]);

  return Bot;
}(_events.EventEmitter);

exports.default = Bot;
exports.File = _File2.default;
exports.Message = _Message2.default;
exports.BulkMessage = _BulkMessage2.default;
exports.Forward = _Forward2.default;
exports.Question = _Question2.default;
exports.Keyboard = _Keyboard2.default;
