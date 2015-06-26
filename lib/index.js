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

  message(chat, text, options = {}) {
    return new Promise(resolve => {
      let messageId;

      const params = Object.assign({
        chat_id: chat,
        text,
        reply_markup: this._replyMarkup
      }, this.msg, options);

      this.api.sendMessage(params).then(response => {
        messageId = response.result.message_id;
      });

      this.msg = {};

      if (this.replyMarkup.one_time_keyboard) {
        this.replyMarkup = '';
      }

      this.on('update', function listener(result) {
        const update = result.find(({message}) => {
          // if in a group, there will be a reply to this message
          console.log(message.chat.id, chat);
          if (chat < 0) {
            return message.chat.id === chat &&
                   message.reply_to_message.message_id === messageId;
          } else {
            return message.chat.id === chat;
          }
        });

        console.log(text, '=>', update);

        if (update) {
          resolve(update);

          this.removeListener('update', listener);
        }
      });
    });
  }

  replyTo(reply) {
    this.msg.reply_to_message_id = reply;

    return this;
  }

  askQuestion(chat, title, answers = []) {
    return new Promise((resolve, reject) => {
      this.keyboard(answers, false, true).force()
      .message(chat, title).then(update => {
        const message = update.message;
        let answer;

        console.log(message);
        answers.forEach(function find(a) {
          if (Array.isArray(a)) {
            a.forEach(find);
          }
          if (a === message.text) {
            answer = a;
          }
        });
        console.log(title, '=', answer);

        if (answer) {
          resolve(answer, update);
        } else {
          reject(update);
        }
      });
    });
  }

  keyboard(rows, resize = false, oneTime = false, selective = true) {
    this.replyMarkup = {
      keyboard: rows,
      resize_keyboard: resize,
      one_time_keyboard: oneTime,
      selective
    };

    return this;
  }

  hideKeyboard(selective = true) {
    this.replyMarkup = {
      hide_keyboard: true,
      selective
    };

    return this;
  }

  force(enable = true, selective) {
    this.replyMarkup.force_reply = enable;
    if (selective) {
      this.replyMarkup.selective = selective;
    }

    return this;
  }

  set replyMarkup(json) {
    this._replyMarkup = JSON.stringify(json);
  }

  get replyMarkup() {
    return JSON.parse(this._replyMarkup);
  }

  wait(miliseconds) {
    const self = this;

    return function(resolve) {
      setTimeout(resolve.bind(self), miliseconds);
    };
  }
}

Bot.prototype = Object.assign(Bot.prototype, EventEmitter.prototype);
