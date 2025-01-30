export type MASTERY_VALUES = 'unsure' | 'familiar' | 'mastered' | 'unrated'

export type Flashcard = {
    flashcardId: number,
    deckId: number, 
    front: string, 
    back: string,
    mastery: MASTERY_VALUES
}