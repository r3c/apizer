// From: https://stackoverflow.com/questions/43118692/typescript-filter-out-nulls-from-an-array
export function notEmpty<TValue>(value: TValue | undefined): value is TValue {
	return value !== undefined;
}