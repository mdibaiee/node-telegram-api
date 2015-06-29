import Message from './Message';
import Keyboard from './Keyboard';

/**
 * Question class, extends Message
 * Sends a message, shows a keyboard with the answers provided, and validates
 * the answer
 */
export default class Question extends Message {
  /**
   * Create a new question
   * @param  {object} options Options, same as Message, plus `answers` which
   *                          is a keyboard layout, see Keyboard#keys
   */
  constructor(options = {}) {
    super(options);

    let kb = new Keyboard().force().oneTime().selective();
    this.keyboard(kb);

    this.answers(options.answers);
  }

  /**
   * Sets answers of the question. This is passed to Keyboard#keys, and then
   * used to validate the answer given
   * @param  {array} answers Array of arrays of strings, same as Keyboard#keys
   * @return {object} returns the question object
   */
  answers(answers) {
    this._answers = answers;
    this._keyboard.keys(answers);
    return this;
  }

  /**
   * Sends the question (same as Message#send), and validates the answer given
   * if the answer is one of the defined answers, resolves, else rejects
   * You should not manually use this method unless you're extending this class
   * You should instead use bot.send(question);
   * @param  {object} bot
   * @return {promise} A promise which is resolved in case of valid answer, and
   *                     rejected in case of invalid answer
   */
  send(bot) {
    const answers = this._answers;

    return super.send(bot).then(message => {
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
        this.emit('question:answer', answer, message);
        return message;
      } else {
        this.emit('question:invalid', message);
        throw update;
      }
    });
  }
}
