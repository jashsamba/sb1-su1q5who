import React from 'react';
import { Heart } from 'lucide-react';
import type { Game } from '../types';
import { useStore } from '../store/useStore';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const { preferences, toggleFavoriteGame } = useStore();
  const isFavorite = preferences.favoriteGames.includes(game.id);

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-110 hover:z-10 retro-border pixel-corners group">
      <div className="relative overflow-hidden">
        <img
          src={game.imageUrl}
          alt={game.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-100 font-pixel animate-pulse-slow">{game.title}</h3>
          <button
            onClick={() => toggleFavoriteGame(game.id)}
            className="p-2 hover:bg-violet-700/50 rounded-full transition-all duration-300 hover:scale-125"
          >
            <Heart
              className={`w-6 h-6 transition-colors duration-300 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`}
            />
          </button>
        </div>
        <p className="mt-2 text-gray-300 line-clamp-2">{game.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold text-violet-400 text-glow animate-float">
            ${game.price.toFixed(2)}
          </span>
          <a
            href={game.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-violet-600 text-white rounded-lg transition-all duration-300 hover:bg-violet-700 hover:scale-110 hover:shadow-lg hover:shadow-violet-500/50"
          >
            View in Store
          </a>
        </div>
      </div>
    </div>
  );
}