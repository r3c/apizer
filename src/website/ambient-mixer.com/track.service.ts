import { selectWithCheerio } from "../../query/selection";
import { Random, Track } from "./track";
import fetch from "node-fetch";

export class TrackService {
	public async getTracks(templateId: number): Promise<Track[]> {
		const response = await fetch(`https://xml.ambient-mixer.com/audio-template?id_template=${templateId}`);

		if (!response.ok)
			return [];

		const buffer = await response.buffer();

		const elements = selectWithCheerio(buffer, "audio_template *", {
			balance: "balance",
			crossfade: "crossfade",
			id: "id_audio",
			mute: "mute",
			name: "name_audio",
			randomCounter: "random_counter",
			randomEnabled: "random",
			randomUnit: "random_unit",
			url: "url_audio",
			volume: "volume"
		});

		const tracks = [];

		for (const element of elements) {
			if (element.id.length === 0) {
				continue;
			}

			let random: Random | undefined;

			if (element.randomEnabled.text() === "true" && element.randomCounter.length !== 0 && element.randomUnit.length !== 0) {
				const randomCounterValue = parseInt(element.randomCounter.text());
				const randomUnit = element.randomUnit.text();
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
				balance: parseInt(element.balance.text()),
				crossfade: element.crossfade.text() === "true",
				id: parseInt(element.id.text()),
				mute: element.mute.text() === "true",
				name: element.name.text(),
				random: random,
				url: element.url.text(),
				volume: parseInt(element.volume.text())
			});
		}

		return tracks;
	}
}