'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _functionsApi = require('./functions/api');

var _functionsApi2 = _interopRequireDefault(_functionsApi);

var _functionsWebhook = require('./functions/webhook');

var _functionsWebhook2 = _interopRequireDefault(_functionsWebhook);

var _functionsPoll = require('./functions/poll');

var _functionsPoll2 = _interopRequireDefault(_functionsPoll);

var _functionsArgumentParser = require('./functions/argument-parser');

var _functionsArgumentParser2 = _interopRequireDefault(_functionsArgumentParser);

var _events = require('events');

var _typesMessage = require('./types/Message');

var _typesMessage2 = _interopRequireDefault(_typesMessage);

var DEFAULTS = {
  update: {
    offset: 0,
    timeout: 20,
    limit: 100
  }
};

var REQUIRED = 0;
var OPTIONAL = 1;

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

    this.api = new _functionsApi2['default'](this.token);

    this.msg = {};

    // EventEmitter
    this._events = {};
    this._userEvents = [];

    this.setMaxListeners(100);
  }

  _inherits(Bot, _EventEmitter);

  _createClass(Bot, [{
    key: 'start',

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
    value: function start(hook) {
      var _this = this;

      if (hook) {
        return (0, _functionsWebhook2['default'])(hook, this);
      }
      return this.api.getMe().then(function (response) {
        _this.info = response.result;

        _this.on('update', _this._update);

        if (hook) {
          return (0, _functionsWebhook2['default'])(hook, _this);
        } else {
          return (0, _functionsPoll2['default'])(_this);
        }
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
     * @param  {string} command the command string, should not include slash (/)
     * @param  {function} listener function to call when the command is received,
     *                           gets the update
     * @return {object} returns the bot object
     */
    value: function command(_command, listener) {
      var regex = /[^\s]+/;

      var cmd = _command.match(regex)[0].trim();

      this._userEvents.push({
        pattern: new RegExp('^/' + cmd),
        parse: _functionsArgumentParser2['default'].bind(null, _command),
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
  }, {
    key: 'stop',

    /**
     * Stops the bot, deattaching all listeners and polling
     */
    value: function stop() {
      this._stop = true;

      if (this._webhookServer) {
        this._webhookServer.close();
      }

      this.removeListener('update', this._update);
      this._events = {};
    }
  }, {
    key: '_update',

    /**
     * The internal update event listener, used to parse messages and fire
     * command/get events - YOU SHOULD NOT USE THIS
     *
     * @param  {object} update
     */
    value: function _update(update) {
      var _this2 = this;

      if (!this.update.offset) {
        var updateId = update[update.length - 1].update_id;
        this.update.offset = updateId;
      }
      if (this.update) {
        this.update.offset += 1;
      }

      update.forEach(function (res) {
        var marked3$0 = [getAnswer].map(regeneratorRuntime.mark);

        var text = res.message.text;
        if (!text) return;

        var selfUsername = '@' + _this2.info.username;

        if (text.startsWith('/') && text.indexOf(selfUsername) > -1) {
          // Commands are sent in /command@thisusername format in groups
          var regex = new RegExp('(/.*)@' + _this2.info.username);
          text = text.replace(regex, '$1');
          res.message.text = text;
        }

        var ev = _this2._userEvents.find(function (_ref) {
          var pattern = _ref.pattern;
          return pattern.test(text);
        });

        if (!ev) {
          _this2.emit('command-notfound', res.message);
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

        var bot = _this2;
        function getAnswer() {
          var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

          return regeneratorRuntime.wrap(function getAnswer$(context$4$0) {
            var _this3 = this;

            while (1) switch (context$4$0.prev = context$4$0.next) {
              case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                context$4$0.prev = 3;
                _loop = regeneratorRuntime.mark(function callee$4$0() {
                  var param, msg;
                  return regeneratorRuntime.wrap(function callee$4$0$(context$5$0) {
                    while (1) switch (context$5$0.prev = context$5$0.next) {
                      case 0:
                        param = _step.value;
                        msg = new _typesMessage2['default']().to(res.message.chat.id).text('Enter value for ' + param);
                        context$5$0.next = 4;
                        return bot.send(msg).then(function (answer) {
                          args[param] = answer.text;
                        });

                      case 4:
                      case 'end':
                        return context$5$0.stop();
                    }
                  }, callee$4$0, _this3);
                });
                _iterator = requiredParams[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  context$4$0.next = 11;
                  break;
                }

                return context$4$0.delegateYield(_loop(), 't0', 8);

              case 8:
                _iteratorNormalCompletion = true;
                context$4$0.next = 6;
                break;

              case 11:
                context$4$0.next = 17;
                break;

              case 13:
                context$4$0.prev = 13;
                context$4$0.t1 = context$4$0['catch'](3);
                _didIteratorError = true;
                _iteratorError = context$4$0.t1;

              case 17:
                context$4$0.prev = 17;
                context$4$0.prev = 18;

                if (!_iteratorNormalCompletion && _iterator['return']) {
                  _iterator['return']();
                }

              case 20:
                context$4$0.prev = 20;

                if (!_didIteratorError) {
                  context$4$0.next = 23;
                  break;
                }

                throw _iteratorError;

              case 23:
                return context$4$0.finish(20);

              case 24:
                return context$4$0.finish(17);

              case 25:
              case 'end':
                return context$4$0.stop();
            }
          }, marked3$0[0], this, [[3, 13, 17, 25], [18,, 20, 24]]);
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
})(_events.EventEmitter);

exports['default'] = Bot;
module.exports = exports['default'];
