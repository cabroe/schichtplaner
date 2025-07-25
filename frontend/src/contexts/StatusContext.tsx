import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StatusType {
  content: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'teal' | 'purple' | 'pink' | 'yellow' | 'orange' | 'green' | 'blue' | 'red' | 'gray';
  size?: 'sm' | 'md' | 'lg';
}

interface StatusContextType {
  status: StatusType | null;
  setStatus: (status: StatusType | null) => void;
}

const StatusContext = createContext<StatusContextType | null>(null);

interface StatusProviderProps {
  children: ReactNode;
}

export const StatusProvider: React.FC<StatusProviderProps> = ({ children }) => {
  const [status, setStatus] = useState<StatusType | null>(null);

  return (
    <StatusContext.Provider value={{ status, setStatus }}>
      {children}
    </StatusContext.Provider>
  );
};

export const useStatus = () => {
  const context = useContext(StatusContext);
  if (!context) {
    throw new Error('useStatus must be used within a StatusProvider');
  }
  return context;
}; 