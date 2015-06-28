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
  const id = message.chat.id;

  question.to(id).reply(message.message_id);

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
