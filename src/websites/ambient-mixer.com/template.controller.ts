import { Controller, Get, Query, Route } from "tsoa";
import { Template } from "./template";
import { TemplateService } from "./template.service";

@Route("templates")
export class TemplateController extends Controller {
	private readonly service = new TemplateService();

	@Get()
	public async getMostRated(
		@Query() offset?: number,
		@Query() count?: number
	): Promise<Template[]> {
		return this.service.getMostRated(offset || 0, count || 10);
	}
}