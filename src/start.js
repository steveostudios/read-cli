import inquirer from "inquirer";
import {
	appendGitStatus,
	getUnstartedBooks,
	updateBook,
	deployPrompt,
} from "./helpers.js";
import { startMain, startResponse } from "./questions.js";
import datePrompt from "inquirer-datepicker-prompt";

inquirer.registerPrompt("datetime", datePrompt);

const unstartedBooks = await getUnstartedBooks();

export default function () {
	inquirer
		.prompt(startMain(unstartedBooks))
		.then(async (answers) => {
			return unstartedBooks.find((book) => book.title === answers.title);
		})
		.then(async (book) =>
			inquirer.prompt(startResponse(book)).then(async (answers) => {
				const date = answers.date.toISOString().split("T")[0];
				const updatedBook = {
					...book,
					progress: answers.page,
					dateStart: date,
				};

				await updateBook(updatedBook);
				await appendGitStatus(`started "${updatedBook.title}"`);
			})
		)
		.then(() => deployPrompt());
}
