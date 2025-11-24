import { Plugin } from "obsidian";
import { RandomSampleView, RandomSampleViewType } from "./RandomSampleView";

export default class SinitsaPlugin extends Plugin {
	async onload() {
		this.registerBasesView(RandomSampleViewType, {
			name: "Random Sample",
			icon: "lucide-dices",
			factory: (controller, parentEl) =>
				new RandomSampleView(controller, parentEl),
			options: () => [
				{
					type: "property",
					displayName: "Property To Show",
					key: "shownProperty",
					default: "file.basename",
					allowMultiple: false,
				},
				{
					type: "slider",
					displayName: "Count",
					key: "count",
					default: 5,
					min: 1,
					max: 20,
					step: 1,
				},
				{
					type: "dropdown",
					displayName: "Update Frequency",
					key: "updateFrequency",
					default: "hourly",
					options: {
						hourly: "Hourly",
						quarterHourly: "Every 15 min.",
						ephemeral: "Immediately",
						constant: "Never",
					},
				},
			],
		});
	}
}
