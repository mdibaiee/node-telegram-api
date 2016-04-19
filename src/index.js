if (!global._babelPolyfill) {
  require('babel-polyfill');
}
import API from './functions/api';
import webhook from './functions/webhook';
import poll from './functions/poll';
import argumentParser from './functions/argument-parser';
import { EventEmitter } from 'events';
import Message from './types/Message';
import File from './types/File';
import Keyboard from './types/Keyboard';
import BulkMessage from './types/BulkMessage';
import Question from './types/Question';
import Forward from './types/Forward';

const DEFAULTS = {
  update: {
    offset: 0,
    timeout: 20,
    limit: 100
  }
};

const REQUIRED = 0;

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
  constructor(options = { update: {} }) {
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
      }

      return poll(this);
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
   * Stops the bot, deattaching all listeners and polling
   */
  stop() {
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
      if (!text) {
        return;
      }

      const selfUsername = `@${this.info.username}`;

      if (text.startsWith('/') && text.indexOf(selfUsername) > -1) {
        // Commands are sent in /command@thisusername format in groups
        const regex = new RegExp(`(/.*)@${this.info.username}`);
        text = text.replace(regex, '$1');
        res.message.text = text;
      }

      const ev = this._userEvents.find(({ pattern }) => pattern.test(text));

      if (!ev) {
        this.emit('command-notfound', res.message);
        return;
      }

      if (!ev.parse) {
        ev.listener(res.message);
        return;
      }

      const { params, args } = ev.parse(res.message.text);
      res.message.args = args;

      const requiredParams = Object.keys(params).filter(param =>
        params[param] === REQUIRED && !args[param]
      );

      if (!requiredParams.length) {
        ev.listener(res.message);
        return;
      }

      const bot = this;
      function* getAnswer() {
        for (const param of requiredParams) {
          const msg = new Message().to(res.message.chat.id)
                                   .text(`Enter value for ${param}`);
          yield bot.send(msg).then(answer => {
            args[param] = answer.text;
          });
        }
      }

      const iterator = getAnswer();
      (function loop() {
        const next = iterator.next();
        if (next.done) {
          ev.listener(res.message);
          return;
        }

        next.value.then(loop);
      }());
    });
  }
}

export {
  File,
  Message,
  BulkMessage,
  Forward,
  Question,
  Keyboard
};
