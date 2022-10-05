import inquirer from "inquirer";
import fetch from "node-fetch";
import {
	appendGitStatus,
	downloadThumbnail,
	addBook,
	getFilename,
	deployPrompt,
} from "./helpers.js";
import { createMain, createResponse } from "./questions.js";

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
			const book = {
				isbn: isbn,
				pages: data.number_of_pages,
				title: data.title,
				authors: data.authors.map((item) => item.name).join(", "),
			};
			// if there is an image, add it
			if (data.cover.medium) {
				const filename = getFilename(data.title);
				book.imageURL = data.cover.medium;
				book.image = filename;
			}
			// if there is a subtitle, add it
			if (data.subtitle) {
				book.subtitle = data.subtitle;
			}
			return book;
		})
		.then(async (book) =>
			inquirer.prompt(createResponse(book)).then(async (answers) => {
				if (answers.response) {
					if (book.image) {
						await downloadThumbnail(book.imageURL, book.image);
					}
					await addBook(book);
					await appendGitStatus(`added "${book.title}"`);
				}
			})
		)
		.then(() => deployPrompt());
}
