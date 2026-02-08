import {
	BasesEntry,
	BasesView,
	HoverParent,
	HoverPopover,
	Keymap,
	QueryController,
	TFile,
} from "obsidian";
import { SettingsStore } from "src/main";
import { getViewOptionValue } from "src/ViewOption";
import { createElement, render } from "preact";
import { App } from "src/App";
import { Item, itemsSignal } from "src/store";
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

	private onClickItem = (event: MouseEvent, filePath: string) => {
		const modEvent = Keymap.isModEvent(event);
		this.app.workspace.openLinkText(filePath, "", modEvent);
	};

	private onShuffle = () => {
		this.settingsStore.settings.seed = Date.now();
		// Intentionally firing and forgetting.
		this.settingsStore.saveSettings().catch(console.error);
		void this.onDataUpdated();
	};

	public onload(): void {
		console.log("loading", this.data);
		const onChangeScore: typeof this.onChangeScore = (...args) =>
			this.onChangeScore(...args);

		const onClickItem: typeof this.onClickItem = (...args) =>
			this.onClickItem(...args);

		const onShuffle = () => this.onShuffle();
		render(
			createElement(App, { onChangeScore, onClickItem, onShuffle }),
			this.containerEl
		);
	}

	public async onDataUpdated(): Promise<void> {
		const { hint1, hint2, hint3, count } = getViewOptionValue(this.config);
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
				const [safeHint1, safeHint2, safeHint3] = [hint1, hint2, hint3].map((hint) => {
					const hintValue = hint ? entry.getValue(hint)?.toString() : undefined;
					if (hintValue?.startsWith("images/")) {
						const image = this.app.vault.getFileByPath(hintValue);
						return image ? this.app.vault.getResourcePath(image) : hintValue
					}
					return hintValue && hintValue !== "null" ? hintValue : undefined;
				});

				const score = await this.getScore(entry.file);

				items.push({
					hint1: safeHint1,
					hint2: safeHint2,
					hint3: safeHint3,
					score,
					file: entry.file,
				});
			}

			itemsSignal.value = items;
		}
	}
}
