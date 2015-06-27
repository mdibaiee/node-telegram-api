var Bot = require('./index');

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
