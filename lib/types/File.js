import Base from './Base';
import mime from 'mime';

const TYPES = ['photo', 'video', 'document', 'audio'];

/**
 * File class, used to send pictures/movies/audios/documents to chat
 */
export default class File extends Base {
  /**
   * Create a new file instance
   * @param  {object} properties File properties, as defined by Telegram API
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
   * Set file of the message
   * @param  {ReadableStream} stream File Stream
   * @param {string} fileType (optional) if the first argument is a
   *                          file_id string, this option indicates file type
   * @return {object} returns the message object
   */
  file(stream, fileType) {
    if (typeof stream === 'string') {
      this.properties[fileType] = stream;
    }

    let type = mime.lookup(stream.path).split('/')[0];
    if (type === 'image') {
      type = 'photo';
    }

    if (TYPES.indexOf(type) === -1) {
      type = 'document';
    }

    this.properties[type] = stream;

    return this;
  }

  /**
   * Set caption for photos
   * @param  {string} text caption's text
   * @return {object} returns the message object
   */
  caption(text) {
    this.properties.caption = text;
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

  // This class inherits Base's send method
}
