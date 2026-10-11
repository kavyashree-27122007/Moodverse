import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { EmotionName, EmotionTheme } from '../utils/emotions';
import { emotionsThemes } from '../utils/emotions';

interface ThemeContextType {
  currentEmotion: EmotionName;
  theme: EmotionTheme;
  setEmotion: (emotion: EmotionName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const hexToRgb = (hex: string): string => {
  const clean = hex.replace('#', '');
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
  return '168, 85, 247';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read stored mood or latest logged mood
  const [currentEmotion, setCurrentEmotion] = useState<EmotionName>(() => {
    try {
      const saved = localStorage.getItem('mv_current_emotion');
      if (saved && emotionsThemes[saved as EmotionName]) {
        return saved as EmotionName;
      }
      const offline = JSON.parse(localStorage.getItem('mv_offline_moods') || '[]');
      if (offline.length > 0) {
        const last = offline[offline.length - 1];
        if (last?.emotion && emotionsThemes[last.emotion as EmotionName]) {
          return last.emotion as EmotionName;
        }
      }
    } catch {
      // fallback
    }
    return 'Happy';
  });

  const theme = useMemo(() => {
    return emotionsThemes[currentEmotion] || emotionsThemes['Happy'];
  }, [currentEmotion]);

  useEffect(() => {
    if (theme) {
      document.documentElement.style.setProperty('--color-bg', theme.bg);
      document.documentElement.style.setProperty('--color-surface', theme.surface);
      document.documentElement.style.setProperty('--color-accent', theme.accent);
      document.documentElement.style.setProperty('--color-accent-rgb', hexToRgb(theme.accent));
    }
  }, [theme]);

  const setEmotion = useCallback((emotion: EmotionName) => {
    setCurrentEmotion(emotion);
    try {
      localStorage.setItem('mv_current_emotion', emotion);
    } catch {
      // storage quota
    }
  }, []);

  const contextValue = useMemo(
    () => ({ currentEmotion, theme, setEmotion }),
    [currentEmotion, theme, setEmotion]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
