import cliConfetti from "cli-confetti";
import CliUpdate from "cli-update";

export default function () {
	const startTime = new Date();

	cliConfetti(
		{},
		function (err, c) {
			if (err) throw err;
			if ((new Date() - startTime) / 1000 > 3) {
				return process.exit(0);
			}
			CliUpdate.render(c);
		}
	);
}
