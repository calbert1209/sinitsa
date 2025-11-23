/**
 * Generates an hourly seed string from a date by resetting minutes, seconds, and milliseconds to zero.
 * @param date - The date to generate the seed from. Defaults to the current date and time.
 * @returns An ISO 8601 formatted string representing the date rounded down to the hour.
 */
const getHourlySeed = (date = new Date()): string => {
	date.setMinutes(0, 0, 0);
	return date.toISOString();
};

/**
 * Generates a quarter-hourly seed string from a date by rounding down to the nearest 15-minute interval.
 * @param date - The date to generate the seed from. Defaults to the current date and time.
 * @returns An ISO 8601 formatted string representing the date rounded down to the nearest quarter hour (0, 15, 30, or 45 minutes).
 */
const getQuarterHourlySeed = (date = new Date()): string => {
	const minutes = date.getMinutes();
	const quarterHour = Math.floor(minutes / 15) * 15;
	date.setMinutes(quarterHour, 0, 0);
	return date.toISOString();
};

/**
 * Generates a seed string from a date with full precision (down to milliseconds).
 * @param date - The date to generate the seed from. Defaults to the current date and time.
 * @returns An ISO 8601 formatted string representing the exact date and time.
 */
const getNewSeed = (date = new Date()): string => {
	return date.toISOString();
};

export type SeedUpdateFrequency =
	| "hourly"
	| "quarterHourly"
	| "ephemeral"
	| "constant";

export const getSeed = (
	frequency: SeedUpdateFrequency,
	date = new Date()
): string => {
	switch (frequency) {
		case "hourly": {
			return getHourlySeed(date);
		}
		case "quarterHourly": {
			return getQuarterHourlySeed(date);
		}
		case "ephemeral": {
			return getNewSeed(date);
		}
		default: {
			return "1977-12-09T12:00:000Z";
		}
	}
};
