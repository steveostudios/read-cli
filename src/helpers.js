import path from "path";
import { promises as fs } from "fs";
import fetch from 'node-fetch';
import sharp from "sharp";
import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import {config } from "./config.js"

const repoPath = config.repoPath;
const booksPath = path.join(repoPath, "src/_data/books.json");

export const downloadThumbnail = async (url, fileName) => {
  const imagePath = path.join(repoPath, "src", "img", "books", fileName);
  // fetch image
  const response = await fetch(url);
  // convert to response buffer
  const buffer = await response.arrayBuffer();
  // resize image, keep as buffer
  const resizedBuffer = await sharp(Buffer.from(buffer)).resize({height: 200}).toBuffer()
  // compress image, keep as buffer
  const compressedImage = await imagemin.buffer(resizedBuffer, {
    destination: imagePath,
    plugins: [imageminJpegtran({quality: [0.6, 0.8]})]
  })
  // save buffer to image
  fs.writeFile(imagePath, compressedImage, () =>
    console.log("finished downloading!")
  );
}

export const getAllBooks = async () => {
  const books = await fs
  .readFile(booksPath, { encoding: "utf-8" })
  .then((res) => JSON.parse(res));
  return books 
}

export const getCurrentBooks = async () => {
  const books = await getAllBooks();

  // Grab only unread books
  return await books.filter((item) => item.progress);
}

export const getUnstartedBooks = async () => {
  const books = await getAllBooks();

  // Grab only unread books
  return await books.filter((item) => !item.dateStart);
}

export const addBook = async (book) => {
  const books = await getAllBooks();

  const updateBooks = [book, ...books];

  writeBooks(updateBooks);
}

export const updateBook = async (book) => {
  const books = await getAllBooks();

  const updatedBooks = books.map(item => {
    if (item.title === book.title) {
      return book;
    } else {
      return item;
    }
  })

  writeBooks(updatedBooks);
}

export const writeBooks = async (books) => {
  fs.writeFile(booksPath, JSON.stringify(books, null, 2));
}