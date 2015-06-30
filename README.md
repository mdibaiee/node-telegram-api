# Telegram Bots
Create and control [Telegram bots](https://core.telegram.org/bots) easily
using the new [Telegram API](https://core.telegram.org/bots/api).

telegram-api is in beta, your feedback is appreciated, please [fill an issue](https://github.com/mdibaiee/node-telegram-api/issues)
for any bugs you find or any suggestions you have.
```
npm install telegram-api
```

If you are cloning this repository, remember to run `npm install` to install dependencies.

The code is well documented. I'm trying to integrate JSDoc / ESDoc into our repository for an easy to access documentation.

---

All Telegram API methods are accessible through `api` property of bots.

```javascript
bot.api.sendPhoto({
  chat_id: 99999,
  photo: 'some_id',
  caption: 'dancing monkey'
});
```

Some API methods have been simplified using what we call *types*. See the example below.

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

bot.start().catch(err => {
  console.error(err, '\n', err.stack);
});

// polling
bot.on('update', update => {
  console.log('Polled\n', update);
});

const question = new Question({
  text: 'How should I greet you?',
  answers: [['Hey'], ['Hello, Sir'], ['Yo bro']]
});

bot.get(/Hi\sBot/, message => {
  const id = message.chat.id;

  question.to(id).reply(message.message_id);

  bot.send(question).then(answer => {
    const msg = new Message().to(id).text('Your answer: ' + answer.text);
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

- [x] Webhook support
- [ ] BulkMessage Type
- [ ] File Type
- [ ] Sticker Type
- [ ] Location Type
- [ ] Contact Type
- [ ] Allow remote control of bots (TCP maybe)
- [ ] YOUR IDEAS! [Fill an issue](https://github.com/mdibaiee/node-telegram-api/issues)
