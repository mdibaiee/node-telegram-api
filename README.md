# Telegram Bots
Create and control [Telegram bots](https://core.telegram.org/bots) easily
using the new [Telegram API](https://core.telegram.org/bots/api).

telegram-api is in beta, your feedback is highly appreciated, please fill an issue
for any bugs you find or any suggestions you have.
```
npm install telegram-api
```

# Example
Take a look at [demo.js](https://github.com/mdibaiee/node-telegram-api/blob/master/demo.js).
Also [@JavaScriptBot](https://telegram.me/JavaScriptBot), still work in progress.

```javascript
var Bot = require('telegram-api');

var smartBot = new Bot({
  token: 'YOUR_KEY'
});

// getMe is called before polling starts, setting info property of bot
smartBot.start().then(() => {
  console.log(smartBot.info);
});

// You can use regular expressions, too
smartBot.get('Hi', function(update) {
  const message = update.message;
  const id = message.chat.id;

  // answers is in format of keyboard rows
  const question = 'How should I greet you?',
        answers = [['Hi'], ['Hello, Sir'], ['Yo bro']];

  smartBot.replyTo(message.message_id).askQuestion(id, question, answers)
  .then(answer => {
    smartBot.message(id, 'Your answer: ' + answer);
  }, () => {
    smartBot.message(id, 'Invalid answer');
  });
});

// Commands are in format `/command` or `/command@botusername` in groups
smartBot.command('test', update => {
  const message = update.message;
  const id = message.chat.id;

  smartBot.message(id, 'Test command');
});

smartBot.command('start', update => {
  smartBot.message(update.message.chat.id, 'Hello!');
});
// You can access all API methods through the api property until we implement
// easier methods
smartBot.api.getUserProfilePhotos
```

This will result in:

![@JavaScriptBot](https://github.com/mdibaiee/node-telegram-api/raw/master/demo.gif)
