import { signal } from "@preact/signals";
import { TFile } from "obsidian";

export type Item = {
	hint1: string | undefined;
	hint2: string | undefined;
	hint3: string | undefined;
	score: number;
	file: TFile;
};

export const itemsSignal = signal<Item[]>([]);
