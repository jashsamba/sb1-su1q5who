import React from 'react';
import { Coffee, Swords, BookOpen, Users, TowerControl as GameController } from 'lucide-react';
import type { Mood } from '../types';
import { useStore } from '../store/useStore';

const moods: Array<{ type: Mood; icon: React.ReactNode; label: string }> = [
  { type: 'relaxed', icon: <Coffee className="w-8 h-8" />, label: 'Relaxed' },
  { type: 'competitive', icon: <Swords className="w-8 h-8" />, label: 'Competitive' },
  { type: 'story-driven', icon: <BookOpen className="w-8 h-8" />, label: 'Story-driven' },
  { type: 'social', icon: <Users className="w-8 h-8" />, label: 'Social' },
  { type: 'casual', icon: <GameController className="w-8 h-8" />, label: 'Casual' },
];

export function MoodSelector() {
  const { preferences, setMood } = useStore();

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {moods.map(({ type, icon, label }) => (
        <button
          key={type}
          onClick={() => setMood(type)}
          className={`
            flex flex-col items-center justify-center p-6 rounded-xl
            transition-all duration-200 ease-in-out border
            ${
              preferences.selectedMood === type
                ? 'bg-violet-600 text-white border-violet-500 shadow-lg scale-105'
                : 'bg-gray-800 text-gray-300 border-violet-500/20 hover:bg-gray-700/50'
            }
          `}
        >
          {icon}
          <span className="mt-2 font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}