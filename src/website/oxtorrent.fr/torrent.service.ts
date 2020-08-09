import { Match } from "./torrent";
import { notEmpty } from "../../functional/array";
import { selectWithCheerio } from "../../query/selection";
import { get, postFormData } from "../../query/submission";

const base = "https://wvww.oxtorrent.fr";

export class TorrentService {
	public async searchByKeywords(keywords: string): Promise<Match[]> {
		const idRegex = /torrents\/(([0-9]+)\/.*)/;
		const input = {
			story: keywords
		};

		const select = (buffer: Buffer) => selectWithCheerio(buffer, ".listing-torrent tr", {
			leech: "td:nth-child(4)",
			link: "td:nth-child(1) a",
			seed: "td:nth-child(3)",
			size: "td:nth-child(2)"
		});

		const convert = (buffer: Buffer) => select(buffer).map(async element => {
			const sizeFragments = element.size.text().split(" ");
			const url = element.link.attr("href") || "";
			const urlMatch = idRegex.exec(url);

			if (sizeFragments.length !== 2 || urlMatch === null)
				return undefined;

			const urlMagnet = await this.getMagnet(urlMatch[1]);

			return {
				id: urlMatch[2],
				leechers: parseInt(element.leech.text()),
				seeders: parseInt(element.seed.text()),
				size: parseInt(sizeFragments[0]),
				sizeUnit: sizeFragments[1],
				title: element.link.attr("title") || "",
				urlMagnet: urlMagnet,
				urlPage: url
			};
		});

		const promises = await postFormData(`${base}/index.php?do=search&subaction=search`, input, convert, []);
		const results = await Promise.all(promises);

		return results.filter(notEmpty);
	}

	private getMagnet(suffix: string): Promise<string> {
		const select = (buffer: Buffer) => selectWithCheerio(buffer, ".download", {
			magnet: ".btn-magnet a"
		});

		const convert = (buffer: Buffer) => {
			const element = select(buffer)[0];

			return element.magnet.attr("href") || "";
		};

		return get(`${base}/torrents/${suffix}`, convert, "");
	}
}