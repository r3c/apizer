import { Controller, Get, Query, Route } from "tsoa";
import { Template } from "./template";
import { TemplateService } from "./template.service";

@Route(`api/ambient-mixer.com/v1/templates`)
export class TemplateController extends Controller {
	private readonly service = new TemplateService();

	@Get("most-rated")
	public async getMostRated(
		@Query() offset?: number,
		@Query() count?: number
	): Promise<Template[]> {
		return this.service.getMostRated(offset || 0, count || 10);
	}

	@Get("most-recent")
	public async getMostRecent(
		@Query() offset?: number,
		@Query() count?: number
	): Promise<Template[]> {
		return this.service.getMostRecent(offset || 0, count || 10);
	}
}