import inquirer from 'inquirer';
import fetch from 'node-fetch';
import { downloadThumbnail, addBook } from './helpers.js';

const questions = [
  {
    type: "input",
    name: "isbn",
    filter: Number,
  }
];

export default function () {
  inquirer.prompt(questions).then(async (answers) => {
    const isbn = answers.isbn;

    const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`);
    const responseData = await response.json();
    const data = responseData[`ISBN:${isbn}`]
    
    const newBook = {
      isbn: isbn,
      pages: data.number_of_pages,
      title: data.title,
      authors: data.authors.map(item => item.name).join(", "),
    }

    if (data.cover.medium) {
      const fileName =
      data.title
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.substring(1))
        .join("") + ".jpg";
      
      await downloadThumbnail(data.cover.medium, fileName);
      newBook.image = fileName
    }

    if (data.subtitle) {
      newBook.subtitle = data.subtitle;
    }

    await addBook(newBook)
  })
}