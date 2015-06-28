import Message from './Message';

export default class Question extends Message {
  constructor(options = {}) {
    super(options);

    this.keyboard().force().oneTime().selective();
  }

  answers(answers) {
    this.answers = answers;
    this.keyboard().keys(answers);
    return this;
  }

  send(bot) {
    const answers = this.answers;

    return new Promise((resolve, reject) => {
      super.send(bot).then(update => {
        const message = update.message;
        let answer;

        answers.forEach(function find(a) {
          if (Array.isArray(a)) {
            a.forEach(find);
          }
          if (a === message.text) {
            answer = a;
          }
        });

        if (answer) {
          resolve(answer, update);
          this.emit('question:answer', answer, update);
        } else {
          reject(update);
          this.emit('question:invalid', update);
        }
      });
    });
  }
}
