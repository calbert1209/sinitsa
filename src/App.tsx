import type { TFile } from "obsidian";
import { itemsSignal } from "./store";
import { Carousel } from "./components/Carousel";
import { ScoreControl } from "./components/ScoreControl";
import { Header } from "./components/Header";

type AppProps = {
	onChangeScore: (i: number, file: TFile, d: number) => Promise<void>;
	onClickItem: (event: MouseEvent, filePath: string) => void;
	onShuffle: () => void;
};

export const App = ({ onChangeScore, onClickItem, onShuffle }: AppProps) => {
	return (
		<div className="bases-list-group">
			<Header onShuffle={onShuffle} />
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
