import { signal } from "@preact/signals";
import { TFile } from "obsidian";

export type Item = {
	text: string;
	score: number;
	file: TFile;
};

export const itemsSignal = signal<Item[]>([]);
