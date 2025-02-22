import React, { useEffect } from 'react';
import { Newspaper, TrendingUp, Star, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { getEnhancedNews } from '../services/newsService';

export function GamingNews() {
  const { news, setNews, setNewsLoading, setNewsError } = useStore();

  useEffect(() => {
    async function fetchNews() {
      setNewsLoading(true);
      try {
        const enhancedNews = await getEnhancedNews();
        setNews(enhancedNews);
      } catch (error) {
        setNewsError(error instanceof Error ? error.message : 'Failed to fetch news');
      } finally {
        setNewsLoading(false);
      }
    }

    fetchNews();
  }, [setNews, setNewsLoading, setNewsError]);

  if (news.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (news.error) {
    return (
      <div className="text-center text-red-400 p-8">
        <p>Error loading news: {news.error}</p>
      </div>
    );
  }

  return (
    <section className="mt-16 mb-16">
      <div className="flex flex-col items-center gap-2 mb-8 text-center">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-500 to-violet-400 animate-gradient-x animate-pulse-glow inline-block">
          AI Gaming News
        </h2>
        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full animate-pulse-width" />
        <span className="italic text-violet-400">"AI-enhanced gaming updates"</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.items.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 rounded-xl p-6 border border-violet-500/20 hover:border-violet-500/40 transition-all duration-300 group hover:scale-105"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="px-3 py-1 bg-violet-600/20 text-violet-400 rounded-full text-sm">
                {item.category}
              </span>
              <div 
                className={`text-${
                  item.sentiment === 'positive' 
                    ? 'green' 
                    : item.sentiment === 'negative' 
                    ? 'red' 
                    : 'violet'
                }-400 group-hover:scale-110 transition-transform duration-300`}
              >
                {item.sentiment === 'positive' ? <Star /> : <TrendingUp />}
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-100 mb-3 line-clamp-2">
              {item.title}
            </h3>
            
            {item.aiSummary && (
              <div className="mb-4 p-3 bg-violet-600/10 rounded-lg border border-violet-500/20">
                <p className="text-sm text-violet-300 italic line-clamp-3">
                  "{item.aiSummary}"
                </p>
              </div>
            )}
            
            <p className="text-gray-400 mb-4 line-clamp-2">
              {item.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{item.timestamp}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-violet-400">
                  {Math.round(item.confidence * 100)}% confidence
                </span>
                <button className="text-violet-400 hover:text-violet-300 transition-colors duration-200">
                  Read more →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}