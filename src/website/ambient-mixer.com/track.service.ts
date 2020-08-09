import { selectWithCheerio } from "../../query/selection";
import { get } from "../../query/submission";
import { Random, Track } from "./track";

export class TrackService {
	public async getTracks(templateId: number): Promise<Track[]> {
		const extract = (buffer: Buffer) => selectWithCheerio(buffer, "audio_template *", {
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

		const elements = await get(`https://xml.ambient-mixer.com/audio-template?id_template=${templateId}`, extract, []);
		const tracks = [];

		for (const element of elements) {
			const id = element.id.text();
			const url = element.url.text();

			if (id.length === 0 || url.length === 0) {
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
				id: parseInt(id),
				mute: element.mute.text() === "true",
				name: element.name.text(),
				random: random,
				url: url,
				volume: parseInt(element.volume.text())
			});
		}

		return tracks;
	}
}