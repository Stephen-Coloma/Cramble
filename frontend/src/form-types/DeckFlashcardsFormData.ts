export type DeckFlashcardsFormData = {
  title: string;
  description: string;
  createdAt: string;
  flashcards: {
    front: string;
    back: string;
  }[];
};
