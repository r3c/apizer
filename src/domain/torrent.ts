/**
 * Torrent entry.
 */
export interface Entry {
	id: number,
	leechers: number,
	seeders: number,
	size: number,
	sizeUnit: string,
	title: string,
	urlMagnet: string,
	urlPage: string
}