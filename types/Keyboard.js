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
 * Keyboard class, used to configure keyboards for messages.
 * You should pass your instance of this class to message.keyboard() method
 */

var Keyboard = function (_Base) {
  _inherits(Keyboard, _Base);

  /**
   * Create a new keyboard
   * @param  {object} properties Keyboard properties, as defined by Telegram API
   *                             See ReplyKeyboardMarkup, ReplyKeyboardHide,
   *                                 ForceReply
   */

  function Keyboard() {
    var properties = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Keyboard);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Keyboard).call(this));

    _this.properties = properties;
    return _this;
  }

  /**
   * Set the keyboard property of reply_markup
   * @param  {array} keys An array of arrays, with the format of
   *                            Column         Column
   *                      Row [['TopLeft',   'TopRight'],
   *                      Row ['BottomLeft', 'BottomRight']]
   * @return {object} returns the keyboard object
   */


  _createClass(Keyboard, [{
    key: 'keys',
    value: function keys(_keys) {
      this.properties.keyboard = _keys;
      this.properties.hide_keyboard = false;
      return this;
    }

    /**
     * Set force_keyboard property of reply_markup
     * @param  {boolean} enable value of force_keyboard, defaults to true
     * @return {object} returns the keyboard object
     */

  }, {
    key: 'force',
    value: function force() {
      var enable = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      this.properties.force_keyboard = enable;
      return this;
    }

    /**
     * Set resize_keyboard property of reply_markup
     * @param  {boolean} enable value of resize_keyboard, defaults to true
     * @return {object} returns the keyboard object
     */

  }, {
    key: 'resize',
    value: function resize() {
      var enable = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      this.properties.resize_keyboard = enable;
      return this;
    }

    /**
     * Set force_keyboard property of reply_markup
     * @param  {boolean} enable value of force_keyboard, defaults to true
     * @return {object} returns the keyboard object
     */

  }, {
    key: 'oneTime',
    value: function oneTime() {
      var enable = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      this.properties.one_time_keyboard = enable;
      return this;
    }

    /**
     * Set selective property of reply_markup
     * @param  {boolean} enable value of force_keyboard, defaults to true
     * @return {object} returns the keyboard object
     */

  }, {
    key: 'selective',
    value: function selective() {
      var enable = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      this.properties.selective = enable;
      return this;
    }

    /**
     * Set hide_keyboard property of reply_markup to true
     * @return {object} returns the keyboard object
     */

  }, {
    key: 'hide',
    value: function hide() {
      this.properties = {
        hide_keyboard: true
      };

      return this;
    }
  }]);

  return Keyboard;
}(_Base3.default);

exports.default = Keyboard;
module.exports = exports['default'];
