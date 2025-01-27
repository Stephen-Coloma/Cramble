import { Deck } from "./Deck.dto";

export type DeckWithStatsDTO = Deck & {
    totalCards: number;
    unsureTotal: number;
    familiarTotal: number;
    masteredTotal: number;
    unratedTotal: number;
};