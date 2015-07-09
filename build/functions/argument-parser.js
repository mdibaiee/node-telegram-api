'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports['default'] = argumentParser;
var FORMAT_REQUIRED = /<(\W*)(\w+)\|?(\w+)?>/g;
var FORMAT_OPTIONAL = /\[(\W*)(\w+)\|?(\w+)?\]/g;
var FORMAT_REST = /\.{3}(\w+)/g;

var ESCAPABLE = '.^$*+?()[{\\|}]'.split('');

var REQUIRED = 0;
var OPTIONAL = 1;
var REST = 2;

/**
 * Parses a message for arguments, based on format
 *
 * The format option may include '<requiredParam>' and '[optionalParam]' and
 * '...[restParam]'
 * 		<requiredParam> indicates a required, single-word argument
 * 		[optionalParam] indicates an optinal, single-word argument
 *   	...[restParam] indicates a multi-word argument which records until end
 *
 *    You can define a type for your arguments using pipe | sign, like this:
 *    [count|number]
 *    Supported Types are: number and word, defaults to word
 *
 *    Example:
 *            format: '<name> [count|number] ...text'
 *            string 1: 'Someone Hey, wassup'
 *            {name: 'Someone',
 *             count: undefined,
 *             text: 'Hey, wassup'}
 *
 *            string 2: 'Someone 5 Hey, wassup'
 *            {name: 'Someone',
 *         		 count: 5,
 *         		 text: 'Hey, wassup'}
 * @param  {string} format Format, as described above
 * @param  {string} string The message to parse
 * @return {object} Parsed arguments
 */

function argumentParser(format, string) {
  string = string.replace(/[^\s]+/, '').trim();
  format = format.replace(/[^\s]+/, '').trim();

  if (!format) return { args: {}, params: {} };

  var indexes = [],
      params = {};

  format = format.replace(/\s/g, '\\s*');
  format = format.replace(FORMAT_REQUIRED, function (f, symbols, arg, type, offset) {
    if (type === undefined) type = 'word';

    indexes.push({ arg: arg, offset: offset });
    params[arg] = REQUIRED;
    return (escape(symbols) + getFormat(type, 'required')).trim();
  });
  format = format.replace(FORMAT_OPTIONAL, function (f, symbols, arg, type, offset) {
    if (type === undefined) type = 'word';

    indexes.push({ arg: arg, offset: offset });
    params[arg] = OPTIONAL;
    return (escape(symbols, '?') + getFormat(type, 'optional')).trim();
  });
  format = format.replace(FORMAT_REST, function (full, arg, offset) {
    indexes.push({ offset: offset, arg: arg });
    params[arg] = REST;
    return getFormat(null, 'rest');
  });

  if (!string) return { args: {}, params: params };

  indexes = indexes.sort(function (a, b) {
    return a.offset < b.offset ? -1 : 1;
  });

  var regex = new RegExp(format);

  var matched = regex.exec(string).slice(1);

  var object = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = matched.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2);

      var index = _step$value[0];
      var match = _step$value[1];

      var argument = indexes[index];

      object[argument.arg] = match;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return { args: object, params: params };
}

function escape(symbols) {
  var append = arguments[1] === undefined ? '' : arguments[1];

  return symbols.split('').map(function (symbol) {
    return (ESCAPABLE.indexOf(symbol) ? '\\' + symbol : symbol) + append;
  }).join('');
}

var TYPES = {
  'number': '\\d',
  'word': '\\S'
};

function getFormat() {
  var type = arguments[0] === undefined ? 'word' : arguments[0];
  var param = arguments[1] === undefined ? 'required' : arguments[1];

  var t = TYPES[type];

  switch (param) {
    case 'required':
      return '(' + t + '+)';
    case 'optional':
      return '(' + t + '+)?';
    case 'rest':
      return '(.*)';
  }
}
module.exports = exports['default'];
