import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
} from "./Icons";
import { itemsSignal } from "./store";

export const App = () => {
	return (
		<div>
			{itemsSignal.value.map((item) => (
				<div className="custom_view_card">
					<div className="bases-list-entry-body">{item.text}</div>
					<div className="base-list-entry-footer">
						<button className="base-list-score-adjust-button">
							<ChevronsLeftIcon />
						</button>
						<button className="base-list-score-adjust-button">
							<ChevronLeftIcon />
						</button>
						<div className="base-list-entry-score">
							{item.score}
						</div>
						<button className="base-list-score-adjust-button">
							<ChevronRightIcon />
						</button>
						<button className="base-list-score-adjust-button">
							<ChevronsRightIcon />
						</button>
					</div>
				</div>
			))}
		</div>
	);
};
