/**
 * Random track occurrence parameters.
 */
export interface Random {
	/**
	 * Number of occurrences per time window.
	 */
	counter: number;

	/**
	 * Time window in milliseconds.
	 */
	period: number;
}

/**
 * Track data.
 */
export interface Track {
	balance: number;
	crossfade: boolean;
	id: number;
	mute: boolean;
	name: string;
	random?: Random;
	url: string;
	volume: number;
}