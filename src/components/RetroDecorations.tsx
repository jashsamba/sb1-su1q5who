import React, { useEffect, useRef } from 'react';

export function RetroDecorations() {
  const ladderRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (ladderRef.current) {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        const snakes = ladderRef.current.querySelectorAll('.snake');
        snakes.forEach((snake, index) => {
          const delay = index * 0.2;
          const twist = Math.sin(scrollPercent * 0.1 + index) * 20; // Add twisting effect
          const verticalMove = scrollPercent * 0.8; // Slower vertical movement
          (snake as HTMLElement).style.transform = `translateY(${verticalMove}vh) rotate(${twist}deg) scale(${1 + Math.sin(scrollPercent * 0.05) * 0.1})`;
          (snake as HTMLElement).style.transition = `transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={ladderRef} className="fixed left-4 top-0 h-full w-24 pointer-events-none">
      {/* Ladder */}
      <div className="absolute left-8 h-full w-8 border-l-4 border-r-4 border-violet-500/30">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-12 h-3 bg-violet-500/30 -left-2 transform transition-all duration-300"
            style={{ 
              top: `${i * 3.33}%`,
              transform: `rotate(${Math.sin(i * 0.2) * 2}deg)` // Slight rotation for each rung
            }}
          />
        ))}
        
        {/* Ladder glow effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent pointer-events-none" />
      </div>
      
      {/* Snakes */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="snake absolute left-0 w-20 animate-snake"
          style={{
            top: `${20 + i * 25}%`,
            animationDelay: `${i * 0.3}s`,
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full fill-violet-500/50">
            <path 
              d="M50,0 C20,20 80,40 50,60 C20,80 80,100 50,120" 
              stroke="currentColor" 
              strokeWidth="8" 
              fill="none"
              className="animate-pulse-slow" 
            />
            {/* Snake eyes with glow effect */}
            <circle cx="45" cy="15" r="3" className="fill-violet-300">
              <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="55" cy="15" r="3" className="fill-violet-300">
              <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" />
            </circle>
            {/* Glowing effect */}
            <circle cx="45" cy="15" r="4" className="fill-violet-400/30 animate-pulse" />
            <circle cx="55" cy="15" r="4" className="fill-violet-400/30 animate-pulse" />
          </svg>
        </div>
      ))}
    </div>
  );
}