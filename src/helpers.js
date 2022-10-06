import path from "path";
import { promises as fs } from "fs";
import fetch from "node-fetch";
import sharp from "sharp";
import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import { config } from "./config.js";
import simpleGit from "simple-git";
import { gitMain, gitClear } from "./questions.js";
import inquirer from "inquirer";
import appRoot from "app-root-path"
import confetti from "./confetti.js";

const repoPath = config.repoPath;
const booksPath = path.join(repoPath, "src/_data/books.json");
const gitStatusPath = path.join(appRoot.path, "src/gitstatus.txt");

// download, resize, compress, and save image
export const downloadThumbnail = async (url, fileName) => {
	const imagePath = path.join(repoPath, "src", "img", "books", fileName);
	// fetch image
	const response = await fetch(url);
	// convert to response buffer
	const buffer = await response.arrayBuffer();
	// resize image, keep as buffer
	const resizedBuffer = await sharp(Buffer.from(buffer))
		.resize({ height: 200 })
		.toBuffer();
	// compress image, keep as buffer
	const compressedImage = await imagemin.buffer(resizedBuffer, {
		destination: imagePath,
		plugins: [imageminJpegtran({ quality: [0.6, 0.8] })],
	});
	// save buffer to image
	fs.writeFile(imagePath, compressedImage);
};

// get filename from title
export const getFilename = (title) => {
	return (
		title
			.replace(/\W/g, '')
			.split(" ")
			.map((word) => word[0].toUpperCase() + word.substring(1))
			.join("") + ".jpg"
	);
};

// get _all_ the books from the repo
export const getAllBooks = async () => {
	const books = await fs
		.readFile(booksPath, { encoding: "utf-8" })
		.then((res) => JSON.parse(res));
	return books;
};

// get only the _current_ books
export const getCurrentBooks = async () => {
	const books = await getAllBooks();
	return await books.filter((item) => item.progress);
};

// get only the _unstarted_ books
export const getUnstartedBooks = async () => {
	const books = await getAllBooks();
	return await books.filter((item) => !item.dateStart);
};

// prepend a book
export const addBook = async (book) => {
	const books = await getAllBooks();
	const updateBooks = [book, ...books];
	writeBooks(updateBooks);
};

// update a specific book (matched by title)
export const updateBook = async (book) => {
	const books = await getAllBooks();
	const updatedBooks = books.map((item) => {
		if (item.title === book.title) {
			return book;
		} else {
			return item;
		}
	});

	writeBooks(updatedBooks);
};

// write the book file to the repo
export const writeBooks = async (books) => {
	fs.writeFile(booksPath, JSON.stringify(books, null, 2));
};

// append a message to the git status
export const appendGitStatus = async (message) => {
	await fs.appendFile(gitStatusPath, `- ${message}\n`, function (err) {
		if (err) throw err;
	});
};

// clear the git status
const clearGitStatus = async (message) => {
	await fs.writeFile(gitStatusPath, "", function (err) {
		if (err) throw err;
	});
};

// commit the changes, thus deploying the site
export const commit = async () => {
	const gitMessage = await fs.readFile(gitStatusPath, { encoding: "utf-8" });
	const git = simpleGit(repoPath);
	await git.add(".");
	await git.commit(gitMessage);
	await git.push();
	await clearGitStatus();
};

// Prompt whether or not we should deploy
export const deployPrompt = async () => {
	inquirer.prompt(gitMain()).then(async (answers) => {
		if (answers.git) {
			const gitMessage = await fs.readFile(gitStatusPath, {
				encoding: "utf-8",
			});
			console.log("Pushing...");
			console.log(gitMessage);
			await commit();
      confetti();
		}
	});
};

// clear the contents of the git log
export const clearGitPrompt = async () => {
	inquirer.prompt(gitClear()).then(async (answers) => {
		if (answers.clear) {
			clearGitStatus()
		}
	});
};

// see the contents of the git log
export const gitLog = async () => {
	const gitMessage = await fs.readFile(gitStatusPath, {
    encoding: "utf-8",
  });
  console.log(gitMessage);
};
