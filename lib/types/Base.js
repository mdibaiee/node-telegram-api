import {EventEmitter} from 'events';

/**
 * Base class of all classes
 */
export default class Base extends EventEmitter {
  constructor(method) {
    super();

    this.method = method;
    this.properties = {};
  }

  /**
   * Sends the message, you should only use this method yourself if
   * you are extending this class. Normally you should call bot.send(message)
   *
   * Events: message:sent => Emitted after sending the message to API, gets the
   * 												  API's response
   *
   *			message:answer => Emitted when your message gets an answer from
   *				                 the contact (reply in case of groups)
   *				                 gets the Update object containing message
   *
   * @param  {object} bot
   * @return {promise} returns a promise, resolved with message:answer
   */
  send(bot) {
    if (this._keyboard) {
      const reply_markup = JSON.stringify(this._keyboard.getProperties());
      this.properties.reply_markup = reply_markup;
    }

    let messageId;
    return new Promise(resolve => {
      bot.api[this.method](this.properties).then(response => {
        messageId = response.result.message_id;
        this.emit('message:sent', response);
      });

      if (this._keyboard.one_time_keyboard) {
        this._keyboard.replyMarkup = '';
      }

      const chat = this.properties.chat_id;
      bot.on('update', function listener(result) {
        const update = result.find(({message}) => {
          // if in a group, there will be a reply to this message
          if (chat < 0) {
            return message.chat.id === chat
                   && message.reply_to_message
                   && message.reply_to_message.message_id === messageId;
          } else {
            return message.chat.id === chat;
          }
        });

        if (update) {
          resolve(update.message);

          this.emit('message:answer', update.message);

          bot.removeListener('update', listener);
        }
      });
    });
  }

  /**
   * Returns properties of the object
   * @return {object} properties of object
   */
  getProperties() {
    return this.properties;
  }

  /**
   * Set properties of the object
   * @param {object} object properties to set
   * @param {boolean} extend A boolean indicating if the properties should be
   *                         extended by the object provided (Object.assign)
   *                         or properties should be replaced by the object
   *                         defaults to true
   * @return {object} returns the properties (same as getProperties)
   */
  setProperties(object, extend = true) {
    this.properties = extend ? Object.assign(this.properties, object)
                             : object;

    return this.getProperties();
  }
}
