import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface SavedAnalysis {
  id: string;
  companyName: string;
  ticker: string;
  caseStudyId: string;
  completedDate: string;
  sections: Array<{
    title: string;
    content: string;
  }>;
  liquidity?: {
    runway: number;
    availableLiquidity: number;
    weeklyBurn: number;
  };
  capitalStructure?: {
    totalDebt: number;
    enterpriseValue: number;
    solvency: string;
  };
  recommendation?: string;
}

interface PortfolioContextType {
  savedAnalyses: SavedAnalysis[];
  saveAnalysis: (analysis: SavedAnalysis) => void;
  deleteAnalysis: (id: string) => void;
  getAnalysis: (id: string) => SavedAnalysis | undefined;
  clearAll: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const STORAGE_KEY = 'fulcrum-memo-portfolio';

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage whenever analyses change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedAnalyses));
  }, [savedAnalyses]);

  const saveAnalysis = (analysis: SavedAnalysis) => {
    setSavedAnalyses(prev => {
      // Check if analysis already exists (update) or is new (append)
      const existingIndex = prev.findIndex(a => a.id === analysis.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = analysis;
        return updated;
      }
      return [...prev, analysis];
    });
  };

  const deleteAnalysis = (id: string) => {
    setSavedAnalyses(prev => prev.filter(a => a.id !== id));
  };

  const getAnalysis = (id: string) => {
    return savedAnalyses.find(a => a.id === id);
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to delete all saved analyses? This cannot be undone.')) {
      setSavedAnalyses([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <PortfolioContext.Provider value={{
      savedAnalyses,
      saveAnalysis,
      deleteAnalysis,
      getAnalysis,
      clearAll
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
