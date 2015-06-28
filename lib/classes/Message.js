import {EventEmitter} from 'events';
import Keyboard from './Keyboard';

export default class Message extends EventEmitter {
  constructor(options = {}) {
    super();

    this.params = options;
  }

  to(chat) {
    this.params.chat_id = chat;
    return this;
  }

  text(text) {
    this.params.text = text;
    return this;
  }

  reply(chat) {
    this.params.reply_to_message_id = chat;
    return this;
  }

  keyboard(options) {
    let params;

    if (this._keyboard && !options) {
      return this._keyboard;
    }

    if (this._keyboard) {
      params = Object.assign(this._keyboard.replyMarkup, options);
    } else {
      params = options;
    }

    this._keyboard = new Keyboard(this, params);
    return this._keyboard;
  }

  send(bot) {
    let messageId;

    return new Promise(resolve => {
      bot.api.sendMessage(this.params).then(response => {
        messageId = response.result.message_id;
        this.emit('message:sent', response);
      });

      if (this.keyboard().replyMarkup.one_time_keyboard) {
        this.keyboard().replyMarkup = '';
      }

      const chat = this.params.chat_id;
      bot.on('update', function listener(result) {
        const update = result.find(({message}) => {
          // if in a group, there will be a reply to this message
          if (chat < 0) {
            return message.chat.id === chat &&
                   message.reply_to_message.message_id === messageId;
          } else {
            return message.chat.id === chat;
          }
        });

        if (update) {
          resolve(update);
          this.emit('message:answer', update);

          bot.removeListener('update', listener);
        }
      });
    });
  }
}
