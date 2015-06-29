import 'babel/polyfill';
import API from './api';
import {EventEmitter} from 'events';

const DEFAULTS = {
  update: {
    offset: 0,
    timeout: 0.5,
    limit: 100
  }
};

process.on('uncaughtException', function(err) {
  console.error(err.stack);
});

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
  }

  /**
   * Gets information about the bot and then starts polling updates from API
   * Emits an `update` event after polling with the response from server
   * Returns a promise which is resolved after the bot information is received
   * and set to it's `info` property i.e. bot.info
   * @return {promise} A promise which is resolved with the response of getMe
   */
  start() {
    let poll = function() {
      return this.api.getUpdates(this.update).then(response => {
        const again = wait(this.update.timeout * 1000).then(poll);

        const result = response.result;
        if (!result.length) {
          return again;
        }

        if (!this.update.offset) {
          const updateId = result[result.length - 1].update_id;
          this.update.offset = updateId;
        }
        if (this.update) {
          this.update.offset += 1;
        }

        this.emit('update', result);

        result.forEach(res => {
          let text = res.message.text;
          if (text.startsWith('/')) {
            // Commands are sent in /command@botusername format in groups
            const regex = new RegExp(`@${this.info.username}$`);
            text = text.replace(regex, '');
          }

          let ev = this._userEvents.find(({pattern}) => pattern.test(text));

          if (!ev) {
            return;
          }
          ev.listener(res.message);
        });

        return again;
      });
    }.bind(this);

    return this.api.getMe().then(response => {
      this.info = response.result;
      return poll();
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
   * @param  {string} cmd the command string, should not include slash (/)
   * @param  {function} listener function to call when the command is received,
   *                           gets the update
   * @return {object} returns the bot object
   */
  command(cmd, listener) {
    this._userEvents.push({
      pattern: new RegExp(`/${cmd}`),
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
}

const wait = (miliseconds) => {
  return new Promise(resolve => {
    setTimeout(resolve, miliseconds);
  });
};
