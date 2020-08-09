import { Match } from "../oxtorrent.fr/torrent";
import { notEmpty } from "../../functional/array";
import { selectWithCheerio } from "../../query/selection";
import { get, postFormData } from "../../query/submission";

const base = "https://www.limetorrents.info";

export class TorrentService {
	public async searchByKeywords(keywords: string): Promise<Match[]> {
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
			const sizeFragments = element.size.text().split(" ");
			const url = element.link.attr("href") || "";
			const urlMatch = idRegex.exec(url);

			if (sizeFragments.length !== 2 || urlMatch === null)
				return undefined;

			const [urlMagnet, urlTorrent] = await this.getLinks(url);

			return {
				id: parseInt(urlMatch[1]),
				leechers: parseInt(element.leech.text()),
				seeders: parseInt(element.seed.text()),
				size: parseInt(sizeFragments[0]),
				sizeUnit: sizeFragments[1],
				title: element.link.text(),
				urlMagnet: urlMagnet,
				urlPage: url,
				urlTorrent: urlTorrent
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
		const urlMagnet = element.magnet.attr("href") || "";
		const urlTorrent = element.torrent.attr("href") || "";

		return [urlMagnet, urlTorrent];
	}
}