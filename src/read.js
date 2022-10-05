import inquirer from "inquirer";
import {
	getCurrentBooks,
	updateBook,
	appendGitStatus,
	deployPrompt,
} from "./helpers.js";
import { readMain, readResponse } from "./questions.js";

const currentBooks = await getCurrentBooks();

export default function () {
	inquirer
		.prompt(readMain(currentBooks))
		.then(async (answers) => {
			return currentBooks.find((book) => book.title === answers.title);
		})
		.then(async (book) =>
			inquirer.prompt(readResponse(book)).then(async (answers) => {
				const updatedBook = {
					...book,
					progress: answers.page,
				};
				await updateBook(updatedBook);
				await appendGitStatus(`read "${updatedBook.title}"`);
			})
		)
		.then(() => deployPrompt());
}
