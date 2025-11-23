// cspell:ignore MINSTD
import { generateIndices } from "./randomIndices";

describe(`${generateIndices.name}`, () => {
	test("should return an array of numbers", async () => {
		const result = await generateIndices("test", 5, 10);
		expect(Array.isArray(result)).toBe(true);
		expect(result.every((n) => typeof n === "number")).toBe(true);
	});

	test("should return exact count of unique indices", async () => {
		const count = 5;
		const result = await generateIndices("test", count, 10);
		expect(result.length).toBe(count);
		const uniqueResult = [...new Set(result)];
		expect(uniqueResult.length).toBe(count);
	});

	test("should return indices within the limit range", async () => {
		const limit = 10;
		const result = await generateIndices("test", 5, limit);
		expect(result.every((n) => n >= 0 && n < limit)).toBe(true);
	});

	test("should return deterministic results for the same seed", async () => {
		const seed = "deterministic-seed";
		const result1 = await generateIndices(seed, 5, 10);
		const result2 = await generateIndices(seed, 5, 10);
		expect(result1).toEqual(result2);
	});

	test("should return different results for different seeds", async () => {
		const result1 = await generateIndices("seed1", 5, 10);
		const result2 = await generateIndices("seed2", 5, 10);
		expect(result1).not.toEqual(result2);
	});

	test("should throw error when count exceeds limit", async () => {
		await expect(generateIndices("test", 15, 10)).rejects.toThrow(
			"Count cannot be greater than the limit."
		);
	});

	test("should handle count equal to limit", async () => {
		const limit = 10;
		const result = await generateIndices("test", limit, limit);
		expect(result.length).toBe(limit);
		const uniqueResult = [...new Set(result)];
		expect(uniqueResult.length).toBe(limit);
	});

	test("should handle count of 0", async () => {
		const result = await generateIndices("test", 0, 10);
		expect(result.length).toBe(0);
	});

	test("should handle limit of 1", async () => {
		const result = await generateIndices("test", 1, 1);
		expect(result).toEqual([0]);
	});

	test("should handle large limits", async () => {
		const limit = 1000;
		const count = 100;
		const result = await generateIndices("test", count, limit);
		expect(result.length).toBe(count);
		expect(result.every((n) => n >= 0 && n < limit)).toBe(true);
	});

	test("should generate all possible indices when count equals limit", async () => {
		const limit = 5;
		const result = await generateIndices("test", limit, limit);
		const sorted = [...result].sort((a, b) => a - b);
		expect(sorted).toEqual([0, 1, 2, 3, 4]);
	});

	test("should handle different seed formats", async () => {
		const result1 = await generateIndices("simple", 5, 10);
		const result2 = await generateIndices("complex-seed-123!@#", 5, 10);
		const result3 = await generateIndices("", 5, 10);

		expect(result1.length).toBe(5);
		expect(result2.length).toBe(5);
		expect(result3.length).toBe(5);
		expect(result1).not.toEqual(result2);
	});

	test("should maintain consistent order for same seed", async () => {
		const seed = "order-test";
		const result1 = await generateIndices(seed, 5, 10);
		const result2 = await generateIndices(seed, 5, 10);

		// Not only should the sets be equal, but the order should be identical
		for (let i = 0; i < result1.length; i++) {
			expect(result1[i]).toBe(result2[i]);
		}
	});

	test("should use MINSTD pseudo-random generator correctly", async () => {
		// Test that the generator produces deterministic sequences
		const result1 = await generateIndices("prng-test", 10, 100);
		const result2 = await generateIndices("prng-test", 10, 100);

		expect(result1).toEqual(result2);
		expect(result1.length).toBe(10);
	});

	test("should handle very small limits", async () => {
		const result = await generateIndices("test", 2, 3);
		expect(result.length).toBe(2);
		expect(result.every((n) => n >= 0 && n < 3)).toBe(true);
	});
});
