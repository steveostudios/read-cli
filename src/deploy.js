import * as dotenv from "dotenv";
dotenv.config();

import fetch from "node-fetch";
import { deployMain } from "./questions.js";
import inquirer from "inquirer";
import confetti from "./confetti.js";

// Prompt whether or not we should deploy
export const deployPrompt = async () => {
	inquirer.prompt(deployMain()).then(async (answers) => {
		if (answers.confirm) {
			console.log("Pushing...(need to hook up to netlify deploy");

			await fetch(process.env.NETLIFY_DEPLOY_HOOK, {
				method: "post",
			});
			confetti();
		}
	});
};
