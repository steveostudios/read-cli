#!/usr/bin/env node

import inquirer from "inquirer";
import create from "./create.js";
import finish from "./finish.js";
import read from "./read.js";
import start from "./start.js";
import { clearGitPrompt, commit, deployPrompt, gitLog } from "./helpers.js";
import { initMain } from "./questions.js";
import confetti from "./confetti.js";
const options = {
	create: "Bought a new book",
	start: "Started a book",
	read: "Read",
	finish: "Finished a book",
};

// get flags
const args = process.argv.slice(2);
const arg = args[0];

const mainMenu = () => {
	inquirer.prompt(initMain(options)).then((answers) => {
		if (answers.init === options.create) {
			create();
		} else if (answers.init === options.read) {
			read();
		} else if (answers.init === options.start) {
			start();
		} else if (answers.init === options.finish) {
			finish();
		}
	});
};

// check for flags
if (arg) {
	if (["read", "r"].includes(arg)) {
		read();
	} else if (["new", "n"].includes(arg)) {
		create();
	} else if (["start", "s"].includes(arg)) {
		start();
	} else if (["finish", "f"].includes(arg)) {
		finish();
	} else if (["deploy"].includes(arg)) {
		deployPrompt();
	} else if (["clear"].includes(arg)) {
		clearGitPrompt();
  } else if (["log"].includes(arg)) {
		gitLog();
  } else if (["test"].includes(arg)) {
    confetti();
	} else {
		mainMenu();
	}
} else {
	mainMenu();
}
