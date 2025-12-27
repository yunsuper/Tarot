export interface TarotReading {
  id: string;
  question: string;
  cards: string;
  result: string;
  card_ids: string | null;
  createdAt: string;
  userId?: string;
}
