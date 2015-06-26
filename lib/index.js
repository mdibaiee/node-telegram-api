import API from './api';
import * as _ from './utils';
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

    // EventEmitter
    this._events = {};
  }

  start() {
    (function poll() {
      this.api.getUpdates(this.update).then(response => {
        setTimeout(poll.bind(this), this.update.timeout * 1000);

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
          const text = res.message.text;
          if (text.indexOf('/') === 0) {
            this.emit('command:' + text.slice(1), res);
          } else {
            this.emit(text, res);
          }
        });
      });
    }.bind(this)());
  }

  command(cmd, listener) {
    return this.on(`command:${cmd}`, listener);
  }

  message(chat, text, options) {
    return new Promise(resolve => {
      console.log(this.keyboard);
      this.api.sendMessage(Object.assign({
        chat_id: chat,
        text,
        reply_markup: this.keyboard
      }, options));

      if (JSON.parse(this.keyboard).one_time_keyboard) {
        this.keyboard = '';
      }

      this.on('update', function listener(result) {
        const update = result.find(({message}) => {
          return message.chat.id === chat;
        });

        if (update) {
          resolve(update);

          this.removeListener('update', listener);
        }
      });
    });
  }

  askQuestion(chat, title, answers = []) {
    const text = title + '\n\n' + answers.reduce((a, b, i) => {
      return a + `${i}. ${b}\n`;
    }, '');

    return new Promise((resolve, reject) => {
      const rows = [answers];
      this.keyboard(rows, false, true).force()
      .message(chat, text).then(update => {
        const message = update.message;
        let answer;

        if (_.isNumber(message.text)) {
          answer = answers[+message.text];
        } else {
          answer = answers.find(a => a === message.text);
        }

        if (answer) {
          resolve(answer, update);
        } else {
          reject(update);
        }
      });
    });
  }

  keyboard(rows, resize = false, oneTime = false, selective) {
    this.keyboard = JSON.stringify({
      keyboard: rows,
      resize_keyboard: resize,
      one_time_keyboard: oneTime,
      selective
    });

    return this;
  }

  hideKeyboard(selective) {
    this.keyboard = JSON.stringify({
      hide_keyboard: true,
      selective
    });

    return this;
  }

  force(enable = true, selective) {
    const keyboard = JSON.parse(this.keyboard);
    keyboard.force_reply = enable;
    keyboard.selective = selective;

    this.keyboard = JSON.stringify(keyboard);
    return this;
  }

  wait(miliseconds) {
    const self = this;

    return function(resolve) {
      setTimeout(resolve.bind(self), miliseconds);
    };
  }
}

Bot.prototype = Object.assign(Bot.prototype, EventEmitter.prototype);
