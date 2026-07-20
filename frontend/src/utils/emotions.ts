export type EmotionName = 
  | 'Happy' | 'Sad' | 'Angry' | 'Fear' | 'Love' | 'Excited' 
  | 'Calm' | 'Lonely' | 'Confident' | 'Hopeful' | 'Motivated' 
  | 'Nostalgic' | 'Anxious' | 'Relaxed' | 'Bored' | 'Frustrated'
  | 'Overwhelmed' | 'Grateful' | 'Jealous' | 'Insecure' | 'Proud'
  | 'Inspired' | 'Confused' | 'Surprised' | 'Disgusted' | 'Guilty'
  | 'Ashamed' | 'Lonely' | 'Empathetic' | 'Apathetic' | 'Stressed'
  | 'Peaceful' | 'Optimistic' | 'Pessimistic' | 'Curious' | 'Neutral';

export interface EmotionTheme {
  name: EmotionName;
  bg: string;
  surface: string;
  accent: string;
}

export const emotionsThemes: Record<EmotionName, EmotionTheme> = {
  'Happy': { name: 'Happy', bg: '#1A1610', surface: '#2E2211', accent: '#FACC15' }, // Golden Yellow
  'Sad': { name: 'Sad', bg: '#0D131A', surface: '#162333', accent: '#3B82F6' }, // Soft Blue
  'Angry': { name: 'Angry', bg: '#1A0F0F', surface: '#331616', accent: '#EF4444' }, // Deep Red
  'Fear': { name: 'Fear', bg: '#100D1A', surface: '#1A132E', accent: '#7C3AED' }, // Dark Purple
  'Love': { name: 'Love', bg: '#1A0F14', surface: '#331624', accent: '#EC4899' }, // Rose Pink
  'Excited': { name: 'Excited', bg: '#160B1E', surface: '#2E1541', accent: '#A855F7' }, // Vibrant Purple
  'Calm': { name: 'Calm', bg: '#0D1A16', surface: '#163327', accent: '#10B981' }, // Mint Green
  'Lonely': { name: 'Lonely', bg: '#13161A', surface: '#1E242B', accent: '#64748B' }, // Grey Blue
  'Confident': { name: 'Confident', bg: '#0A1226', surface: '#11224D', accent: '#2563EB' }, // Royal Blue
  'Hopeful': { name: 'Hopeful', bg: '#0F1A24', surface: '#18314A', accent: '#0EA5E9' }, // Sky Blue
  'Motivated': { name: 'Motivated', bg: '#1A110A', surface: '#331E11', accent: '#F97316' }, // Orange
  'Nostalgic': { name: 'Nostalgic', bg: '#1A1612', surface: '#33281E', accent: '#D97706' }, // Sepia Brown
  'Anxious': { name: 'Anxious', bg: '#15101A', surface: '#281E33', accent: '#8B5CF6' }, // Muted Violet
  'Relaxed': { name: 'Relaxed', bg: '#0F1A14', surface: '#1B3326', accent: '#22C55E' }, // Soft Green
  'Bored': { name: 'Bored', bg: '#121212', surface: '#1E1E1E', accent: '#9CA3AF' },
  'Frustrated': { name: 'Frustrated', bg: '#1A1010', surface: '#331818', accent: '#DC2626' },
  'Overwhelmed': { name: 'Overwhelmed', bg: '#171120', surface: '#2B1E40', accent: '#9333EA' },
  'Grateful': { name: 'Grateful', bg: '#151811', surface: '#27301E', accent: '#84CC16' },
  'Jealous': { name: 'Jealous', bg: '#111A11', surface: '#1E331E', accent: '#15803D' },
  'Insecure': { name: 'Insecure', bg: '#1A191A', surface: '#333033', accent: '#A3A3A3' },
  'Proud': { name: 'Proud', bg: '#13111A', surface: '#252033', accent: '#6366F1' },
  'Inspired': { name: 'Inspired', bg: '#1A170F', surface: '#332D19', accent: '#EAB308' },
  'Confused': { name: 'Confused', bg: '#141416', surface: '#26262B', accent: '#71717A' },
  'Surprised': { name: 'Surprised', bg: '#1A131A', surface: '#332333', accent: '#D946EF' },
  'Disgusted': { name: 'Disgusted', bg: '#131A12', surface: '#243321', accent: '#4ADE80' },
  'Guilty': { name: 'Guilty', bg: '#161213', surface: '#2D2024', accent: '#BE123C' },
  'Ashamed': { name: 'Ashamed', bg: '#141113', surface: '#292026', accent: '#9D174D' },
  'Empathetic': { name: 'Empathetic', bg: '#12171A', surface: '#1E2C33', accent: '#06B6D4' },
  'Apathetic': { name: 'Apathetic', bg: '#151515', surface: '#292929', accent: '#525252' },
  'Stressed': { name: 'Stressed', bg: '#1A1010', surface: '#381B1B', accent: '#B91C1C' },
  'Peaceful': { name: 'Peaceful', bg: '#0F1A1B', surface: '#1C3134', accent: '#14B8A6' },
  'Optimistic': { name: 'Optimistic', bg: '#1A160D', surface: '#332916', accent: '#F59E0B' },
  'Pessimistic': { name: 'Pessimistic', bg: '#111316', surface: '#1F2429', accent: '#475569' },
  'Curious': { name: 'Curious', bg: '#131118', surface: '#252031', accent: '#818CF8' },
  'Neutral': { name: 'Neutral', bg: '#0F172A', surface: '#1E293B', accent: '#A855F7' }
};
