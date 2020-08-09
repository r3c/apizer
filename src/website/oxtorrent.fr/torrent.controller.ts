import { Controller, Get, Route, Tags } from "tsoa";
import { Match } from "./torrent";
import { TorrentService } from "./torrent.service";

@Route(`api/oxtorrent.fr/v1/torrents`)
@Tags("oxtorrent.fr")
export class TorrentController extends Controller {
	private readonly service = new TorrentService();

	@Get("by-keywords/{keywords}")
	public async searchByKeywords(keywords: string): Promise<Match[]> {
		return this.service.searchByKeywords(keywords);
	}
}