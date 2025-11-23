import { Plugin } from "obsidian";
import { ExampleViewType, MyBasesView } from "./MyBaseView";

export default class MyPlugin extends Plugin {
	async onload() {
		this.registerBasesView(ExampleViewType, {
			name: "Random Sample",
			icon: "lucide-dices",
			factory: (controller, parentEl) =>
				new MyBasesView(controller, parentEl),
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
					max: 10,
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
