# Telegram Bots
Create and control [Telegram bots](https://core.telegram.org/bots) easily
using the new [Telegram API](https://core.telegram.org/bots/api).

telegram-api is in beta, your feedback is appreciated, please [fill an issue](https://github.com/mdibaiee/node-telegram-api/issues)
for any bugs you find or any suggestions you have.
```
npm install telegram-api
```

The code is well documented. I'm trying to integrate JSDoc / ESDoc into our repository for an easy to access documentation.

# Example
[@JavaScriptBot](https://telegram.me/JavaScriptBot) runs on `demo.js`, you can test it.

```javascript
var Bot = require('telegram-api');

// only require the message types you need, more coming soon!
var Message = require('telegram-api/types/Message');
var Question = require('telegram-api/types/Question');

var bot = new Bot({
  token: 'YOUR_KEY'
});

bot.start().then(() => {
  console.log(bot.info);
});

// polling
bot.on('update', update => {
  console.log('Polled\n', update);
});

const question = new Question({
  text: 'How should I greet you?',
  answers: [['Hey'], ['Hello, Sir'], ['Yo bro']]
});

bot.get(/Hi|Hey|Yo/, message => {
  const id = message.chat.id;

  question.to(id).reply(message.message_id);

  bot.send(question).then(answer => {
    const msg = new Message().to(id).text('Your answer: ' + answer);
    bot.send(msg);
  }, () => {
    const msg = new Message().to(id).text('Invalid answer');
    bot.send(msg);
  });
});

const hello = new Message().text('Hello');
bot.command('start', message => {
  bot.send(hello.to(message.chat.id));
});

const test = new Message().text('Test Command');
bot.command('test', message => {
  bot.send(test.to(message.chat.id));
});
```

This will result in:

![@JavaScriptBot](https://github.com/mdibaiee/node-telegram-api/raw/master/demo.gif)

# Bots using this module

[@JavaScriptBot](https://telegram.me/JavaScriptBot)

# Todo

- [ ] BulkMessage Type
- [ ] File Type
- [ ] Sticker Type
- [ ] Location Type
- [ ] Contact Type
- [ ] Allow remote control of bots (TCP maybe)
- [ ] YOUR IDEAS! [Fill an issue](https://github.com/mdibaiee/node-telegram-api/issues)
