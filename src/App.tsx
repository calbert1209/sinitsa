import { TFile } from "obsidian";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
	DiceIcon,
} from "./Icons";
import { Item, itemsSignal } from "./store";
import { JSXInternal } from "preact/src/jsx";

type AppProps = {
	onChangeScore: (i: number, file: TFile, d: number) => Promise<void>;
	onClickItem: (event: MouseEvent, filePath: string) => void;
	onShuffle: () => void;
};

export const App = ({ onChangeScore, onClickItem, onShuffle }: AppProps) => {
	return (
		<div>
			<div className="bases-list-group-header">
				<button onClick={onShuffle}>
					<DiceIcon />
					<span>Shuffle</span>
				</button>
			</div>
			{itemsSignal.value.map((item, index) => (
				<div key={item.file.path} className="custom_view_card">
					<div className="bases-list-entry-body">
						<ChevronLeftIcon />
						<div
							className="base-list-entry-text"
							onClick={(event) =>
								onClickItem(event, item.file.path)
							}
						>
							<div className="base-list-entry-text-inner">
								{item.text}
							</div>
						</div>
						<ChevronRightIcon />
					</div>
					<ScoreControl
						item={item}
						index={index}
						onChangeScore={onChangeScore}
					/>
				</div>
			))}
		</div>
	);
};

//
type ScoreControlProps = {
	item: Item;
	index: number;
	onChangeScore: (i: number, file: TFile, d: number) => Promise<void>;
};

const ScoreControl = ({
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
