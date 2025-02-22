import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, X, TowerControl as GameController, Heart, Star } from 'lucide-react';
import { useStore } from '../store/useStore';
import { getAIResponse } from '../services/aiService';
import type { Game } from '../types';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  suggestedGame?: Game;
  timestamp: number;
}

const SAMPLE_RESPONSES = [
  {
    trigger: ['relaxing', 'peaceful', 'calm', 'chill'],
    response: "Based on your mood, I'd recommend Stardew Valley. It's a peaceful farming simulation that lets you take things at your own pace.",
    game: {
      id: '1',
      title: 'Stardew Valley',
      description: 'A relaxing farming simulation RPG that lets you live life at your own pace.',
      imageUrl: 'https://images.unsplash.com/photo-1586325194227-7625ed95172b?auto=format&fit=crop&q=80&w=800',
      moods: ['relaxed', 'casual'],
      storeUrl: 'https://store.steampowered.com/app/413150/Stardew_Valley/',
      rating: 4.8,
      price: 14.99,
    }
  },
  {
    trigger: ['competitive', 'challenge', 'action', 'fight'],
    response: "You seem ready for some competitive action! I'd suggest Counter-Strike 2, the latest evolution of the tactical shooter genre.",
    game: {
      id: '2',
      title: 'Counter-Strike 2',
      description: "The next evolution of the world's most played competitive tactical shooter.",
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
      moods: ['competitive', 'social'],
      storeUrl: 'https://store.steampowered.com/app/730/CounterStrike_2/',
      rating: 4.7,
      price: 0,
    }
  },
  {
    trigger: ['story', 'adventure', 'epic', 'immersive'],
    response: "For an immersive story-driven experience, I highly recommend The Witcher 3. It's an epic RPG with deep narrative and meaningful choices.",
    game: {
      id: '3',
      title: 'The Witcher 3',
      description: 'An epic role-playing game set in a vast open world full of meaningful choices.',
      imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=800',
      moods: ['story-driven', 'relaxed'],
      storeUrl: 'https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/',
      rating: 4.9,
      price: 39.99,
    }
  }
];

const CHAT_STORAGE_KEY = 'ai_chat_history';
const MAX_CHAT_HISTORY = 50; // Limit stored messages
const MAX_MESSAGE_LENGTH = 500; // Limit message length

export function AIChatBox() {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const searchBarRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { toggleFavoriteGame } = useStore();

  // Load chat history from localStorage with error handling
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(CHAT_STORAGE_KEY);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed) && parsed.every(isValidMessage)) {
          setChatHistory(parsed.slice(-MAX_CHAT_HISTORY));
        } else {
          throw new Error('Invalid chat history format');
        }
      }
    } catch (error) {
      console.warn('Failed to load chat history:', error);
      localStorage.removeItem(CHAT_STORAGE_KEY);
    }
  }, []);

  // Save chat history to localStorage with validation
  useEffect(() => {
    if (chatHistory.length > 0) {
      try {
        const validHistory = chatHistory
          .slice(-MAX_CHAT_HISTORY)
          .filter(isValidMessage);
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(validHistory));
      } catch (error) {
        console.error('Failed to save chat history:', error);
      }
    }
  }, [chatHistory]);

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
      if (searchBarRef.current && modalRef.current) {
        const searchRect = searchBarRef.current.getBoundingClientRect();
        modalRef.current.style.setProperty('--initial-top', `${searchRect.top}px`);
        modalRef.current.style.setProperty('--initial-left', `${searchRect.left}px`);
        modalRef.current.style.setProperty('--initial-width', `${searchRect.width}px`);
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isExpanded]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Validate message object
  function isValidMessage(msg: any): msg is Message {
    return (
      typeof msg === 'object' &&
      msg !== null &&
      typeof msg.id === 'string' &&
      typeof msg.text === 'string' &&
      typeof msg.isUser === 'boolean' &&
      typeof msg.timestamp === 'number' &&
      (!msg.suggestedGame || typeof msg.suggestedGame === 'object')
    );
  }

  const handleExpand = () => {
    setIsAnimating(true);
    setIsExpanded(true);
    if (chatHistory.length === 0) {
      setChatHistory([{
        id: crypto.randomUUID(),
        text: "Hi! I'm your AI gaming assistant. Tell me how you're feeling or what kind of game you're looking for!",
        isUser: false,
        timestamp: Date.now()
      }]);
    }
  };

  const handleClose = () => {
    if (isProcessing) return; // Prevent closing while processing
    setIsAnimating(true);
    setIsExpanded(false);
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const findGameRecommendation = (input: string): { response: string; game?: Game } => {
    const lowercaseInput = input.toLowerCase();
    
    for (const template of SAMPLE_RESPONSES) {
      if (template.trigger.some(keyword => lowercaseInput.includes(keyword))) {
        return { response: template.response, game: template.game };
      }
    }
    
    return {
      response: "I'm not quite sure what type of game you're looking for. Could you tell me more about your preferences? For example, do you enjoy relaxing games, competitive action, or story-driven adventures?"
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing || !message.trim() || message.length > MAX_MESSAGE_LENGTH) return;

    setIsProcessing(true);
    const messageId = crypto.randomUUID();
    const userMessage: Message = {
      id: messageId,
      text: message.trim().slice(0, MAX_MESSAGE_LENGTH),
      isUser: true,
      timestamp: Date.now()
    };

    try {
      setChatHistory(prev => [...prev, userMessage]);
      setMessage('');
      setIsTyping(true);

      // Get AI response with timeout
      const aiResponse = await Promise.race([
        getAIResponse(userMessage.text),
        new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error('Response timeout')), 15000)
        )
      ]);
      
      // Find game recommendation
      const { response: gameResponse, game } = findGameRecommendation(userMessage.text);
      
      // Combine responses
      const fullResponse = `${aiResponse}\n\n${gameResponse}`;
      
      // Add AI response with typing effect
      let displayedResponse = '';
      const aiMessageId = crypto.randomUUID();
      
      for (let i = 0; i < fullResponse.length; i++) {
        displayedResponse += fullResponse[i];
        setChatHistory(prev => [
          ...prev.slice(0, -1),
          userMessage,
          { 
            id: aiMessageId,
            text: displayedResponse,
            isUser: false,
            suggestedGame: game,
            timestamp: Date.now()
          }
        ]);
        await new Promise(resolve => setTimeout(resolve, 30));
      }
    } catch (error) {
      console.error('Chat processing failed:', error);
      const { response, game } = findGameRecommendation(userMessage.text);
      setChatHistory(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: response,
          isUser: false,
          suggestedGame: game,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsTyping(false);
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div 
        ref={searchBarRef}
        className={`
          w-full max-w-2xl mx-auto transition-all duration-300 ease-in-out
          ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
      >
        <div
          onClick={handleExpand}
          className="bg-gray-800 border border-violet-500/30 rounded-full shadow-lg hover:shadow-violet-500/10 transition-all duration-300 ease-in-out transform hover:scale-102 hover:border-violet-500/50"
        >
          <div className="flex items-center px-6 py-3">
            <Bot className="w-5 h-5 text-violet-400 mr-3 animate-pulse" />
            <input
              type="text"
              readOnly
              placeholder="Tell me how you're feeling..."
              className="flex-1 bg-transparent border-none focus:outline-none text-gray-300 placeholder-gray-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {(isExpanded || isAnimating) && (
        <div 
          className={`
            fixed inset-0 z-50 flex items-center justify-center p-4
            transition-all duration-300 ease-in-out
            ${isExpanded ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <div
            className={`
              absolute inset-0 bg-black/60 backdrop-blur-sm
              transition-all duration-300 ease-in-out
              ${isExpanded ? 'opacity-100' : 'opacity-0'}
            `}
            onClick={handleClose}
          />

          <div 
            ref={modalRef}
            className={`
              relative bg-gray-800 border border-violet-500/30 rounded-xl shadow-2xl
              w-full max-w-2xl max-h-[80vh] flex flex-col
              animate-expandFromSearch
            `}
          >
            <div className="flex items-center justify-between p-4 border-b border-violet-500/20">
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-violet-400" />
                <h3 className="text-lg font-semibold text-gray-100">Chat with AI Assistant</h3>
              </div>
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="p-2 hover:bg-gray-700/50 rounded-full transition-colors duration-200 disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`
                    flex ${chat.isUser ? 'justify-end' : 'justify-start'}
                    animate-fadeIn
                  `}
                >
                  <div
                    className={`
                      max-w-[80%] rounded-lg p-3
                      ${chat.isUser
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-700 text-gray-100'}
                    `}
                  >
                    <div className="flex items-start gap-2">
                      {!chat.isUser && (
                        <Bot className="w-5 h-5 text-violet-400 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="break-words">{chat.text}</p>
                        {chat.suggestedGame && (
                          <div className="mt-3 bg-gray-800 rounded-lg p-3 border border-violet-500/20">
                            <div className="flex items-start gap-3">
                              <img
                                src={chat.suggestedGame.imageUrl}
                                alt={chat.suggestedGame.title}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <h4 className="font-semibold text-violet-400">
                                    {chat.suggestedGame.title}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => toggleFavoriteGame(chat.suggestedGame!.id)}
                                      className="p-1 hover:bg-violet-500/20 rounded-full transition-colors"
                                    >
                                      <Heart className="w-4 h-4 text-violet-400" />
                                    </button>
                                    <a
                                      href={chat.suggestedGame.storeUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1 hover:bg-violet-500/20 rounded-full transition-colors"
                                    >
                                      <GameController className="w-4 h-4 text-violet-400" />
                                    </a>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-300 mt-1">
                                  {chat.suggestedGame.description}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Star className="w-4 h-4 text-yellow-400" />
                                  <span className="text-sm text-yellow-400">
                                    {chat.suggestedGame.rating}
                                  </span>
                                  <span className="text-sm text-violet-400">
                                    ${chat.suggestedGame.price.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 rounded-lg p-3 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-violet-400" />
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-violet-500/20">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                  placeholder="Tell me how you're feeling or what games you like..."
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-violet-500/30 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                  disabled={isProcessing}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isProcessing || !message.trim()}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all duration-200 flex items-center gap-2 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-violet-600"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}