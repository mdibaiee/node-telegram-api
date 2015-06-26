// API methods
import fetch from './fetch';

export default function API(token) {
  this.token = token;
}

API.prototype.request = function request(method, data) {
  return fetch(this.token + '/' + method, data);
};

const methods = ['getMe', 'sendMessage', 'forwardMessage', 'sendPhoto',
'sendAudio', 'sendDocument', 'sendSticker', 'sendVideo',
'sendLocation', 'sendChatAction', 'getUserProfilePhotos',
'getUpdates'];

methods.forEach(method => {
  API.prototype[method] = function(data) {
    return this.request(method, data);
  };
});
