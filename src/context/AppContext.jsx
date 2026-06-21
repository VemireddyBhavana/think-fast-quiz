import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTheme, setTheme as setStorageTheme, getUsername, setUsername as setStorageUsername } from '../storage/localStore';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(getTheme());
  const [username, setUsername] = useState(getUsername());

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#0b0f19';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#f8fafc';
    }
    setStorageTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSetUsername = (name) => {
    setUsername(name);
    setStorageUsername(name);
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, username, setUsername: handleSetUsername }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
