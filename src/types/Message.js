import Base from './Base';

const MSG_MAX_LENGTH = 4096;

function splitToChunks(str, size) {
  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size);
  }

  return chunks;
}

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
   * Set text of the message in HTML format
   * @param  {string} text Message's content in HTML format
   * @return {object} returns the message object
   */
  html(text) {
    this.properties.parse_mode = 'HTML';
    if (text) {
      this.properties.text = text;
    }
    return this;
  }

  /**
   * Set text of the message in Markdown format
   * @param  {string} text Message's content in Markdown format
   * @return {object} returns the message object
   */
  markdown(text) {
    this.properties.parse_mode = 'Markdown';
    if (text) {
      this.properties.text = text;
    }
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

  // override Base.prototype._apiSend() method
  _apiSend(bot) {
    if (this.properties.text && this.properties.text.length > MSG_MAX_LENGTH) {
      let promiseChain = Promise.resolve();
      const textChunks = splitToChunks(this.properties.text, MSG_MAX_LENGTH);

      textChunks.forEach(chunk => {
        const properties = Object.assign({}, this.properties, { text: chunk });
        // any unclosed tags, text modifiers will not send out, send as pure text
        delete properties.parse_mode;

        promiseChain = promiseChain.then(() => bot.api[this.method](properties));
      });

      return promiseChain;
    }

    return bot.api[this.method](this.properties);
  }

  // This class inherits Base's send method
}
