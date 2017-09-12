import Base from './Base';

export default class Message extends Base {
  constructor(properties = {}) {
    super('deleteMessage');

    this.properties = properties;
  }

  from(chat) {
    this.properties.chat_id = chat;
    return this;
  }

  id(id) {
    this.properties.message_id = id;
    return this;
  }
}
