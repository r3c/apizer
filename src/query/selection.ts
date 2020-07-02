import * as cheerio from "cheerio";

export function selectWithCheerio<T>(input: Buffer, selector: string, mapper: { [key in keyof T]: string }): { [key in keyof T]: Cheerio }[] {
	const elements = [];
	const select = cheerio.load(input);

	for (const node of select(selector).toArray()) {
		const element: { [key in keyof T]: Cheerio } = <any>{};

		for (const key in mapper) {
			element[key] = select(mapper[key], node);
		}

		elements.push(element);
	}

	return elements;
}

export function selectWithRegex<T>(input: string, regexp: RegExp, mapper: { [key in keyof T]: number }): { [key in keyof T]: string }[] {
	if (!regexp.global) {
		throw "regexp must have global flag enabled for this function to work";
	}

	const elements = [];

	for (regexp.lastIndex = 0; ;) {
		const match = regexp.exec(input);

		if (match === null) {
			break;
		}

		const element: { [key in keyof T]: string } = <any>{};

		for (const key in mapper) {
			element[key] = match[mapper[key]];
		}

		elements.push(element);
	}

	return elements;
}