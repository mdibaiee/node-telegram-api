'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = poll;
function poll(bot) {
  return bot.api.getUpdates(bot.update).then(function (response) {
    if (!response.result.length) {
      return poll(bot);
    }
    bot.emit('update', response.result);

    if (bot._stop) {
      return null;
    }
    return poll(bot);
  });
}
module.exports = exports['default'];
