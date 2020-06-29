import { paginate } from "../../query/pagination";
import { Template } from "./template";
import cheerio from "cheerio";
import fetch from "node-fetch";

const baseUrl = "https://www.ambient-mixer.com";

export class TemplateService {
	public async getMostRated(offset: number, count: number): Promise<Template[]> {
		return this.getTemplates("most-rated-audio", offset, count);
	}

	public async getMostRecent(offset: number, count: number): Promise<Template[]> {
		return this.getTemplates("most-recent-audio", offset, count);
	}

	private async getTemplates(path: string, offset: number, count: number): Promise<Template[]> {
		const templates = [];

		for (const page of paginate(51, offset, count)) {
			const html = await fetch(`${baseUrl}/${path}?page=${page.number}`);

			if (!html.ok)
				continue;

			const buffer = await html.buffer();
			const query = cheerio.load(buffer);
			const regex = new RegExp("[0-9]+$");

			for (const element of query("div[class^=select_dash_ambient]").slice(page.skip, page.skip + page.count).toArray()) {
				const id = regex.exec(query(".vote_now a", element).attr("href") || "");
				const title = query(".ambient_title a", element).text();

				if (id !== null && id.length > 0 && title) {
					templates.push({
						id: parseInt(id[0]),
						title: title
					});
				}
			}
		}

		return templates;
	}
}