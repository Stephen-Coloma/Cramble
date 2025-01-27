export type Deck = {
    deckId: number, //this is auto_increment, need to place this here for the get requests
    userId: number,
    title: string, 
    description: string,
    createdAt: string; // date in ISO format
    status: string,
    editedAt: string //date in ISO format
}