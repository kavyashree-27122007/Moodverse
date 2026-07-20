import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { EmotionName } from '../utils/emotions';
import { emotionsThemes } from '../utils/emotions';

interface ThemeContextType {
  currentEmotion: EmotionName;
  setEmotion: (emotion: EmotionName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionName>('Neutral');

  useEffect(() => {
    const theme = emotionsThemes[currentEmotion];
    if (theme) {
      document.documentElement.style.setProperty('--color-bg', theme.bg);
      document.documentElement.style.setProperty('--color-surface', theme.surface);
      document.documentElement.style.setProperty('--color-accent', theme.accent);
    }
  }, [currentEmotion]);

  // Memoize setEmotion so ThemeContext consumers don't re-render unnecessarily
  const setEmotion = useCallback((emotion: EmotionName) => {
    setCurrentEmotion(emotion);
  }, []);

  const contextValue = useMemo(
    () => ({ currentEmotion, setEmotion }),
    [currentEmotion, setEmotion]
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
