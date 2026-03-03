import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface JargonContextType {
  encounteredTerms: Set<string>;
  markTermAsEncountered: (termId: string) => void;
  getEncounteredCount: () => number;
  resetProgress: () => void;
}

const JargonContext = createContext<JargonContextType | undefined>(undefined);

const STORAGE_KEY = 'fulcrum-memo-jargon-progress';

export const JargonProvider = ({ children }: { children: ReactNode }) => {
  const [encounteredTerms, setEncounteredTerms] = useState<Set<string>>(() => {
    // Load from localStorage on init
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Persist to localStorage whenever encountered terms change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(encounteredTerms)));
  }, [encounteredTerms]);

  const markTermAsEncountered = (termId: string) => {
    setEncounteredTerms(prev => new Set(prev).add(termId));
  };

  const getEncounteredCount = () => encounteredTerms.size;

  const resetProgress = () => {
    setEncounteredTerms(new Set());
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <JargonContext.Provider value={{
      encounteredTerms,
      markTermAsEncountered,
      getEncounteredCount,
      resetProgress
    }}>
      {children}
    </JargonContext.Provider>
  );
};

export const useJargon = () => {
  const context = useContext(JargonContext);
  if (!context) {
    throw new Error('useJargon must be used within a JargonProvider');
  }
  return context;
};
