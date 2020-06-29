import { Controller, Get, Route, Tags } from "tsoa";
import { Track } from "./track";
import { TrackService } from "./track.service";

@Route(`api/ambient-mixer.com/v1/tracks`)
@Tags("ambient-mixer.com")
export class TrackController extends Controller {
	private readonly service = new TrackService();

	@Get("template/{templateId}")
	public async getTracks(templateId: number): Promise<Track[]> {
		return this.service.getTracks(templateId);
	}
}