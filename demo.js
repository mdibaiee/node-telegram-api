var Bot = require('./index');
var Message = require('./lib/classes/Message');
var Question = require('./lib/classes/Question');

process.on('uncaughtException', function (err) {
  console.error((new Date()).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});

var smartBot = new Bot({
  token: '121143906:AAE6pcpBoARNZZjr3fUpvKuLInJ5Eee5Ajk'
});

// getMe is called before polling starts, setting info property of bot
smartBot.start().then(() => {
  console.log(smartBot.info);
});

// You can use regular expressions, too
smartBot.get('Hi', function(update) {
  const message = update.message;
  const id = message.chat.id;

  var question = new Question().to(id)
                               .text('How should I greet you?')
                               .answers([['Hi'], ['Hello, Sir'], ['Yo bro']])
                               .reply(message.message_id);

  smartBot.send(question).then(answer => {
    const msg = new Message().to(id).text('Your answer: ' + answer);
    smartBot.send(msg);
  }, () => {
    const msg = new Message().to(id).text('Invalid answer');
    smartBot.send(msg);
  });
});

// Commands are in format `/command` or `/command@botusername` in groups
smartBot.command('test', update => {
  const message = update.message;
  const id = message.chat.id;

  // options object => Telegram API
  smartBot.send(new Message({
    chat_id: id,
    text: 'Test Command'
  }));
});

smartBot.command('start', update => {
  // chainable methods => easier
  smartBot.send(new Message().to(update.message.chat.id).text('Hello'));
});
