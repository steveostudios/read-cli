import inquirer from 'inquirer';
import {appendGitStatus, getCurrentBooks, updateBook, deployPrompt} from "./helpers.js";
import { finishMain } from "./questions.js";

import datePrompt from "inquirer-datepicker-prompt"
inquirer.registerPrompt("datetime", datePrompt);

const currentBooks = await getCurrentBooks();

export default function () {
  inquirer
    .prompt(finishMain(currentBooks))
    .then(async (answers) => {
      const book = currentBooks.find(book => book.title === answers.title);
      const date = answers.date.toISOString().split("T")[0];
      delete book.progress;
      const updatedBook = {
        ...book,
        stars: answers.stars,
        dateFinish: date,
      }
      await updateBook(updatedBook);
      await appendGitStatus(`finished "${book.title}"`);
  }).then(() => deployPrompt());
}