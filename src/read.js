import inquirer from 'inquirer';
import {getCurrentBooks, updateBook} from "./helpers.js"

const currentBooks = await getCurrentBooks();

const questions = [
  {
    type: "list",
    name: "title",
    choices: currentBooks.map(book => book.title),
  },
  {
    type: 'input',
    name: 'page',
    message: 'What page are you on?',
    validate(value) {
      const valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
  },
];

export default function () {
  inquirer.prompt(questions).then(async (answers) => {

    const bookToUpdate = currentBooks.find(book => book.title === answers.title);

    const updatedBook = {
      ...bookToUpdate,
      progress: answers.page,
    }

    await updateBook(updatedBook); 
  })
}