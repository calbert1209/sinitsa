// FROM: https://javascript.info/task/pseudo-random-generator

const MULTIPLIER = 16807;
const MODULUS = 2147483647;

function* pseudoRandom(seed: number) {
	let value = seed;

	while (true) {
		value = (value * MULTIPLIER) % MODULUS;
		yield value;
	}
}

/**
 * Generates an array of unique, deterministic, seeded random indices.
 * * @param {number} seed - The seed to ensure the result is repeatable.
 * @param {number} count - The number of unique indices to generate.
 * @param {number} limit - The exclusive maximum value for the indices (i.e., array length).
 * @returns {Promise<number[]>} A promise that resolves to an array of unique indices.
 */
export function generateIndices(
	seed: number,
	count: number,
	limit: number
): number[] {
	if (count > limit) {
		throw new Error("Count cannot be greater than the limit.");
	}
	const indices = new Set<number>();

	for (const x of pseudoRandom(seed)) {
		if (indices.size >= count) {
			break;
		}

		const value = x % limit;
		if (!indices.has(value)) {
			indices.add(value);
		}
	}

	return Array.from(indices);
}
