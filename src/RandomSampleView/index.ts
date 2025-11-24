import {
	BasesView,
	HoverParent,
	HoverPopover,
	Keymap,
	QueryController,
	setIcon,
} from "obsidian";
import { SettingsStore } from "src/main";
import { generateIndices } from "src/randomIndices";
import { getViewOptionValue } from "src/ViewOption";

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

	public onDataUpdated(): void {
		const { app } = this;
		this.containerEl.empty();

		const { shownProperty, count } = getViewOptionValue(this.config);

		for (const group of this.data.groupedData) {
			const groupEl = this.containerEl.createDiv("bases-list-group");

			Header({
				parent: groupEl,
				onShuffle: () => {
					this.settingsStore.settings.seed = Date.now();
					// Intentionally firing and forgetting.
					this.settingsStore.saveSettings().catch(console.error);
					this.onDataUpdated();
				},
			});

			const groupListEl = groupEl.createEl("ul", {
				cls: "bases-list-group-list no-decoration",
			});

			const pickedEntries: typeof group.entries = [];
			const indices = generateIndices(
				this.settingsStore.settings.seed,
				Math.min(count, group.entries.length),
				group.entries.length
			);
			for (const index of indices) {
				pickedEntries.push(group.entries[index]);
			}

			for (const entry of pickedEntries) {
				const text = (
					entry.getValue(shownProperty) ?? "..."
				).toString();

				Card({
					parent: groupListEl,
					text,
					onClick: (event) => {
						const path = entry.file.path;
						const modEvent = Keymap.isModEvent(event);
						void app.workspace.openLinkText(path, "", modEvent);
					},
					onMouseOver: (event, targetEl) => {
						app.workspace.trigger("hover-link", {
							event,
							source: "bases",
							hoverParent: this,
							targetEl,
							linktext: entry.file.path,
						});
					},
				});
			}
		}
	}
}

const Card = ({
	parent,
	text,
	onClick,
	onMouseOver,
}: {
	parent: HTMLElement;
	text: string;
	// eslint-disable-next-line no-unused-vars
	onClick: (event: MouseEvent) => void;
	// eslint-disable-next-line no-unused-vars
	onMouseOver: (event: MouseEvent, target: HTMLElement) => void;
}) => {
	const listItemEl = parent.createEl("li", "bases-list-entry");
	const linkEl = listItemEl.createEl("div", {
		text,
		cls: "custom_view_card",
	});
	linkEl.onClickEvent((event) => {
		if (event.button !== 0 && event.button !== 1) return;

		event.preventDefault();
		onClick(event);
	});
	linkEl.addEventListener("mouseover", (event) => onMouseOver(event, linkEl));

	return linkEl;
};

const Header = ({
	parent,
	onShuffle,
}: {
	parent: HTMLDivElement;
	onShuffle: () => void;
}) => {
	const headerEl = parent.createDiv("bases-list-group-header");
	const shuffleButton = headerEl.createEl("button", {
		cls: "bases-list-group-header-button",
	});
	const buttonIcon = shuffleButton.createSpan();
	setIcon(buttonIcon, "lucide-dices");
	shuffleButton.createSpan({
		text: " Shuffle",
	});
	shuffleButton.onclick = onShuffle;

	return headerEl;
};
