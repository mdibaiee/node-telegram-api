const FORMAT_REQUIRED = /<(\W*)(\w+)\|?(\w+)?>/g;
const FORMAT_OPTIONAL = /\[(\W*)(\w+)\|?(\w+)?\]/g;
const FORMAT_REST = /\.{3}(\w+)/g;

const ESCAPABLE = '.^$*+?()[{\\|}]'.split('');

const REQUIRED = 0;
const OPTIONAL = 1;
const REST = 2;

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
export default function argumentParser(format, string) {
  string = string.replace(/[^\s]+/, '').trim();
  format = format.replace(/[^\s]+/, '').trim();

  if (!format) {
    return {args: {}, params: {}};
  }

  let indexes = [],
      params = {};

  format = format.replace(/\s/g, '\\s*');
  format = format.replace(FORMAT_REQUIRED,
    (f, symbols, arg, type = 'word', offset) => {
      indexes.push({arg, offset});
      params[arg] = REQUIRED;
      return (escape(symbols) + getFormat(type, 'required')).trim();
    });
  format = format.replace(FORMAT_OPTIONAL,
    (f, symbols, arg, type = 'word', offset) => {
      indexes.push({arg, offset});
      params[arg] = OPTIONAL;
      return (escape(symbols, '?') + getFormat(type, 'optional')).trim();
    });
  format = format.replace(FORMAT_REST, (full, arg, offset) => {
    indexes.push({offset, arg});
    params[arg] = REST;
    return getFormat(null, 'rest');
  });

  if (!string) {
    return {args: {}, params};
  }

  indexes = indexes.sort((a, b) => {
    return a.offset < b.offset ? -1 : 1;
  });

  const regex = new RegExp(format);

  const matched = regex.exec(string).slice(1);

  const object = {};
  for (let [index, match] of matched.entries()) {
    const argument = indexes[index];

    object[argument.arg] = match;
  }

  return {args: object, params};
}

function escape(symbols, append = '') {
  return symbols.split('').map(symbol => {
    return (ESCAPABLE.indexOf(symbol) ? `\\${symbol}` : symbol) + append;
  }).join('');
}


const TYPES = {
  'number': '\\d',
  'word': '\\S'
};

function getFormat(type = 'word', param = 'required') {
  const t = TYPES[type];

  switch (param) {
    case 'required':
      return `(${t}+)`;
    case 'optional':
      return `(${t}+)?`;
    case 'rest':
      return `(.*)`;
  }
}
