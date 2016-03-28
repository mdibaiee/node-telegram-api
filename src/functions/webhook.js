import https from 'http';
import qs from 'qs';
import { getBody } from './fetch';

const DEFAULTS = {
  server: {},
  port: 443
};

export default function webhook(options = {}, bot) {
  options = Object.assign(DEFAULTS, options);

  return bot.api.setWebhook(options.url).then(() => {
    bot._webhookServer = https.createServer(options.server, (req, res) =>
      getBody(req).then(data => {
        bot.emit('update', qs.parse(data).result);

        res.end('OK');
      })
    ).listen(options.port);
  });
}
