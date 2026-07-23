import { GoogleGenerativeAI } from '@google/generative-ai';
import { datasetService } from './dataset.service.js';

export interface AIProvider {
  analyzeEmotion(moods: any[], memory?: any, personality?: string): Promise<any>;
  getRecommendations(mood: string): Promise<any>;
}

class GeminiProvider implements AIProvider {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async analyzeEmotion(moods: any[], memory?: any, personality: string = 'Empathetic'): Promise<any> {
    const prompt = `You are Moody, a ${personality.toLowerCase()} wellness companion. You are NOT a licensed therapist and must not diagnose.
Analyze the following recent moods and memory data.
Return ONLY a valid JSON object with the following keys, containing 1-2 sentence insights:
{
  "currentState": "Current Emotional State...",
  "weeklyAnalysis": "Weekly Analysis...",
  "monthlyProgress": "Monthly Progress...",
  "moodPattern": "Mood Pattern...",
  "triggers": "Emotional Trigger Detection...",
  "positiveActivities": "Positive Activities...",
  "recommendation": "Personalized Recommendation...",
  "encouragement": "AI Encouragement..."
}

Recent Moods: ${JSON.stringify(moods)}
Memory Context: ${JSON.stringify(memory || {})}
`;
    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(text);
    } catch (e) {
      console.error('Gemini error:', e);
      return this.getFallbackInsights(moods);
    }
  }

  async getRecommendations(mood: string): Promise<any> {
    const prompt = `Based on a mood of '${mood}', recommend 10 to 15 movies and 10 to 15 music tracks. Return ONLY a valid JSON object. For movies use: {"title": "Movie Name", "genre": "Genre", "language": "Language", "rating": "Rating"}. For music use: {"title": "Track Name", "artist": "Artist", "language": "Language", "url": "https://open.spotify.com/search/Track+Name"}. Wrap them in "movies" and "music" arrays.`;
    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(text);
    } catch (e) {
      console.error('Gemini error, using dataset fallback:', e);
      return datasetService.getRecommendations(mood, 'tamil');
    }
  }

  private getFallbackInsights(moods: any[]) {
    return {
      currentState: moods.length ? `You've been feeling mostly ${moods[moods.length - 1].emotion} lately.` : "Start logging your moods to receive insights!",
      weeklyAnalysis: "Keep logging your moods to see weekly trends.",
      monthlyProgress: "Your monthly progress will appear here.",
      moodPattern: "We need a bit more data to find your mood patterns.",
      triggers: "Log notes with your moods to detect triggers.",
      positiveActivities: "Listening to music often helps boost your mood.",
      recommendation: "Take a deep breath and have a glass of water.",
      encouragement: "Every step you take towards mindfulness is a victory!"
    };
  }
}

class RuleBasedProvider implements AIProvider {
  async analyzeEmotion(moods: any[], memory?: any, personality: string = 'Empathetic'): Promise<any> {
    if (moods.length === 0) {
       return this.getFallbackInsights([]);
    }
    const latest = moods[moods.length - 1];
    
    const insights = this.getFallbackInsights(moods);
    if (latest.intensity >= 8) {
      insights.currentState = `Your recent emotions are quite intense, specifically feeling ${latest.emotion}. Make sure to channel this energy safely!`;
    } else {
      insights.currentState = `You've been feeling mostly ${latest.emotion} lately. Consistency is key to understanding your emotional baseline.`;
    }
    return insights;
  }

  async getRecommendations(mood: string): Promise<any> {
    return datasetService.getRecommendations(mood, 'tamil');
  }

  private getFallbackInsights(moods: any[]) {
    return {
      currentState: "Start logging your moods to receive insights!",
      weeklyAnalysis: "Keep logging your moods to see weekly trends.",
      monthlyProgress: "Your monthly progress will appear here.",
      moodPattern: "We need a bit more data to find your mood patterns.",
      triggers: "Log notes with your moods to detect triggers.",
      positiveActivities: "Listening to music often helps boost your mood.",
      recommendation: "Take a deep breath and have a glass of water.",
      encouragement: "Every step you take towards mindfulness is a victory!"
    };
  }
}

export class AIEngine {
  private provider: AIProvider;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      console.log('[AI Engine] Initializing Gemini Provider');
      this.provider = new GeminiProvider(apiKey);
    } else {
      console.log('[AI Engine] Initializing Rule-Based Fallback Provider');
      this.provider = new RuleBasedProvider();
    }
  }

  async analyzeEmotion(moods: any[], memory?: any, personality?: string): Promise<any> {
    return this.provider.analyzeEmotion(moods, memory, personality);
  }

  async getRecommendations(mood: string): Promise<any> {
    return this.provider.getRecommendations(mood);
  }
}

export const aiEngine = new AIEngine();

