// cspell:ignore Keymap, linktext
import {
	BasesPropertyId,
	BasesView,
	HoverParent,
	HoverPopover,
	Keymap,
	Plugin,
	QueryController,
} from "obsidian";
import { generateIndices } from "./randomIndices";

export default class MyPlugin extends Plugin {
	async onload() {
		this.registerBasesView(ExampleViewType, {
			name: "Random Sample",
			icon: "lucide-dices",
			factory: (controller, parentEl) =>
				new MyBasesView(controller, parentEl),
			options: () => [
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
					type: "property",
					displayName: "Property To Show",
					key: "shownProperty",
					default: "file.basename",
					allowMultiple: false,
				},
			],
		});
	}
}

export const ExampleViewType = "example-view";

export class MyBasesView extends BasesView implements HoverParent {
	readonly type = ExampleViewType;
	private containerEl: HTMLElement;
	hoverPopover: HoverPopover | null;

	constructor(controller: QueryController, parentEl: HTMLElement) {
		super(controller);
		this.containerEl = parentEl.createDiv("bases-example-view-container");
	}

	public async onDataUpdated(): Promise<void> {
		const { app } = this;
		this.containerEl.empty();

		const count = Number(this.config.get("count") ?? 5);
		const shownProperty = (
			this.config.get("shownProperty") ?? "file.basename"
		).toString() as BasesPropertyId;

		for (const group of this.data.groupedData) {
			const groupEl = this.containerEl.createDiv("bases-list-group");
			const groupListEl = groupEl.createEl("ul", {
				cls: "bases-list-group-list no-decoration",
			});

			const pickedEntries: typeof group.entries = [];
			const date = new Date();
			date.setMinutes(0, 0, 0);
			const indices = await generateIndices(
				date.toISOString(),
				count,
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
