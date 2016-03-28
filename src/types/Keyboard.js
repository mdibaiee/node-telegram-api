import Base from './Base';

/**
 * Keyboard class, used to configure keyboards for messages.
 * You should pass your instance of this class to message.keyboard() method
 */
export default class Keyboard extends Base {
  /**
   * Create a new keyboard
   * @param  {object} properties Keyboard properties, as defined by Telegram API
   *                             See ReplyKeyboardMarkup, ReplyKeyboardHide,
   *                                 ForceReply
   */
  constructor(properties = {}) {
    super();

    this.properties = properties;
  }

  /**
   * Set the keyboard property of reply_markup
   * @param  {array} keys An array of arrays, with the format of
   *                            Column         Column
   *                      Row [['TopLeft',   'TopRight'],
   *                      Row ['BottomLeft', 'BottomRight']]
   * @return {object} returns the keyboard object
   */
  keys(keys) {
    this.properties.keyboard = keys;
    this.properties.hide_keyboard = false;
    return this;
  }

  /**
   * Set force_keyboard property of reply_markup
   * @param  {boolean} enable value of force_keyboard, defaults to true
   * @return {object} returns the keyboard object
   */
  force(enable = true) {
    this.properties.force_keyboard = enable;
    return this;
  }

  /**
   * Set resize_keyboard property of reply_markup
   * @param  {boolean} enable value of resize_keyboard, defaults to true
   * @return {object} returns the keyboard object
   */
  resize(enable = true) {
    this.properties.resize_keyboard = enable;
    return this;
  }

  /**
   * Set force_keyboard property of reply_markup
   * @param  {boolean} enable value of force_keyboard, defaults to true
   * @return {object} returns the keyboard object
   */
  oneTime(enable = true) {
    this.properties.one_time_keyboard = enable;
    return this;
  }

  /**
   * Set selective property of reply_markup
   * @param  {boolean} enable value of force_keyboard, defaults to true
   * @return {object} returns the keyboard object
   */
  selective(enable = true) {
    this.properties.selective = enable;
    return this;
  }

  /**
   * Set hide_keyboard property of reply_markup to true
   * @return {object} returns the keyboard object
   */
  hide() {
    this.properties = {
      hide_keyboard: true
    };

    return this;
  }
}
