import {
	BasesEntry,
	BasesView,
	HoverParent,
	HoverPopover,
	QueryController,
	TFile,
} from "obsidian";
import { SettingsStore } from "src/main";
import { getViewOptionValue } from "src/ViewOption";
import { createElement, render } from "preact";
import { App } from "src/App";
import { dataSignal, Item, itemsSignal } from "src/store";
import { generateIndices } from "src/randomIndices";

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

	private getScore = async (file: TFile): Promise<number> => {
		let score = 0;
		try {
			await this.app.fileManager.processFrontMatter(file, (fm) => {
				score = fm.score ?? 0;
			});
		} catch (error: unknown) {
			console.error(error);
		}
		return score;
	};

	private changeScore = async (
		file: TFile,
		delta: number
	): Promise<number> => {
		let score = 0;
		try {
			await this.app.fileManager.processFrontMatter(file, (fm) => {
				const nextScore = (fm.score ?? 0) + delta;
				score = Math.min(Math.max(0, nextScore), 100);
				fm.score = score;
			});
		} catch (error: unknown) {
			console.error(error);
		}
		return score;
	};

	private onChangeScore = async (index: number, file: TFile, d: number) => {
		const score = await this.changeScore(file, d);

		itemsSignal.value = itemsSignal.value.map((item, i) => {
			if (i === index) {
				return {
					...item,
					score,
				};
			}

			return item;
		});
	};

	public onload(): void {
		console.log("loading", this.data);
		const onChangeScore: typeof this.onChangeScore = (...args) =>
			this.onChangeScore(...args);
		render(createElement(App, { onChangeScore }), this.containerEl);
	}

	public async onDataUpdated(): Promise<void> {
		const { app } = this;
		const { shownProperty, count } = getViewOptionValue(this.config);
		dataSignal.value = `Updated at ${new Date().toISOString()}`;
		for (const group of this.data.groupedData) {
			const pickedEntries: BasesEntry[] = [];
			const indices = generateIndices(
				this.settingsStore.settings.seed,
				Math.min(count, group.entries.length),
				group.entries.length
			);
			for (const index of indices) {
				pickedEntries.push(group.entries[index]);
			}

			const items: Item[] = [];

			for (let i = 0; i < pickedEntries.length; i++) {
				const entry = pickedEntries[i];
				const text = (
					entry.getValue(shownProperty) ?? "..."
				).toString();

				let score = 0;
				await app.fileManager.processFrontMatter(
					entry.file,
					(fm) => (score = fm.score)
				);

				items.push({ text, score, file: entry.file });
			}

			itemsSignal.value = items;
		}
	}
}
