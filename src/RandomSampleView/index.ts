import {
	BasesView,
	HoverParent,
	HoverPopover,
	QueryController,
} from "obsidian";
import { SettingsStore } from "src/main";
import { getViewOptionValue } from "src/ViewOption";
import { Group } from "./pseudo-components";

export const RandomSampleViewType = "random-sample-view";

export class RandomSampleView extends BasesView implements HoverParent {
	readonly type = RandomSampleViewType;
	private containerEl: HTMLElement;
	hoverPopover: HoverPopover | null;
	readonly settingsStore: SettingsStore;

	constructor(
		controller: QueryController,
		parentEl: HTMLElement,
		settingsStore: SettingsStore
	) {
		super(controller);
		this.containerEl = parentEl.createDiv("bases-example-view-container");
		this.settingsStore = settingsStore;
	}

	public async onDataUpdated(): Promise<void> {
		const { app } = this;
		this.containerEl.empty();

		const { shownProperty, count } = getViewOptionValue(this.config);

		for (const group of this.data.groupedData) {
			await Group({
				parent: this.containerEl,
				app,
				group,
				settingsStore: this.settingsStore,
				shownProperty,
				count,
				onDataUpdated: async () => {
					await this.onDataUpdated();
				},
			});
		}
	}
}
