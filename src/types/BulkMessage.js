import Message from './Message';

/**
 * Message class, used to send a message to multiple chats
 */
export default class BulkMessage extends Message {
  /**
   * Create a new message
   * @param  {object} properties Message properties, as defined by Telegram API
   */
  constructor(properties = {}) {
    super(properties);

    this.chats = [];
  }

  /**
   * Set multiple chat_id's for the message
   * @param  {number} chat
   * @return {object} returns the message object
   */
  to(...args) {
    const chats = args.reduce((a, b) => {
      return a.concat(b);
    }, []);

    this.chats = chats;
    return this;
  }

  /**
   * Send the message to all chats
   * @param  {Bot} bot
   * @return {Promise} Resolved when the message is sent to all chats
   */
  send(bot) {
    const promises = this.chats.map(chat => {
      const clone = Object.assign({}, this.properties);
      const message = new Message(clone).to(chat);
      return message.send(bot);
    });

    return Promise.all(promises);
  }
}
