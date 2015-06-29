var Bot = require('telegram-api');

// only require the message types you need, more coming soon!
var Message = require('telegram-api/types/Message');
var Question = require('telegram-api/types/Question');

var bot = new Bot({
  token: '121143906:AAE6pcpBoARNZZjr3fUpvKuLInJ5Eee5Ajk'
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
