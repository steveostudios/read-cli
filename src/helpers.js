import { deployMain } from "./questions.js";
import inquirer from "inquirer";
import confetti from "./confetti.js";

// Prompt whether or not we should deploy
export const deployPrompt = async () => {
	inquirer.prompt(deployMain()).then(async (answers) => {
		if (answers.confirm) {
			console.log("Pushing...(need to hook up to netlify deploy");
			confetti();
		}
	});
};

// Title Case
export const titleCase = (string) => {
	const lowers = [
		"a",
		"an",
		"the",
		"and",
		"but",
		"or",
		"for",
		"nor",
		"as",
		"at",
		"by",
		"for",
		"from",
		"in",
		"into",
		"near",
		"of",
		"on",
		"onto",
		"to",
		"with",
	];
	return string
		.split(" ")
		.map((w, i) => {
			if (i !== 0 && lowers.includes(w.toLowerCase())) {
				return w.toLowerCase();
			} else {
				return w[0].toUpperCase() + w.substring(1).toLowerCase();
			}
		})
		.join(" ");
};
