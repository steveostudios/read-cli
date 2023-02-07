import inquirer from "inquirer";
import { getUnread, updateBook } from "./airtable.js";
import { startMain, startResponse } from "./questions.js";
import datePrompt from "inquirer-datepicker-prompt";
import { deployPrompt } from "./deploy.js";

inquirer.registerPrompt("datetime", datePrompt);

const unreadBooks = await getUnread();

export default function () {
	const books = unreadBooks;

	inquirer
		.prompt(startMain(books))
		.then(async (answers) => {
			return books.find((book) => book.id === answers.title);
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
			})
		)
		.then(() => deployPrompt());
}
