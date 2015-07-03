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

var _Keyboard = require('./Keyboard');

var _Keyboard2 = _interopRequireDefault(_Keyboard);

/**
 * Question class, extends Message
 * Sends a message, shows a keyboard with the answers provided, and validates
 * the answer
 */

var Question = (function (_Message) {
  /**
   * Create a new question
   * @param  {object} options Options, same as Message, plus `answers` which
   *                          is a keyboard layout, see Keyboard#keys
   */

  function Question() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Question);

    _get(Object.getPrototypeOf(Question.prototype), 'constructor', this).call(this, options);

    var kb = new _Keyboard2['default']().force().oneTime().selective();
    this.keyboard(kb);

    this.answers(options.answers);
  }

  _inherits(Question, _Message);

  _createClass(Question, [{
    key: 'answers',

    /**
     * Sets answers of the question. This is passed to Keyboard#keys, and then
     * used to validate the answer given
     * @param  {array} answers Array of arrays of strings, same as Keyboard#keys
     * @return {object} returns the question object
     */
    value: function answers(_answers) {
      this._answers = _answers;
      this._keyboard.keys(_answers);
      return this;
    }
  }, {
    key: 'send',

    /**
     * Sends the question (same as Message#send), and validates the answer given
     * if the answer is one of the defined answers, resolves, else rejects
     * You should not manually use this method unless you're extending this class
     * You should instead use bot.send(question);
     * @param  {object} bot
     * @return {promise} A promise which is resolved in case of valid answer, and
     *                     rejected in case of invalid answer
     */
    value: function send(bot) {
      var _this = this;

      var answers = this._answers;

      return _get(Object.getPrototypeOf(Question.prototype), 'send', this).call(this, bot).then(function (message) {
        var answer = undefined;

        answers.forEach(function find(a) {
          if (Array.isArray(a)) {
            a.forEach(find);
          }
          if (a === message.text) {
            answer = a;
          }
        });

        if (answer) {
          _this.emit('question:answer', answer, message);
          return message;
        } else {
          _this.emit('question:invalid', message);
          throw message;
        }
      });
    }
  }]);

  return Question;
})(_Message3['default']);

exports['default'] = Question;
module.exports = exports['default'];
