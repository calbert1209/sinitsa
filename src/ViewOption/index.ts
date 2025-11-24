import { BasesPropertyId, BasesViewConfig, ViewOption } from "obsidian";

type ViewOptionKey = "shownProperty" | "count";

type SinitsaViewOptions = {
	shownProperty: BasesPropertyId;
	count: number;
};

const viewOption: Record<ViewOptionKey, ViewOptionKey> = {
	shownProperty: "shownProperty",
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
		displayName: "Property To Show",
		key: viewOption.shownProperty,
		default: "file.basename",
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
		shownProperty: (config.get(viewOption.shownProperty) ??
			"file.basename") as BasesPropertyId,
		count: parseInt((config.get(viewOption.count) as string) ?? "10", 10),
	};
};
