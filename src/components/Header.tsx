import { DiceIcon } from "src/Icons";

type Props = {
	onShuffle: () => void;
};

export const Header = ({ onShuffle }: Props) => (
	<div className="bases-list-group-header">
		<button onClick={onShuffle}>
			<DiceIcon />
			<span>Shuffle</span>
		</button>
	</div>
);
