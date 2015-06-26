# Telegram Bots
Control Telegram bots easily.

```
npm install telegram-bots
```

# Example
```javascript
let Bot = require('telegram-bots');

let smartBot = new Bot({
  token: 'YOUR_TOKEN'
});

// update is an Update object as described in Telegram Bots API documentation
smartBot.on('Hi', update => {
  const message = update.message,
        id = message.chat.id;

  const question = 'How should I greet you?',
        answers = ['Hi', 'Hello, Sir', 'Yo bro'];

  smartBot.askQuestion(id, question, answers)
  .then(answer => {
    smartBot.message(id, `Your answer: ${answer}`);
  }, () => {
    smartBot.message(id, 'Invalid answer');
  });
});

smartBot.command('test', update => {
  const message = update.message;
  const id = message.chat.id;

  smartBot.message(id, 'Test command');
});

smartBot.command('start', update => {
  smartBot.message(update.message.chat.id, 'Hello!');
});
```

This will result in:
