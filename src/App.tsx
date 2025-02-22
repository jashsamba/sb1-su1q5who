import React from 'react';
import { Header } from './components/Header';
import { MoodSelector } from './components/MoodSelector';
import { GameCard } from './components/GameCard';
import { AIChatBox } from './components/AIChatBox';
import { GamingNews } from './components/GamingNews';
import { PatchUpdates } from './components/PatchUpdates';
import { RetroDecorations } from './components/RetroDecorations';
import type { Game } from './types';

// Sample game data - In a real app, this would come from your backend
const sampleGames: Game[] = [
  {
    id: '1',
    title: 'Stardew Valley',
    description: 'A relaxing farming simulation RPG that lets you live life at your own pace.',
    imageUrl: 'https://images.unsplash.com/photo-1586325194227-7625ed95172b?auto=format&fit=crop&q=80&w=800',
    moods: ['relaxed', 'casual'],
    storeUrl: 'https://store.steampowered.com/app/413150/Stardew_Valley/',
    rating: 4.8,
    price: 14.99,
  },
  {
    id: '2',
    title: 'Counter-Strike 2',
    description: 'The next evolution of the world\'s most played competitive tactical shooter.',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
    moods: ['competitive', 'social'],
    storeUrl: 'https://store.steampowered.com/app/730/CounterStrike_2/',
    rating: 4.7,
    price: 0,
  },
  {
    id: '3',
    title: 'The Witcher 3',
    description: 'An epic role-playing game set in a vast open world full of meaningful choices.',
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=800',
    moods: ['story-driven', 'relaxed'],
    storeUrl: 'https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/',
    rating: 4.9,
    price: 39.99,
  },
];

function App() {
  return (
    <div className="min-h-screen bg-black">
      <RetroDecorations />
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-500 to-violet-400 animate-gradient-x animate-pulse-glow inline-block">
              How are you feeling today?
            </h2>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full animate-pulse-width" />
          </div>
          <div className="space-y-8">
            <AIChatBox />
            <MoodSelector />
          </div>
        </section>

        <section className="mb-16">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-500 to-violet-400 animate-gradient-x animate-pulse-glow inline-block">
              Recommended Games
            </h2>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full animate-pulse-width" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {sampleGames.map((game, index) => (
              <div key={game.id} 
                   className="animate-slide-in"
                   style={{ animationDelay: `${index * 0.2}s` }}>
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </section>

        <GamingNews />
        <PatchUpdates />
      </main>
    </div>
  );
}

export default App;