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
