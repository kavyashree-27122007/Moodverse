import React, { createContext, useContext, useState, useEffect } from 'react';

export type MascotState = 'idle' | 'sleeping' | 'reading' | 'dancing' | 'waving' | 'celebrating';

interface MascotContextType {
  mascotState: MascotState;
  setMascotState: (state: MascotState) => void;
  message: string | null;
  showMessage: (msg: string, duration?: number) => void;
}

const MascotContext = createContext<MascotContextType | undefined>(undefined);

export const MascotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mascotState, setMascotState] = useState<MascotState>('idle');
  const [message, setMessage] = useState<string | null>(null);

  // Idle timer logic: sleep if no mouse movement for 30 seconds
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    const resetTimer = () => {
      if (mascotState === 'sleeping' || mascotState === 'reading') {
        setMascotState('idle');
      }
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        // Randomly pick sleeping or reading
        setMascotState(Math.random() > 0.5 ? 'sleeping' : 'reading');
      }, 30000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    
    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      clearTimeout(timeout);
    };
  }, [mascotState]);

  const showMessage = (msg: string, duration = 5000) => {
    setMessage(msg);
    if (duration > 0) {
      setTimeout(() => setMessage(null), duration);
    }
  };

  return (
    <MascotContext.Provider value={{ mascotState, setMascotState, message, showMessage }}>
      {children}
    </MascotContext.Provider>
  );
};

export const useMascot = () => {
  const context = useContext(MascotContext);
  return context as MascotContextType; // Return undefined if no provider
};
