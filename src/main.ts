import { Plugin } from "obsidian";
import { RandomSampleView, RandomSampleViewType } from "./RandomSampleView";
import { viewOptions } from "./ViewOption";

export default class SinitsaPlugin extends Plugin {
	async onload() {
		this.registerBasesView(RandomSampleViewType, {
			name: "Random Sample",
			icon: "lucide-dices",
			factory: (controller, parentEl) =>
				new RandomSampleView(controller, parentEl),
			options: () => [...viewOptions],
		});
	}
}
