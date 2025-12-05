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
import { useCallback, useMemo, useState } from "preact/hooks";

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
					<Carousel item={item} onClickItem={onClickItem} />
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

type CarouselProps = {
	item: Item;
	onClickItem: (event: MouseEvent, filePath: string) => void;
};

const Carousel = ({
	item,
	onClickItem,
}: CarouselProps): JSXInternal.Element => {
	const [index, setIndex] = useState(0);
	const slideCount = item.hint2 ? 2 : 1;
	const slides = useMemo(
		() =>
			[item.hint1, item.hint2].filter(
				(v): v is string => v !== undefined
			),
		[item]
	);

	const shiftIndex = useCallback((d: number) => {
		setIndex((index) => (index + slideCount + d) % slideCount);
	}, []);
	return (
		<div className="bases-list-entry-body" onClick={() => shiftIndex(-1)}>
			<ChevronLeftIcon />
			<div
				className="base-list-entry-text"
				onClick={(event) => onClickItem(event, item.file.path)}
			>
				<div
					className="base-list-entry-text-inner"
					onClick={() => shiftIndex(1)}
				>
					{slides[index]}
				</div>
			</div>
			<ChevronRightIcon />
		</div>
	);
};

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
