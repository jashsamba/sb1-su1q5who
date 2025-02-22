export type Mood = 'relaxed' | 'competitive' | 'story-driven' | 'social' | 'casual';

export interface Game {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  moods: Mood[];
  storeUrl: string;
  rating: number;
  price: number;
}

export interface UserPreferences {
  selectedMood: Mood | null;
  favoriteGames: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  category: string;
  timestamp: string;
  aiSummary?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  confidence: number;
}