export interface Page {
	count: number;
	number: number;
	skip: number;
};

export const paginate = (elementsPerPage: number, offset: number, count: number) => {
	if (elementsPerPage < 1) {
		throw new Error("invalid number of elements per page");
	}

	const firstPage = Math.ceil((offset + 1) / elementsPerPage);
	const lastPage = Math.ceil((offset + count) / elementsPerPage);
	const pages: Page[] = [];

	const firstPageCount = Math.min(elementsPerPage - (offset % elementsPerPage), count);

	if (firstPage <= lastPage) {
		pages.push({
			count: firstPageCount,
			number: firstPage,
			skip: offset % elementsPerPage
		});
	}

	for (let page = firstPage + 1; page < lastPage; ++page) {
		pages.push({
			count: elementsPerPage,
			number: page,
			skip: 0
		});
	}

	if (firstPage < lastPage) {
		pages.push({
			count: count - Math.max(elementsPerPage * (lastPage - firstPage - 2), 0) - firstPageCount,
			number: lastPage,
			skip: 0
		});
	}

	return pages;
};