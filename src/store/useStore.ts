import { create } from 'zustand';
import type { Mood, UserPreferences, NewsItem } from '../types';

interface Store {
  preferences: UserPreferences;
  news: {
    items: NewsItem[];
    isLoading: boolean;
    error: string | null;
  };
  setMood: (mood: Mood) => void;
  toggleFavoriteGame: (gameId: string) => void;
  setNews: (news: NewsItem[]) => void;
  setNewsLoading: (isLoading: boolean) => void;
  setNewsError: (error: string | null) => void;
}

export const useStore = create<Store>((set) => ({
  preferences: {
    selectedMood: null,
    favoriteGames: [],
  },
  news: {
    items: [],
    isLoading: false,
    error: null,
  },
  setMood: (mood) =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        selectedMood: mood,
      },
    })),
  toggleFavoriteGame: (gameId) =>
    set((state) => {
      const favorites = state.preferences.favoriteGames;
      const newFavorites = favorites.includes(gameId)
        ? favorites.filter((id) => id !== gameId)
        : [...favorites, gameId];

      return {
        preferences: {
          ...state.preferences,
          favoriteGames: newFavorites,
        },
      };
    }),
  setNews: (news) =>
    set((state) => ({
      news: {
        ...state.news,
        items: news,
      },
    })),
  setNewsLoading: (isLoading) =>
    set((state) => ({
      news: {
        ...state.news,
        isLoading,
      },
    })),
  setNewsError: (error) =>
    set((state) => ({
      news: {
        ...state.news,
        error,
      },
    })),
}));