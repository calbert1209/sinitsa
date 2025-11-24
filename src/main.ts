import { Plugin } from "obsidian";
import { RandomSampleView, RandomSampleViewType } from "./RandomSampleView";
import { viewOptions } from "./ViewOption";

type SinitsaPluginSettings = {
	seed: number;
};

const DEFAULT_SETTINGS: SinitsaPluginSettings = {
	seed: 1977,
};

export interface SettingsStore {
	settings: SinitsaPluginSettings;
	loadSettings(): Promise<void>;
	saveSettings(): Promise<void>;
}

export default class SinitsaPlugin extends Plugin implements SettingsStore {
	settings: SinitsaPluginSettings;

	async onload() {
		await this.loadSettings();
		this.registerBasesView(RandomSampleViewType, {
			name: "Random Sample",
			icon: "lucide-dices",
			factory: (controller, parentEl) =>
				new RandomSampleView(controller, parentEl, this),
			options: () => [...viewOptions],
		});
	}

	async loadSettings() {
		const storedSettings = await this.loadData();
		this.settings = {
			...DEFAULT_SETTINGS,
			...storedSettings,
		};
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
