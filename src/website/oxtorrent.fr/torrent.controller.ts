import express from "express";
import { Controller, Get, Request, Route, Tags } from "tsoa";
import { Entry, createSynologyPlugin } from "../../domain/torrent";
import { TorrentService } from "./torrent.service";

@Route("api/oxtorrent.fr/v1/torrents")
@Tags("oxtorrent.fr")
export class OxTorrentTorrentController extends Controller {
	private readonly service = new TorrentService();

	@Get("by-keywords/{keywords}")
	public searchByKeywords(keywords: string): Promise<Entry[]> {
		return this.service.searchByKeywords(keywords);
	}

	@Get("plugins/synology")
	public downloadPluginSynology(@Request() request: express.Request): Promise<void> {
		return createSynologyPlugin("OxTorrent", "api/oxtorrent.fr/v1/torrents/by-keywords/", request.res!);
	}
}