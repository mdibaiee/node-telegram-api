import Base from './Base';

/**
 * Forward class, used to forward messages from a chat to another
 */
export default class Forward extends Base {
  /**
   * Create a new forward message
   * @param  {object} properties Forward Message properties, as defined by
   *                             Telegram API
   */
  constructor(properties = {}) {
    super('forwardMessage');

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
   * Set from_chat_id, source of message's chat's id
   * @param  {number} chat Source chat id
   * @return {object} returns the message object
   */
  from(chat) {
    this.properties.from_chat_id = chat;
    return this;
  }

  /**
   * Sets message_id, the message to forward from source to target chat
   * @param  {number} message ID of the message to forward
   * @return {object} returns the message object
   */
  message(message) {
    this.properties.message_id = message;
    return this;
  }

  // This class inherits Base's send method
}
