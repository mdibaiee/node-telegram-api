# Telegram Bots
Create and control [Telegram bots](https://core.telegram.org/bots) easily
using the new [Telegram API](https://core.telegram.org/bots/api).

telegram-api is in beta, your feedback is appreciated, please [fill an issue](https://github.com/mdibaiee/node-telegram-api/issues)
for any bugs you find or any suggestions you have.
```
npm install telegram-api
```

# Example
Take a look at [demo.js](https://github.com/mdibaiee/node-telegram-api/blob/master/demo.js).

[@JavaScriptBot](https://telegram.me/JavaScriptBot) runs on `demo.js`, you can test it.

```javascript
var Bot = require('telegram-api');

// only require the message types you need, more coming soon!
var Message = require('telegram-api/types/Message');
var Question = require('telegram-api/types/Question');

var smartBot = new Bot({
  token: 'YOUR_KEY'
});

// getMe is called before polling starts, setting info property of bot
smartBot.start().then(() => {
  console.log(smartBot.info);
});

// Create a new question
// answers is a keyboard layout as defined in Telegram API
// we're going to reuse this by modifying it's target
const question = new Question()
  .text('How should I greet you?')
  .answers([['Hey'], ['Hello, Sir'], ['Yo bro']]);

// Called when a message starting with Hi is received
// You can use Regular Expressions, too
// update is an Update object as defined in Telegram API
smartBot.get('Hi', update => {
  const message = update.message;

  question.to(message.chat.id).reply(message.message_id);

  // Send the question, returns a promise, resolves on valid answer,
  // rejects in case of an invalid answer
  smartBot.send(question).then(answer => {
    const msg = new Message().to(id).text('Your answer: ' + answer);
    smartBot.send(msg);
  }, () => {
    const msg = new Message().to(id).text('Invalid answer');
    smartBot.send(msg);
  });
});

// Commands are in the format `/command` or `/command@botusername` in groups
const test = new Message().text('Test Command');
smartBot.command('test', update => {
  const message = update.message;
  const id = message.chat.id;

  smartBot.send(test.to(id));
});

const hello = new Message().text('Hello');
smartBot.command('start', update => {
  smartBot.send(hello.to(update.message.chat.id));
});
```

This will result in:

![@JavaScriptBot](https://github.com/mdibaiee/node-telegram-api/raw/master/demo.gif)


# Bots using this module

[@JavaScriptBot](https://telegram.me/JavaScriptBot)

# Todo

- [] BulkMessage Type
- [] File Type
- [] Sticker Type
- [] Location Type
- [] Contact Type
- [] Allow remote control of bots (TCP maybe)
- YOUR IDEAS! [Fill an issue](https://github.com/mdibaiee/node-telegram-api/issues)
