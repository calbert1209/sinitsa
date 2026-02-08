import { ChevronLeftIcon, ChevronRightIcon } from "../Icons";
import { Item } from "../store";
import { JSXInternal } from "preact/src/jsx";
import { useCallback, useMemo, useState } from "preact/hooks";

type CarouselProps = {
	item: Item;
	onClickItem: (event: MouseEvent, filePath: string) => void;
};

export const Carousel = ({
	item,
	onClickItem,
}: CarouselProps): JSXInternal.Element => {
	const [index, setIndex] = useState(0);
	const slides = useMemo(
		() =>
			[item.hint1, item.hint2, item.hint3].filter(
				(v): v is string => v !== undefined,
			),
		[item],
	);

	const shiftIndex = useCallback(
		(d: number) => {
			setIndex((index) => (index + slides.length + d) % slides.length);
		},
		[slides],
	);

	const slide = slides[index];
	return (
		<div className="bases-list-entry-body">
			<button
				className="base-list-entry-body-button"
				onClick={() => shiftIndex(-1)}
			>
				<ChevronLeftIcon />
			</button>
			<div
				className="base-list-entry-text"
				onClick={(event) => onClickItem(event, item.file.path)}
			>
				{slide?.startsWith("app://") ? (
					<img
						src={slide}
						alt="Item Image"
						className="base-list-entry-image"
					/>
				) : (
					<div className="base-list-entry-text-inner">{slide}</div>
				)}
			</div>
			<button
				className="base-list-entry-body-button"
				onClick={() => shiftIndex(1)}
			>
				<ChevronRightIcon />
			</button>
		</div>
	);
};
