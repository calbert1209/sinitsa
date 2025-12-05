import { BasesPropertyId, BasesViewConfig, ViewOption } from "obsidian";

type ViewOptionKey = "hint1" | "hint2" | "count";

type SinitsaViewOptions = {
	hint1: BasesPropertyId;
	hint2: BasesPropertyId | undefined;
	count: number;
};

const viewOption: Record<ViewOptionKey, ViewOptionKey> = {
	hint1: "hint1",
	hint2: "hint2",
	count: "count",
};

/**
 * Configuration options for the random sample view component.
 *
 * Defines the available view options including:
 * - A property selector to determine which property to display
 * - A count slider to control the number of random samples (1-20)
 *
 * @remarks
 * The update frequency options range from immediate updates (ephemeral) to manual updates (constant).
 *
 * @see {@link ViewOption} for the structure of individual view options
 */
export const viewOptions: ViewOption[] = [
	{
		type: "property",
		displayName: "Hint 1",
		key: viewOption.hint1,
		default: "file.basename",
	},
	{
		type: "property",
		displayName: "Hint 2",
		key: viewOption.hint2,
	},
	{
		type: "slider",
		displayName: "Count",
		key: viewOption.count,
		default: 5,
		min: 1,
		max: 20,
		step: 1,
	},
];

export const getViewOptionValue = (
	config: BasesViewConfig
): SinitsaViewOptions => {
	return {
		hint1: (config.get(viewOption.hint1) ??
			"file.basename") as BasesPropertyId,
		hint2: (config.get(viewOption.hint2) as BasesPropertyId) ?? undefined,
		count: parseInt((config.get(viewOption.count) as string) ?? "10", 10),
	};
};
