import inquirer from "inquirer";
import fetch from "node-fetch";
import { createBook } from "./airtable.js";
import { deployPrompt, titleCase } from "./helpers.js";
import {
	createAdditionalInfo,
	createMain,
	createResponse,
} from "./questions.js";

export default function () {
	inquirer
		.prompt(createMain())
		.then(async (answers) => {
			const isbn = answers.isbn;
			// get book data
			const response = await fetch(
				`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`
			);
			const json = await response.json();
			const data = json[`ISBN:${isbn}`];

			return { isbn: isbn, ...data };
		})
		.then(async (data) => {
			return await inquirer
				.prompt(createAdditionalInfo(data))
				.then((answers) => {
					const title = titleCase(data.title);

					const book = {
						isbn: data.isbn.toString(),
						title: title,
						author: data.authors.map((item) => item.name).join(", "),
						pages: data.number_of_pages || answers.pages,
						cover: [{ url: data?.cover?.medium || answers.imageURL }],
						// image: filename,
					};

					if (data.subtitle) {
						book.subtitle = titleCase(data.subtitle);
					}

					return book;
				});
		})
		.then(async (book) =>
			inquirer.prompt(createResponse(book)).then(async (answers) => {
				if (answers.response) {
					console.log(book);
					await createBook(book);
				}
			})
		)
		.then(() => deployPrompt());
}
