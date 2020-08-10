import express from "express";
import { Controller, Get, Request, Route, Tags } from "tsoa";
import { Entry, createSynologyPlugin } from "../../domain/torrent";
import { TorrentService } from "./torrent.service";

@Route("api/limetorrents.info/v1/torrents")
@Tags("limetorrents.info")
export class LimeTorrentsTorrentController extends Controller {
	private readonly service = new TorrentService();

	@Get("by-keywords/{keywords}")
	public searchByKeywords(keywords: string): Promise<Entry[]> {
		return this.service.searchByKeywords(keywords);
	}

	@Get("plugins/synology")
	public downloadPluginSynology(@Request() request: express.Request): Promise<void> {
		return createSynologyPlugin("LimeTorrents", "api/limetorrents.info/v1/torrents/by-keywords/", request.res!);
	}
}