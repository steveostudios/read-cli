// Main
export const initMain = (options) => {
	return [
		{
			type: "list",
			name: "init",
			message: "What did you do?",
			choices: Object.values(options),
			default: options.create,
		},
	];
};

// Create
export const createMain = () => {
	return [
		{
			type: "input",
			name: "isbn",
			message: "Scan the ISBN number",
			filter: Number,
		},
	];
};

export const createResponse = (book) => {
	return [
		{
			type: "confirm",
			name: "response",
			message: `Good choice! Do you want to add ${book.title}?`,
		},
	];
};

// Start
export const startMain = (books) => {
	return [
		{
			type: "list",
			message: "What book did you start?",
			name: "title",
			choices: books.map((book) => book.title),
		},
	];
};

export const startResponse = (book) => {
	return [
		{
			type: "datetime",
			name: "date",
			message: "When did you start?",
			format: ["m", "/", "d", "/", "yy"],
			date: {
				max: new Date().toISOString().split("T")[0],
			},
		},
		{
			type: "number",
			name: "page",
			message: `What page are you on? [0/${book.pages}]`,
			validate(value) {
				const validNum = !isNaN(parseFloat(value));
				if (!validNum) return "Please enter a number";
				if (value < 0) return "You have to have read at least one page";
				if (value > book.pages)
					return "You cannot read more that the book is long.";
				return validNum;
			},
			filter: Number,
		},
	];
};

// Read
export const readMain = (books) => {
	return [
		{
			type: "list",
			message: "What book did you read?",
			name: "title",
			choices: books.map((book) => book.title),
		},
	];
};

export const readResponse = (book) => {
	return [
		{
			type: "input",
			name: "page",
			message: `What page are you on? [${book.progress}/${book.pages}]`,
			validate(value) {
				const validNum = !isNaN(parseFloat(value));
				if (!validNum) return "Please enter a number";
				if (value < 0) return "You have to have read at least one page";
				if (value > book.pages)
					return "You cannot read more that the book is long.";
				return validNum;
			},
			filter: Number,
		},
	];
};

// Finish
export const finishMain = (books) => {
	return [
		{
			type: "list",
			message: "What book did you finish?",
			name: "title",
			choices: books.map((book) => book.title),
		},
		{
			type: "datetime",
			name: "date",
			message: "When did you finish?",
			format: ["m", "/", "d", "/", "yy"],
			date: {
				max: new Date().toISOString().split("T")[0],
			},
		},
		{
			type: "number",
			name: "stars",
			message: "How many stars would you give it?",
			validate(value) {
				const validNum = !isNaN(parseFloat(value));
				if (!validNum) return "Please enter a number";
				if (value < 0 && value > 5 ) return "Must be 1-5";
				return validNum;
			},
			filter: Number,
		},
	];
};

// Git
export const gitMain = () => {
	return [
		{
			type: "confirm",
			name: "git",
			message: "Do you want to deploy?",
		},
	];
};

export const gitClear = () => {
	return [
		{
			type: "confirm",
			name: "clear",
			message: "Do you want to clear the git log?",
		},
	];
};
