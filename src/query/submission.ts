import { URLSearchParams } from "url";
import fetch, { RequestInit } from "node-fetch";

type FormData = { [key: string]: string };

async function query<TResult>(url: string, options: RequestInit, extract: (buffer: Buffer) => TResult, fallback: TResult): Promise<TResult> {
	const response = await fetch(url, options);

	if (!response.ok)
		return fallback;

	const buffer = await response.buffer();

	return extract(buffer);
}

export function get<TResult>(url: string, extract: (buffer: Buffer) => TResult, fallback: TResult): Promise<TResult> {
	return query(url, {}, extract, fallback);
}

export async function postFormData<TResult>(url: string, input: FormData, extract: (buffer: Buffer) => TResult, fallback: TResult): Promise<TResult> {
	const params = new URLSearchParams();

	for (const key in input) {
		params.append(key, input[key]);
	}

	return query(url, {
		method: 'POST',
		body: params
	}, extract, fallback);
}