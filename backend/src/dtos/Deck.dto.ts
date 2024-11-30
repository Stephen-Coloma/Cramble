export type Deck = {
    deckId?: number, //this is auto_increment, need to place this here for the get requests
    userId?: number,
    title: string, 
    description: string,
    createdAt?: string; // timestamp, can be string in ISO format
    status?: string
}