import React, { createContext, useContext, useState } from 'react';

interface KanbanContextType {
  getShareableLink: (boardId: string) => string;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export function KanbanProvider({ children }: { children: React.ReactNode }) {
  const getShareableLink = (boardId: string) => {
    const origin = window.location.origin;
    return `${origin}/board/${boardId}?shared=true`;
  };

  const value = {
    getShareableLink,
  };

  return (
    <KanbanContext.Provider value={value}>
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban() {
  const context = useContext(KanbanContext);
  if (context === undefined) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
}