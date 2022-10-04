import inquirer from 'inquirer';
import {getCurrentBooks, updateBook} from "./helpers.js";

import datePrompt from "inquirer-datepicker-prompt"
inquirer.registerPrompt("datetime", datePrompt);

const currentBooks = await getCurrentBooks();

const questions = [
  {
    type: "list",
    message: "Which book?",
    name: "title",
    choices: currentBooks.map(book => book.title),
  },
  {
    type: 'datetime',
    name: 'date',
    message: 'When did you finish?',
    format: ['m', '/', 'd', '/', 'yy']
  },
];

export default function () {
  inquirer.prompt(questions).then(async (answers) => {

    const bookToUpdate = currentBooks.find(book => book.title === answers.title);
    const date = answers.date.toISOString().split("T")[0];
    delete bookToUpdate.progress;

    const updatedBook = {
      ...bookToUpdate,
      dateFinish: date,
    }

    await updateBook(updatedBook);
 })
}