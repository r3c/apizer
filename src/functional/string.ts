export function matchRegularExpression<T>(value: string, regexp: RegExp, groups: { [K in keyof T]: number }): { [K in keyof T]: string | undefined } {
	const captures: { [K in keyof T]: string | undefined } = <any>{};
	const match = regexp.exec(value);

	if (match !== null) {
		for (const key in groups) {
			captures[key] = match[groups[key]];
		}
	}
	else {
		for (const key in groups) {
			captures[key] = undefined;
		}
	}

	return captures;
}

export function matchSizeWithUnit(sizeWithUnit: string): number | undefined {
	const sizeFragments = sizeWithUnit.split(" ");

	if (sizeFragments.length !== 2) {
		return undefined;
	}

	const multipliers: { [unit: string]: number } = {
		gb: 1024 * 1024 * 1024,
		kb: 1024,
		mb: 1024 * 1024
	};

	const amount = parseFloat(sizeFragments[0]);
	const unit = sizeFragments[1].toLowerCase();
	const multiplier = multipliers[unit];

	if (isNaN(amount) || multiplier === undefined) {
		return undefined;
	}

	return amount * multiplier;
}