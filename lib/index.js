import API from './api';
import {EventEmitter} from 'events';

const DEFAULTS = {
  update: {
    offset: 0,
    timeout: 0.5,
    limit: 100
  }
};

export default class Bot {
  constructor(options = {update: {}}) {
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

  start() {
    let poll = function() {
      this.api.getUpdates(this.update).then(response => {
        setTimeout(poll, this.update.timeout * 1000);

        const result = response.result;
        if (!result.length) {
          return;
        }

        if (!this.update.offset) {
          const updateId = result[result.length - 1].update_id;
          this.update.offset = updateId;
        }
        if (this.update) {
          this.update.offset += 1;
        }

        this.emit('update', response.result);
        result.forEach(res => {
          let text = res.message.text;
          if (text.indexOf('/') === 0) {
            // Commands are sent in format /command@botusername format
            const regex = new RegExp(`@${this.info.username}$`);
            text = text.replace(regex, '');
          }

          let ev = this._userEvents.find(({message}) => message.test(text));
          ev.listener(res);
        });
      });
    }.bind(this);

    return this.api.getMe().then(response => {
      this.info = response.result;
      poll();
    });
  }

  get(message, listener) {
    if (typeof message === 'string') {
      message = new RegExp(`^${message}`);
    }

    this._userEvents.push({
      message, listener
    });
  }

  command(cmd, listener) {
    this._userEvents.push({
      message: new RegExp(`/${cmd}`),
      listener
    });
  }

  send(message) {
    return message.send(this);
  }
}

Bot.prototype = Object.assign(Bot.prototype, EventEmitter.prototype);
