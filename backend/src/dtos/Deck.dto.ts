export type Decks = {
    deck_id: number,
    title: string, 
    description: string,
    created_at?: string; // timestamp, can be string in ISO format
}