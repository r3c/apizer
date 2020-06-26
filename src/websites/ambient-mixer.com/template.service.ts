import { Template } from "./template";

export class TemplateService {
	public getMostRated(_offset: number, _count: number): Template[] {
		return [{
			id: 1,
			name: "Test"
		}];
	}
}