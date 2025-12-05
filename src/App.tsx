import { TFile } from "obsidian";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
} from "./Icons";
import { itemsSignal } from "./store";

type Props = {
	// eslint-disable-next-line no-unused-vars
	onChangeScore: (i: number, file: TFile, d: number) => Promise<void>;
};

export const App = ({ onChangeScore }: Props) => {
	return (
		<div>
			{itemsSignal.value.map((item, index) => (
				<div className="custom_view_card">
					<div className="bases-list-entry-body">{item.text}</div>
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
						<div className="base-list-entry-score">
							{item.score}
						</div>
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
				</div>
			))}
		</div>
	);
};
