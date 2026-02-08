import { TFile } from "obsidian";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
} from "../Icons";
import { JSXInternal } from "preact/src/jsx";
import { Item } from "../store";

type ScoreControlProps = {
	item: Item;
	index: number;
	onChangeScore: (i: number, file: TFile, d: number) => Promise<void>;
};

export const ScoreControl = ({
	item,
	index,
	onChangeScore,
}: ScoreControlProps): JSXInternal.Element => {
	return (
		<div className="base-list-entry-footer">
			<button
				className="base-list-score-adjust-button"
				onClick={() => onChangeScore(index, item.file, -5)}
			>
				<ChevronsLeftIcon />
			</button>
			<button
				className="base-list-score-adjust-button"
				onClick={() => onChangeScore(index, item.file, -1)}
			>
				<ChevronLeftIcon />
			</button>
			<div className="base-list-entry-score">{item.score}</div>
			<button
				className="base-list-score-adjust-button"
				onClick={() => onChangeScore(index, item.file, 1)}
			>
				<ChevronRightIcon />
			</button>
			<button
				className="base-list-score-adjust-button"
				onClick={() => onChangeScore(index, item.file, 5)}
			>
				<ChevronsRightIcon />
			</button>
		</div>
	);
};
