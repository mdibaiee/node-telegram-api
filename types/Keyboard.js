'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x6, _x7, _x8) { var _again = true; _function: while (_again) { var object = _x6, property = _x7, receiver = _x8; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x6 = parent; _x7 = property; _x8 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Base2 = require('./Base');

var _Base3 = _interopRequireDefault(_Base2);

/**
 * Keyboard class, used to configure keyboards for messages.
 * You should pass your instance of this class to message.keyboard() method
 */

var Keyboard = (function (_Base) {
  /**
   * Create a new keyboard
   * @param  {object} properties Keyboard properties, as defined by Telegram API
   *                             See ReplyKeyboardMarkup, ReplyKeyboardHide,
   *                                 ForceReply
   */

  function Keyboard() {
    var properties = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Keyboard);

    _get(Object.getPrototypeOf(Keyboard.prototype), 'constructor', this).call(this);

    this.properties = properties;
  }

  _inherits(Keyboard, _Base);

  _createClass(Keyboard, [{
    key: 'keys',

    /**
     * Set the keyboard property of reply_markup
     * @param  {array} keys An array of arrays, with the format of
     *                            Column         Column
     *                      Row [['TopLeft',   'TopRight'],
     *                      Row ['BottomLeft', 'BottomRight']]
     * @return {object} returns the keyboard object
     */
    value: function keys(_keys) {
      this.properties.keyboard = _keys;
      this.properties.hide_keyboard = false;
      return this;
    }
  }, {
    key: 'force',

    /**
     * Set force_keyboard property of reply_markup
     * @param  {boolean} enable value of force_keyboard, defaults to true
     * @return {object} returns the keyboard object
     */
    value: function force() {
      var enable = arguments[0] === undefined ? true : arguments[0];

      this.properties.force_keyboard = enable;
      return this;
    }
  }, {
    key: 'resize',

    /**
     * Set resize_keyboard property of reply_markup
     * @param  {boolean} enable value of resize_keyboard, defaults to true
     * @return {object} returns the keyboard object
     */
    value: function resize() {
      var enable = arguments[0] === undefined ? true : arguments[0];

      this.properties.resize_keyboard = enable;
      return this;
    }
  }, {
    key: 'oneTime',

    /**
     * Set force_keyboard property of reply_markup
     * @param  {boolean} enable value of force_keyboard, defaults to true
     * @return {object} returns the keyboard object
     */
    value: function oneTime() {
      var enable = arguments[0] === undefined ? true : arguments[0];

      this.properties.one_time_keyboard = enable;
      return this;
    }
  }, {
    key: 'selective',

    /**
     * Set selective property of reply_markup
     * @param  {boolean} enable value of force_keyboard, defaults to true
     * @return {object} returns the keyboard object
     */
    value: function selective() {
      var enable = arguments[0] === undefined ? true : arguments[0];

      this.properties.selective = enable;
      return this;
    }
  }, {
    key: 'hide',

    /**
     * Set hide_keyboard property of reply_markup to true
     * @return {object} returns the keyboard object
     */
    value: function hide() {
      this.properties = {
        hide_keyboard: true
      };

      return this;
    }
  }]);

  return Keyboard;
})(_Base3['default']);

exports['default'] = Keyboard;
module.exports = exports['default'];
