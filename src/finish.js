import inquirer from "inquirer";
import { getReading, updateBook } from "./airtable.js";
import { finishMain } from "./questions.js";
import { deployPrompt } from "./deploy.js";

import datePrompt from "inquirer-datepicker-prompt";
inquirer.registerPrompt("datetime", datePrompt);

const currentBooks = await getReading();

export default function () {
	const books = currentBooks;

	inquirer
		.prompt(finishMain(books))
		.then(async (answers) => {
			const book = books.find((book) => book.id === answers.title);
			const date = answers.date.toISOString().split("T")[0];
			const updatedBook = {
				...book,
				progress: null,
				stars: answers.stars,
				dateFinish: date,
			};

			await updateBook(updatedBook);
		})
		.then(() => deployPrompt());
}
