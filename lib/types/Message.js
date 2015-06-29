import Base from './Base';

/**
 * Message class, used to send message to a chat
 */
export default class Message extends Base {
  /**
   * Create a new message
   * @param  {object} properties Message properties, as defined by Telegram API
   */
  constructor(properties = {}) {
    super();

    this.properties = properties;
    this._keyboard = new Base();
  }

  /**
   * Set chat_id of the message
   * @param  {number} chat
   * @return {object} returns the message object
   */
  to(chat) {
    this.properties.chat_id = chat;
    return this;
  }

  /**
   * Set text of the message
   * @param  {string} text Message's content
   * @return {object} returns the message object
   */
  text(text) {
    this.properties.text = text;
    return this;
  }

  /**
   * Set reply_to_message_id of the message
   * @param  {number} id message_id of the message to reply to
   * @return {object} returns the message object
   */
  reply(id) {
    this.properties.reply_to_message_id = id;
    return this;
  }

  /**
   * Sets keyboard of the message
   * The value of reply_markup is set to the sanitized keyboard properties
   * i.e. reply_markup = JSON.stringify(kb.getProperties())
   * @param  {object} kb A Keyboard instance
   * @return {object} returns the message object
   */
  keyboard(kb) {
    this._keyboard = kb;
    return this;
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
    console.log('sending message');

    let messageId;
    const reply_markup = JSON.stringify(this._keyboard.getProperties());
    this.properties.reply_markup = reply_markup;

    return new Promise(resolve => {
      bot.api.sendMessage(this.properties).then(response => {
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
}
