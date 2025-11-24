import {
	BasesView,
	HoverParent,
	HoverPopover,
	Keymap,
	QueryController,
	setIcon,
} from "obsidian";
import { generateIndices } from "src/randomIndices";
import { getViewOptionValue } from "src/ViewOption";

export const RandomSampleViewType = "random-sample-view";

export class RandomSampleView extends BasesView implements HoverParent {
	readonly type = RandomSampleViewType;
	private containerEl: HTMLElement;
	hoverPopover: HoverPopover | null;
	private shuffleSeed: number;

	constructor(controller: QueryController, parentEl: HTMLElement) {
		super(controller);
		this.containerEl = parentEl.createDiv("bases-example-view-container");
		this.shuffleSeed = Date.now();
	}

	public async onDataUpdated(): Promise<void> {
		const { app } = this;
		this.containerEl.empty();

		const { shownProperty, count } = getViewOptionValue(this.config);

		for (const group of this.data.groupedData) {
			const groupEl = this.containerEl.createDiv("bases-list-group");

			const shuffleButton = groupEl.createEl("button", {
				cls: "bases-list-group-header-button",
			});
			const buttonIcon = shuffleButton.createSpan();
			setIcon(buttonIcon, "lucide-dices");
			shuffleButton.createSpan({
				text: " Shuffle",
			});
			shuffleButton.onclick = async () => {
				this.shuffleSeed = Date.now();
				await this.onDataUpdated();
			};

			const groupListEl = groupEl.createEl("ul", {
				cls: "bases-list-group-list no-decoration",
			});

			const pickedEntries: typeof group.entries = [];
			const indices = await generateIndices(
				this.shuffleSeed,
				Math.min(count, group.entries.length),
				group.entries.length
			);
			for (const index of indices) {
				pickedEntries.push(group.entries[index]);
			}

			for (const entry of pickedEntries) {
				groupListEl.createEl("li", "bases-list-entry", (el) => {
					el.addClass("no-decoration");

					const text = (
						entry.getValue(shownProperty) ?? "..."
					).toString();
					const linkEl = el.createEl("div", {
						text,
						cls: "custom_view_card",
					});
					linkEl.onClickEvent((event) => {
						if (event.button !== 0 && event.button !== 1) return;

						event.preventDefault();
						const path = entry.file.path;
						const modEvent = Keymap.isModEvent(event);
						void app.workspace.openLinkText(path, "", modEvent);
					});
					linkEl.addEventListener("mouseover", (event) => {
						app.workspace.trigger("hover-link", {
							event,
							source: "bases",
							hoverParent: this,
							targetEl: linkEl,
							linktext: entry.file.path,
						});
					});
				});
			}
		}
	}
}
