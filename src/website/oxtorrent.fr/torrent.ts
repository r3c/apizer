/**
 * Search result.
 */
export interface Match {
	id: string,
	leechers: number,
	seeders: number,
	size: number,
	sizeUnit: string,
	title: string,
	urlMagnet: string,
	urlPage: string
}