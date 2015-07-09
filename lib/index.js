import API from './functions/api';
import webhook from './functions/webhook';
import poll from './functions/poll';
import argumentParser from './functions/argument-parser';
import {EventEmitter} from 'events';
import Message from './types/Message';

const DEFAULTS = {
  update: {
    offset: 0,
    timeout: 20,
    limit: 100
  }
};

/**
 * Bot class used to connect to a new bot
 * Bots have an api property which gives access to all Telegram API methods,
 * see API class
 */
export default class Bot extends EventEmitter {
  /**
   * Create and connect to a new bot
   * @param  {object} options Bot properties.
   */
  constructor(options = {update: {}}) {
    super();

    if (!options.token) {
      throw new Error('Token cannot be empty');
    }

    this.token = options.token;
    this.update = Object.assign(options.update || {}, DEFAULTS.update);

    this.api = new API(this.token);

    this.msg = {};

    // EventEmitter
    this._events = {};
    this._userEvents = [];

    this.setMaxListeners(100);
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
  start(hook) {
    if (hook) {
      return webhook(hook, this);
    }
    return this.api.getMe().then(response => {
      this.info = response.result;

      this.on('update', this._update);

      if (hook) {
        return webhook(hook, this);
      } else {
        return poll(this);
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
  get(pattern, listener) {
    if (typeof pattern === 'string') {
      pattern = new RegExp(`^${pattern}`);
    }

    this._userEvents.push({
      pattern, listener
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
  command(command, listener) {
    const regex = /[^\s]+/;

    const cmd = command.match(regex)[0].trim();

    this._userEvents.push({
      pattern: new RegExp(`^/${cmd}`),
      parse: argumentParser.bind(null, command),
      listener
    });

    return this;
  }

  /**
   * Sends the message provided
   * @param  {object} message The message to send. Gets it's send method called
   * @return {unknown} returns the result of calling message's send method
   */
  send(message) {
    return message.send(this).catch(console.error);
  }

  /**
   * The internal update event listener, used to parse messages and fire
   * command/get events - YOU SHOULD NOT USE THIS
   *
   * @param  {object} update
   */
  _update(update) {
    if (!this.update.offset) {
      const updateId = update[update.length - 1].update_id;
      this.update.offset = updateId;
    }
    if (this.update) {
      this.update.offset += 1;
    }

    update.forEach(res => {
      let text = res.message.text;
      if (!text) return;

      const selfUsername = `@${this.info.username}`;

      if (text.startsWith('/') && text.indexOf(selfUsername) > -1) {
        // Commands are sent in /command@thisusername format in groups
        const regex = new RegExp(`(/.*)@${this.info.username}`);
        text = text.replace(regex, '$1');
        res.message.text = text;
      }

      let ev = this._userEvents.find(({pattern}) => pattern.test(text));

      if (!ev) {
        this.emit('command-notfound', res.message);
        return;
      }

      if (ev.parse) {
        let {params, args} = ev.parse(res.message.text);
        if (!Object.keys(params).length) {
          ev.listener(res.message);
          return;
        }
        var bot = this;
        function ask(param) {
          if (!args[param]) {
            bot.send(new Message().text(`Enter value for ${param}`).to(res.message.chat.id))
            .then(answer => {
              args[param] = answer.text;
              iter.next();
            });
          }
        }
        function* gen(par) {
          let index = 0;
          while (index < par.length) {
            while (args[par[index]] && index < par.length) index++;
            yield ask(par[index]);
            index++;
            if (index == par.length) {
              res.message.args = args;
              ev.listener(res.message);
              return;
            }
          }
        }
        var iter = gen(Object.keys(params));
        iter.next();
      } else {
        ev.listener(res.message);
      }
    });
  }
}
