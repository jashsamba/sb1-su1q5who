import React from 'react';
import { TowerControl, User } from 'lucide-react';

export function Header() {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    }).format(date);
  };

  return (
    <header className="bg-gray-800 shadow-lg border-b border-violet-500/20">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TowerControl className="w-8 h-8 text-violet-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
              AI Game Finder
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-violet-400 text-sm">{formatDate(time)}</p>
              <p className="text-gray-300 font-mono">{formatTime(time)}</p>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all duration-200 hover:scale-105">
              <User className="w-4 h-4" />
              <span>Hi GAMER, SIGN UP</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}