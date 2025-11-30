import {
	App,
	BasesEntry,
	BasesEntryGroup,
	BasesPropertyId,
	Keymap,
	setIcon,
} from "obsidian";
import { SettingsStore } from "src/main";
import { generateIndices } from "src/randomIndices";

export const Header = ({
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

export const Card = ({
	parent,
	text,
	score,
	onClick,
	onMouseOver,
	onScoreChange,
}: {
	parent: HTMLElement;
	text: string;
	score: number;
	// eslint-disable-next-line no-unused-vars
	onClick: (event: MouseEvent) => void;
	// eslint-disable-next-line no-unused-vars
	onMouseOver: (event: MouseEvent, target: HTMLElement) => void;
	// eslint-disable-next-line no-unused-vars
	onScoreChange: (scoreChange: number) => void;
}) => {
	const listItemEl = parent.createEl("li", "bases-list-entry");
	const listItemCard = listItemEl.createEl("div", {
		cls: "custom_view_card",
	});
	const linkEl = listItemCard.createEl("div", {
		text,
		cls: "bases-list-entry-body",
	});
	linkEl.onClickEvent((event) => {
		if (event.button !== 0 && event.button !== 1) return;

		event.preventDefault();
		onClick(event);
	});
	linkEl.addEventListener("mouseover", (event) => onMouseOver(event, linkEl));

	const listItemCardFooter = listItemCard.createEl("div", {
		cls: "base-list-entry-footer",
	});

	ScorePanel({
		parent: listItemCardFooter,
		score,
		onScoreChange,
	});

	return listItemEl;
};

const ScoreAdjustButton = ({
	parent,
	iconName,
	onScoreChange,
}: {
	parent: HTMLElement;
	iconName: string;
	onScoreChange: () => void;
}) => {
	const buttonEl = parent.createEl("button", {
		cls: "base-list-score-adjust-button",
	});
	const buttonSpan = buttonEl.createSpan();
	setIcon(buttonSpan, iconName);
	buttonEl.onClickEvent((event) => {
		event.preventDefault();
		event.stopPropagation();
		onScoreChange();
	});
};

const ScorePanel = ({
	parent,
	score,
	onScoreChange,
}: {
	parent: HTMLElement;
	score: number;
	// eslint-disable-next-line no-unused-vars
	onScoreChange: (scoreChange: number) => void;
}) => {
	[
		{ icon: "chevrons-left", change: -5 },
		{ icon: "chevron-left", change: -1 },
	].forEach(({ icon, change }) => {
		ScoreAdjustButton({
			parent,
			iconName: icon,
			onScoreChange: () => onScoreChange(change),
		});
	});

	parent.createDiv(
		{
			cls: "base-list-entry-score",
		},
		(el) => el.createSpan({ text: score.toString() })
	);

	[
		{ icon: "chevron-right", change: 1 },
		{ icon: "chevrons-right", change: 5 },
	].forEach(({ icon, change }) => {
		ScoreAdjustButton({
			parent,
			iconName: icon,
			onScoreChange: () => onScoreChange(change),
		});
	});
};

export const Group = async ({
	parent,
	app,
	group,
	settingsStore,
	shownProperty,
	count,
	onDataUpdated,
}: {
	parent: HTMLElement;
	app: App;
	group: BasesEntryGroup;
	settingsStore: SettingsStore;
	onDataUpdated: () => Promise<void>;
	shownProperty: BasesPropertyId;
	count: number;
}) => {
	const groupEl = parent.createDiv("bases-list-group");

	Header({
		parent: groupEl,
		onShuffle: () => {
			settingsStore.settings.seed = Date.now();
			// Intentionally firing and forgetting.
			settingsStore.saveSettings().catch(console.error);
			onDataUpdated();
		},
	});

	const groupListEl = groupEl.createEl("ul", {
		cls: "bases-list-group-list no-decoration",
	});

	const pickedEntries: BasesEntry[] = [];
	const indices = generateIndices(
		settingsStore.settings.seed,
		Math.min(count, group.entries.length),
		group.entries.length
	);
	for (const index of indices) {
		pickedEntries.push(group.entries[index]);
	}

	for (const entry of pickedEntries) {
		const text = (entry.getValue(shownProperty) ?? "...").toString();

		let score = 0;
		await app.fileManager.processFrontMatter(
			entry.file,
			(fm) => (score = fm.score)
		);

		Card({
			parent: groupListEl,
			text,
			score,
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
			onScoreChange: async (scoreChange) => {
				await app.fileManager.processFrontMatter(entry.file, (fm) => {
					const nextScore = (fm.score ?? 0) + scoreChange;
					fm.score = Math.min(Math.max(0, nextScore), 100);
					score = fm.score;
				});
			},
		});
	}
};
