import { HfInference } from '@huggingface/inference';
import type { NewsItem } from '../types';

const NEWS_API_ENDPOINT = 'https://newsapi.org/v2/everything';
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const HF_API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY;

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'AI-Powered NPCs Revolution in Gaming',
    description: 'Game developers are implementing advanced AI to create more realistic and responsive NPCs, leading to more immersive gaming experiences.',
    category: 'Gaming & AI',
    timestamp: new Date().toLocaleString(),
    aiSummary: 'Revolutionary AI technology enhances NPC behavior in games, creating more dynamic and realistic gaming experiences.',
    sentiment: 'positive',
    confidence: 0.95
  },
  {
    id: '2',
    title: 'Machine Learning Optimizes Game Performance',
    description: 'New ML algorithms are being used to improve game performance and graphics while reducing hardware requirements.',
    category: 'Gaming & AI',
    timestamp: new Date().toLocaleString(),
    aiSummary: 'Machine learning technology improves game performance and graphics quality while reducing system requirements.',
    sentiment: 'positive',
    confidence: 0.88
  },
  {
    id: '3',
    title: 'Procedural Generation Gets AI Upgrade',
    description: 'AI-driven procedural generation is creating more diverse and interesting game worlds than ever before.',
    category: 'Gaming & AI',
    timestamp: new Date().toLocaleString(),
    aiSummary: 'AI enhances procedural generation in games, leading to more diverse and engaging virtual worlds.',
    sentiment: 'positive',
    confidence: 0.92
  }
];

// Initialize Hugging Face client
let hf: HfInference | null = null;
try {
  if (HF_API_KEY) {
    hf = new HfInference(HF_API_KEY);
  }
} catch (error) {
  console.warn('Failed to initialize Hugging Face client, AI features will be disabled');
}

async function fetchNewsFromAPI(): Promise<NewsItem[]> {
  // Validate API key
  if (!NEWS_API_KEY || NEWS_API_KEY.trim() === '') {
    console.info('News API key not configured, using mock data');
    return MOCK_NEWS;
  }

  try {
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    const fromDate = lastMonth.toISOString().split('T')[0];

    const url = new URL(NEWS_API_ENDPOINT);
    url.searchParams.append('q', 'gaming AND (AI OR "artificial intelligence" OR "machine learning")');
    url.searchParams.append('from', fromDate);
    url.searchParams.append('sortBy', 'publishedAt');
    url.searchParams.append('language', 'en');
    url.searchParams.append('pageSize', '10');
    url.searchParams.append('apiKey', NEWS_API_KEY);

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 401) {
        console.warn('Invalid News API key, using mock data');
        return MOCK_NEWS;
      }
      if (response.status === 429) {
        console.warn('News API rate limit exceeded, using mock data');
        return MOCK_NEWS;
      }
      throw new Error(`News API error: ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.articles || !Array.isArray(data.articles)) {
      console.warn('Invalid response format from News API, using mock data');
      return MOCK_NEWS;
    }

    if (data.articles.length === 0) {
      console.info('No articles found, using mock data');
      return MOCK_NEWS;
    }

    return data.articles.map((article: any) => ({
      id: Math.random().toString(36).substr(2, 9),
      title: article.title || 'Untitled',
      description: article.description || 'No description available',
      category: 'Gaming & AI',
      timestamp: new Date(article.publishedAt || Date.now()).toLocaleString(),
      sentiment: 'neutral',
      confidence: 0.5
    }));

  } catch (error) {
    if (error instanceof Error) {
      console.warn('Failed to fetch news:', error.message);
    } else {
      console.warn('Failed to fetch news: Unknown error');
    }
    return MOCK_NEWS;
  }
}

async function generateAISummary(text: string): Promise<string | null> {
  if (!hf) {
    return null;
  }

  try {
    const result = await hf.summarization({
      model: 'facebook/bart-large-cnn',
      inputs: text.slice(0, 1000),
      parameters: {
        max_length: 100,
        min_length: 30,
      },
    });
    return result.summary_text;
  } catch (error) {
    console.warn('AI Summary generation failed, skipping summary');
    return null;
  }
}

async function analyzeSentiment(text: string): Promise<{
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
} | null> {
  if (!hf) {
    return null;
  }

  try {
    const result = await hf.textClassification({
      model: 'distilbert-base-uncased-finetuned-sst-2-english',
      inputs: text.slice(0, 500),
    });

    return {
      sentiment: result[0].label === 'POSITIVE' ? 'positive' : 'negative',
      confidence: result[0].score,
    };
  } catch (error) {
    console.warn('Sentiment analysis failed, using neutral sentiment');
    return null;
  }
}

export async function getEnhancedNews(): Promise<NewsItem[]> {
  try {
    const articles = await fetchNewsFromAPI();
    
    // If we got mock news, return it directly
    if (articles === MOCK_NEWS) {
      return MOCK_NEWS;
    }

    const enhancedArticles = await Promise.all(
      articles.map(async (article) => {
        try {
          const combinedText = `${article.title} ${article.description}`.trim();
          
          // Run AI enhancements in parallel
          const [aiSummary, sentimentAnalysis] = await Promise.all([
            generateAISummary(combinedText),
            analyzeSentiment(combinedText),
          ]);

          return {
            ...article,
            aiSummary: aiSummary || undefined,
            sentiment: sentimentAnalysis?.sentiment || 'neutral',
            confidence: sentimentAnalysis?.confidence || 0.5,
          };
        } catch (error) {
          console.warn('Failed to enhance article, returning basic version');
          return article;
        }
      })
    );

    return enhancedArticles.length > 0 ? enhancedArticles : MOCK_NEWS;
  } catch (error) {
    console.warn('Failed to fetch and enhance news, using mock data');
    return MOCK_NEWS;
  }
}