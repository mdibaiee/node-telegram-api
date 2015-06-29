'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = poll;

function poll(bot) {
  return bot.api.getUpdates(bot.update).then(function (response) {
    var again = wait(bot.update.timeout * 1000, bot).then(poll);
    if (!response.result.length) {
      return again;
    }
    bot.emit('update', response.result);

    return again;
  });
}

var wait = function wait(miliseconds, value) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(value);
    }, miliseconds);
  });
};
module.exports = exports['default'];
