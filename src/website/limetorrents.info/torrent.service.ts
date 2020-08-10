import { Entry } from "../../domain/torrent";
import { notEmpty } from "../../functional/array";
import { selectWithCheerio } from "../../query/selection";
import { get, postFormData } from "../../query/submission";

const base = "https://www.limetorrents.info";

export class TorrentService {
	public async searchByKeywords(keywords: string): Promise<Entry[]> {
		const extract = (buffer: Buffer) => selectWithCheerio(buffer, ".table2 tr[bgcolor]", {
			leech: ".tdleech",
			link: ".tt-name a:not([rel])",
			seed: ".tdseed",
			size: "td:nth-child(3)"
		});

		const idRegex = /-([0-9]+)\.html/;
		const input = {
			catname: 'all',
			q: keywords
		};

		const elements = await postFormData(`${base}/post/search.php`, input, extract, []);
		const results = await Promise.all(elements.map(async element => {
			const page = element.link.attr("href") || "";
			const pageMatch = idRegex.exec(page);
			const sizeFragments = element.size.text().split(" ");

			if (pageMatch === null || sizeFragments.length !== 2)
				return undefined;

			const [magnet, torrent] = await this.getLinks(page);

			return {
				id: parseInt(pageMatch[1]),
				leechers: parseInt(element.leech.text()),
				magnet: magnet,
				page: page,
				seeders: parseInt(element.seed.text()),
				size: parseInt(sizeFragments[0]),
				sizeUnit: sizeFragments[1],
				title: element.link.text(),
				torrent: torrent
			};
		}));

		return results.filter(notEmpty);
	}

	private async getLinks(suffix: string): Promise<[string, string]> {
		const extract = (buffer: Buffer) => selectWithCheerio(buffer, ".torrentinfo", {
			magnet: "a:contains('Magnet Download')",
			torrent: "a:contains('Download torrent')"
		});

		const elements = await get(`${base}${suffix}`, extract, [])

		if (elements.length < 1) {
			return ["", ""];
		}

		const element = elements[0];
		const magnet = element.magnet.attr("href") || "";
		const torrent = element.torrent.attr("href") || "";

		return [magnet, torrent];
	}
}