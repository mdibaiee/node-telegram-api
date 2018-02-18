export default function poll(bot) {
  return bot.api.getUpdates(bot.update)
      .then(response => {
        if (!response.result.length) {
          return poll(bot);
        }
        bot.emit('update', response.result);

        if (bot._stop) {
          return null;
        }
        return poll(bot);
      })
      .catch(e => {
        bot.emit('error', e);
        return poll(bot);
      });
}
