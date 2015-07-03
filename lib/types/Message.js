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
    super('sendMessage');

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
   * Set disable_web_page_preview of the message
   * @param  {boolean} enable
   * @return {object} returns the message object
   */
  preview(enable = true) {
    this.properties.disable_web_page_preview = !enable;
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

  // This class inherits Base's send method
}
