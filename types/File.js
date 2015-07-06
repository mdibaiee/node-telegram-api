'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Base2 = require('./Base');

var _Base3 = _interopRequireDefault(_Base2);

var _mime = require('mime');

var _mime2 = _interopRequireDefault(_mime);

var TYPES = ['photo', 'video', 'document', 'audio'];

/**
 * File class, used to send pictures/movies/audios/documents to chat
 */

var File = (function (_Base) {
  /**
   * Create a new file instance
   * @param  {object} properties File properties, as defined by Telegram API
   */

  function File() {
    var properties = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, File);

    _get(Object.getPrototypeOf(File.prototype), 'constructor', this).call(this, 'sendDocument');

    this.properties = properties;
    this._keyboard = new _Base3['default']();
  }

  _inherits(File, _Base);

  _createClass(File, [{
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
    key: 'file',

    /**
     * Set file of the message
     * @param  {string} file File path
     * @param {string} fileType (optional) if the first argument is a
     *                          file_id string, this option indicates file type
     * @return {object} returns the message object
     */
    value: function file(_file, fileType) {
      if (fileType) {
        this.properties[fileType] = { file: _file };

        return this;
      }

      var _mime$lookup$split = _mime2['default'].lookup(_file).split('/');

      var _mime$lookup$split2 = _slicedToArray(_mime$lookup$split, 2);

      var type = _mime$lookup$split2[0];
      var extension = _mime$lookup$split2[1];

      if (type === 'image') {
        type = 'photo';
      }

      if (extension === 'gif') {
        type = 'document';
      }

      if (TYPES.indexOf(type) === -1) {
        type = 'document';
      }

      this.properties[type] = { file: _file };

      this.method = 'send' + (type[0].toUpperCase() + type.slice(1));

      return this;
    }
  }, {
    key: 'caption',

    /**
     * Set caption for photos
     * @param  {string} text caption's text
     * @return {object} returns the message object
     */
    value: function caption(text) {
      this.properties.caption = text;
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

    // This class inherits Base's send method

  }]);

  return File;
})(_Base3['default']);

exports['default'] = File;
module.exports = exports['default'];
