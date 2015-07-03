Telegram Bots
=============
Create and control [Telegram bots](https://core.telegram.org/bots) easily
using the new [Telegram API](https://core.telegram.org/bots/api).

```
npm install telegram-api
```

telegram-api is in beta, your feedback is appreciated, please [fill an issue](https://github.com/mdibaiee/node-telegram-api/issues)
for any bugs you find or any suggestions you have.

If you are cloning this repository, remember to run `npm install` to install dependencies.

If you are looking for a real-life example of a bot written using this module, see [mdibaiee/javascriptbot](https://github.com/mdibaiee/javascriptbot).

[Documentation](https://github.com/mdibaiee/node-telegram-api/wiki)
==============

Example
=======
```javascript
var Bot = require('telegram-api');
var Message = require('telegram-api/types/Message');
var File = require('telegram-api/types/File');

var bot = new Bot({
  token: 'YOUR_TOKEN'
});

bot.start();

bot.get(/Hi|Hey|Hello|Yo/, function(message) {
  var answer = new Message().text('Hello, Sir').to(message.chat.id);

  bot.send(answer);
});

bot.command('start', function(message) {
  var welcome = new File().file('./some_photo.png').caption('Welcome');

  bot.send(welcome);
});
```

Bots using this module
======================

[@JavaScriptBot](https://telegram.me/JavaScriptBot) => [mdibaiee/javascriptbot](https://github.com/mdibaiee/javascriptbot)

Todo
====
- [x] Webhook support (not tested, see [#4](https://github.com/mdibaiee/node-telegram-api/issues/4))
- [x] Forward Type
- [x] BulkMessage Type
- [x] File Type
- [ ] Sticker Type
- [ ] Location Type
- [ ] Contact Type
- [ ] Allow remote control of bots (TCP maybe)
- [ ] YOUR IDEAS! [Fill an issue](https://github.com/mdibaiee/node-telegram-api/issues)
