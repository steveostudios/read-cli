import inquirer from 'inquirer';
import {getUnstartedBooks, updateBook} from "./helpers.js"

import datePrompt from "inquirer-datepicker-prompt"
inquirer.registerPrompt("datetime", datePrompt);

const unstartedBooks = await getUnstartedBooks();

const questions = [
  {
    type: "list",
    name: "title",
    choices: unstartedBooks.map(book => book.title),
  },
  {
    type: 'datetime',
    name: 'date',
    message: 'When did you start?',
    format: ['m', '/', 'd', '/', 'yy']
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

    const bookToUpdate = unstartedBooks.find(book => book.title === answers.title);
    const date = answers.date.toISOString().split("T")[0];

    const updatedBook = {
      ...bookToUpdate,
      progress: answers.page,
      dateStart: date,
    }

    await updateBook(updatedBook); 
  })
}