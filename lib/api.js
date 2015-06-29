// API methods
import fetch from './fetch';

/**
 * API class, has a function for each method of the Telegram API which take
 * an object argument, and send request to the API server
 *
 * Methods: getMe, sendMessage, forwardMessage, sendPhoto, sendAudio,
 * sendDocument, sendSticker, sendVideo, sendLocation, sendChatAction,
 * getUserProfilePhotos, getUpdates
 */
export default class API {
  /**
   * Create a new api object with the given token
   * @param  {string} token
   */
  constructor(token) {
    this.token = token;
  }
}

API.prototype.request = function request(method, data) {
  return fetch(this.token + '/' + method, data);
};

const methods = ['getMe', 'sendMessage', 'forwardMessage', 'sendPhoto',
'sendAudio', 'sendDocument', 'sendSticker', 'sendVideo',
'sendLocation', 'sendChatAction', 'getUserProfilePhotos',
'getUpdates', 'setWebhook'];

methods.forEach(method => {
  API.prototype[method] = function(data) {
    return this.request(method, data);
  };
});
