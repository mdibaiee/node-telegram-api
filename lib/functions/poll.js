export default function poll(bot) {
  return bot.api.getUpdates(bot.update).then(response => {
    if (!response.result.length) {
      return poll(bot);
    }
    bot.emit('update', response.result);

    return poll(bot);
  });
}
