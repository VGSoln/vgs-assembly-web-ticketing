'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PageContextType {
  isCustomerDetails: boolean;
  setIsCustomerDetails: (value: boolean) => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isCustomerDetails, setIsCustomerDetails] = useState(false);

  return (
    <PageContext.Provider value={{ isCustomerDetails, setIsCustomerDetails }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePageContext = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePageContext must be used within a PageProvider');
  }
  return context;
};