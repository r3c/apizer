import { paginate } from "../../query/pagination";
import { selectWithCheerio } from "../../query/selection";
import { get } from "../../query/submission";
import { Template } from "./template";

export class TemplateService {
	public async getMostRated(offset: number, count: number): Promise<Template[]> {
		return this.getTemplates("most-rated-audio", offset, count);
	}

	public async getMostRecent(offset: number, count: number): Promise<Template[]> {
		return this.getTemplates("most-recent-audio", offset, count);
	}

	private async getTemplates(path: string, offset: number, count: number): Promise<Template[]> {
		const templates = [];
		const extract = (buffer: Buffer) => selectWithCheerio(buffer, "div[class^=select_dash_ambient]", {
			id: ".vote_now a",
			title: ".ambient_title a"
		});

		for (const page of paginate(51, offset, count)) {
			const elements = await get(`https://www.ambient-mixer.com/${path}?page=${page.number}`, extract, []);
			const regex = new RegExp("[0-9]+$");

			for (const element of elements.slice(page.skip, page.skip + page.count)) {
				const id = regex.exec(element.id.attr("href") || "");
				const title = element.title.text();

				if (id !== null && title !== "") {
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