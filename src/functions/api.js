// API methods
import fetch from './fetch';

/**
 * Simple replacement for Bluebird's Promise.mapSeries() implementation
 * @param {Array} tasks to run serially
 * @param {Function} task function to execute
 * @return {Promise}
 */
function sequence(tasks, fn) {
  return tasks.reduce((promise, task) => promise.then(() => fn(task)), Promise.resolve());
}


/**
 * API class, has a function for each method of the Telegram API which take
 * an object argument, and send request to the API server
 *
 * Methods: getMe, sendMessage, forwardMessage, sendPhoto, sendAudio,
 * sendDocument, sendSticker, sendVideo, sendLocation, sendChatAction,
 * getUserProfilePhotos, getUpdates
 *
 */
export default class API {
  /**
   * Create a new api object with the given token
   * @param  {string} token
   */
  constructor(token) {
    this.token = token;
    this._queue = [];
    this._inUseQueue = [];
  }

  /**
   * Run Telegram API calls serially using internal queueing mechanism
   * @private
   */
  _runQueue() {
    // implementation taken from https://github.com/yagop/node-telegram-bot-api/issues/192#issuecomment-249488807
    if (this._inUseQueue.length || !this._queue.length) return;

    this._inUseQueue = this._queue;
    this._queue = [];

    sequence(this._inUseQueue, request => { //eslint-disable-line
      return this.request(request.method, request.data)
        .then(request.resolve)
        .catch(request.reject);
    }).then(() => {
      this._inUseQueue = [];
      this._runQueue();
    });
  }
}

API.prototype.request = function request(method, data) {
  return fetch(`${this.token}/${method}`, data);
};

const methods = ['getMe', 'sendMessage', 'forwardMessage', 'sendPhoto',
  'sendAudio', 'sendDocument', 'sendSticker', 'sendVideo',
  'sendLocation', 'sendChatAction', 'getUserProfilePhotos',
  'getUpdates', 'setWebhook', 'deleteMessage'];

methods.forEach(method => {
  API.prototype[method] = function (data) { //eslint-disable-line
    if (method === 'getUpdates') {
      // don't add 'getUpdates' request to the queue as it's going to
      // hinder 'send*' calls performance
      return this.request(method, data);
    }

    // implementation taken from https://github.com/yagop/node-telegram-bot-api/issues/192#issuecomment-249488807
    return new Promise((resolve, reject) => {
      this._queue.push({ method, data, resolve, reject });
      process.nextTick(this._runQueue.bind(this));
    });
  };
});
