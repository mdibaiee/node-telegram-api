export default function poll(bot) {
  return bot.api.getUpdates(bot.update).then(response => {
    const again = wait(bot.update.timeout * 1000, bot).then(poll);
    if (!response.result.length) {
      return again;
    }
    bot.emit('update', response.result);

    return again;
  });
}

const wait = (miliseconds, value) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, miliseconds);
  });
};
