import inquirer from "inquirer";
import { getReading, updateBook } from "./airtable.js";
import { deployPrompt } from "./helpers.js";
import { readMain, readResponse } from "./questions.js";

const currentBooks = await getReading();

export default function () {
	const books = currentBooks;

	inquirer
		.prompt(readMain(books))
		.then(async (answers) => {
			return books.find((book) => book.id === answers.title);
		})
		.then(async (book) =>
			inquirer.prompt(readResponse(book)).then(async (answers) => {
				const updatedBook = {
					...book,
					progress: answers.page,
				};
				await updateBook(updatedBook);
			})
		)
		.then(() => deployPrompt());
}
