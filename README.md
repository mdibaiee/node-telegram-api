# Telegram Bots
Create and control [Telegram bots](https://core.telegram.org/bots) easily
using the new [Telegram API](https://core.telegram.org/bots/api).

```
npm install telegram-api
```

# Example
```javascript
var Bot = require('telegram-api');

var smartBot = new Bot({
  token: 'YOUR_KEY'
});

smartBot.start();

// You can use regular expressions, too
smartBot.get('Hi', function(update) {
  const message = update.message;
  const id = message.chat.id;

  const question = 'How should I greet you?',
        answers = ['Hi', 'Hello, Sir', 'Yo bro'];

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
