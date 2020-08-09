import { Controller, Get, Route, Tags } from "tsoa";
import { Match } from "../oxtorrent.fr/torrent";
import { TorrentService } from "./torrent.service";

@Route(`api/limetorrents.info/v1/torrents`)
@Tags("limetorrents.info")
export class LimeTorrentsTorrentController extends Controller {
	private readonly service = new TorrentService();

	@Get("by-keywords/{keywords}")
	public async searchByKeywords(keywords: string): Promise<Match[]> {
		return this.service.searchByKeywords(keywords);
	}
}