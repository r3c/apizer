import { Random, Track } from "./track";
import cheerio from "cheerio";
import fetch from "node-fetch";

export class TrackService {
	public async getTracks(templateId: number): Promise<Track[]> {
		const html = await fetch(`https://xml.ambient-mixer.com/audio-template?id_template=${templateId}`);

		if (!html.ok)
			return [];

		const buffer = await html.buffer();
		const query = cheerio.load(buffer);
		const tracks = [];

		for (const channel of query("audio_template *").toArray().filter(element => element.tagName.startsWith("channel"))) {
			const randomCounter = query("random_counter", channel).text();
			const randomEnabled = query("random", channel).text();
			const randomUnit = query("random_unit", channel).text();

			let random: Random | undefined;

			if (randomEnabled === "true" && randomCounter && randomUnit) {
				const randomCounterValue = parseInt(randomCounter);
				const randomUnitCharacter = randomUnit.slice(randomUnit.length - 1);
				const randomUnitValue = parseInt(randomUnit.slice(0, randomUnit.length - 1));

				switch (randomUnitCharacter) {
					case "h":
						random = { counter: randomCounterValue, period: randomUnitValue * 3600000 };

						break;

					case "m":
						random = { counter: randomCounterValue, period: randomUnitValue * 60000 };

						break;

					default:
						random = undefined;

						break;
				}
			}
			else {
				random = undefined;
			}

			tracks.push({
				balance: parseInt(query("balance", channel).text()),
				crossfade: query("crossfade", channel).text() === "true",
				id: parseInt(query("id_audio", channel).text()),
				mute: query("mute", channel).text() === "true",
				name: query("name_audio", channel).text(),
				random: random,
				url: query("url_audio", channel).text(),
				volume: parseInt(query("volume", channel).text())
			});
		}

		return tracks;
	}
}