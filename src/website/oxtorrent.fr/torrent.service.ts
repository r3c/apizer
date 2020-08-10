import { Entry } from "../../domain/torrent";
import { notEmpty } from "../../functional/array";
import { matchRegularExpression, matchSizeWithUnit } from "../../functional/string";
import { selectWithCheerio } from "../../query/selection";
import { get, postFormData } from "../../query/submission";

const base = "https://wvww.oxtorrent.fr";
const pageRegex = /torrents\/(([0-9]+)\/.*)/;

export class TorrentService {
	public async searchByKeywords(keywords: string): Promise<Entry[]> {
		const extract = (buffer: Buffer) => selectWithCheerio(buffer, ".listing-torrent tr", {
			leech: "td:nth-child(4)",
			link: "td:nth-child(1) a",
			seed: "td:nth-child(3)",
			size: "td:nth-child(2)"
		});

		const input = {
			story: keywords
		};

		const elements = await postFormData(`${base}/index.php?do=search&subaction=search`, input, extract, []);
		const results = await Promise.all(elements.map(async element => {
			const page = element.link.attr("href") || "";
			const [suffix, id] = matchRegularExpression(page, pageRegex, [1, 2]);
			const size = matchSizeWithUnit(element.size.text());

			if (id === undefined || size === undefined || suffix === undefined)
				return undefined;

			const magnet = await this.getMagnet(suffix);

			return {
				id: parseInt(id),
				leechers: parseInt(element.leech.text()),
				magnet: magnet,
				page: page,
				seeders: parseInt(element.seed.text()),
				size: Math.round(size),
				title: element.link.attr("title") || "",
				torrent: ""
			};
		}));

		return results.filter(notEmpty);
	}

	private async getMagnet(suffix: string): Promise<string> {
		const extract = (buffer: Buffer) => selectWithCheerio(buffer, ".download", {
			magnet: ".btn-magnet a"
		});

		const elements = await get(`${base}/torrents/${suffix}`, extract, [])

		if (elements.length < 1) {
			return "";
		}

		return elements[0].magnet.attr("href") || "";
	}
}