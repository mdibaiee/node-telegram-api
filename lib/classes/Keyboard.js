export default class Keyboard {
  constructor(message, options = {}) {
    this.message = message;
    this.replyMarkup = options;
  }

  keys(keys) {
    this.setProperties({
      keyboard: keys,
      hide_keyboard: false
    });
    return this;
  }

  force(enable = true) {
    this.setProperties({
      force_keyboard: enable
    });
    return this;
  }

  resize(enable = true) {
    this.setProperties({
      resize: enable
    });
    return this;
  }

  oneTime(enable = true) {
    this.setProperties({
      one_time_keyboard: enable
    });
    return this;
  }

  selective(enable = true) {
    this.setProperties({
      selective: enable
    });
    return this;
  }

  hide() {
    this.replyMarkup = {
      hide_keyboard: true
    };

    return this;
  }

  get replyMarkup() {
    return JSON.parse(this.message.params.reply_markup);
  }
  set replyMarkup(json) {
    this.message.params.reply_markup = JSON.stringify(json);
  }

  setProperties(object) {
    this.replyMarkup = Object.assign(this.replyMarkup, object);
  }
}
