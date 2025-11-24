import { BasesPropertyId, BasesViewConfig, ViewOption } from "obsidian";
import { SeedUpdateFrequency } from "../dateSeed";

type ViewOptionKey = "shownProperty" | "count" | "updateFrequency";

type SinitsaViewOptions = {
	shownProperty: BasesPropertyId;
	count: number;
	updateFrequency: SeedUpdateFrequency;
};

const viewOption: Record<ViewOptionKey, ViewOptionKey> = {
	shownProperty: "shownProperty",
	count: "count",
	updateFrequency: "updateFrequency",
};

/**
 * Configuration options for the random sample view component.
 *
 * Defines the available view options including:
 * - A property selector to determine which property to display
 * - A count slider to control the number of random samples (1-20)
 * - An update frequency dropdown to control how often samples refresh
 *
 * @remarks
 * The update frequency options range from immediate updates (ephemeral) to manual updates (constant).
 *
 * @see {@link ViewOption} for the structure of individual view options
 */
export const randomSampleViewOptions: ViewOption[] = [
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
	{
		type: "dropdown",
		displayName: "Update Frequency",
		key: viewOption.updateFrequency,
		default: "hourly",
		options: {
			hourly: "Hourly",
			quarterHourly: "Every 15 min.",
			ephemeral: "Immediately",
			constant: "Never",
		},
	},
];

export const getViewOptionValue = (
	config: BasesViewConfig
): SinitsaViewOptions => {
	return {
		shownProperty: (config.get(viewOption.shownProperty) ??
			"file.basename") as BasesPropertyId,
		count: parseInt((config.get(viewOption.count) as string) ?? "10", 10),
		updateFrequency: config.get(
			viewOption.updateFrequency
		) as SeedUpdateFrequency,
	};
};
