import * as dotenv from "dotenv";
dotenv.config();

import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
	process.env.AIRTABLE_BASE_BOOKS_BASE
);

async function getRecords(table, options = {}) {
	let recordsArray = [];
	await base(table)
		.select(options)
		.eachPage((records, fetchNextPage) => {
			recordsArray = [
				...recordsArray,
				...records.map((record) => {
					return { id: record.id, ...record.fields };
				}),
			];
			fetchNextPage();
		})
		.catch((error) => {
			console.error(error);
			return false;
		});
	return recordsArray;
}

async function updateRecord(table, record = {}) {
	const { id, ...fields } = record;
	await base(table).update([{ id, fields }], function (err, records) {
		if (err) {
			console.error(err);
			return;
		}
		// records.forEach(function (record) {
		// console.log(record.get("isbn"));
		// });
	});
}

async function createRecord(table, record = {}) {
	const { id, ...fields } = record;
	await base(table).create([{ id, fields }], function (err, records) {
		if (err) {
			console.error(err);
			return;
		}
		// records.forEach(function (record) {
		// console.log(record.get("isbn"));
		// });
	});
}

export const getReading = async () => {
	return await getRecords(process.env.AIRTABLE_BASE_BOOKS_TABLE, {
		view: "Reading",
	});
};

export const getUnread = async () => {
	return await getRecords(process.env.AIRTABLE_BASE_BOOKS_TABLE, {
		view: "Not Started",
	});
};

export const updateBook = async (record) => {
	return await updateRecord(process.env.AIRTABLE_BASE_BOOKS_TABLE, record);
};

export const createBook = async (record) => {
	return await createRecord(process.env.AIRTABLE_BASE_BOOKS_TABLE, record);
};
