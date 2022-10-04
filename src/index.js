#!/usr/bin/env node

import inquirer from "inquirer";
import create from "./create.js";
import finish from "./finish.js";
import read from "./read.js"
import start from "./start.js";

const options = {
  create: "Bought a new book",
  start: "Started a book",
  read: "Read",
  finish: "Finished a book",
}
 
 const questions = [
   {
    type: "list",
    name: "init",
    message: "What did you do?",
    choices: Object.values(options),
    default: options.create
  },
];

inquirer.prompt(questions).then((answers) => {
  if (answers.init === options.create) {
    create();
  } else if (answers.init === options.read) {
    read();
  } else if (answers.init === options.start) {
    start();
  } else if (answers.init === options.finish) {
    finish();
  } else {
    console.log("\nOrder receipt:");
    console.log(JSON.stringify(answers, null, "  "));
  }
 });