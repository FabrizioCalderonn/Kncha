import React, { createContext, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const ThemeContext = createContext();

// Colores por rol
const themes = {
  client: {
    primary: '#0da6f2',
    secondary: '#00d4ff',
    background: '#f5f5f5',
    text: '#333333',
    card: '#ffffff',
    border: '#e0e0e0',
  },
  owner: {
    primary: '#4CAF50',
    secondary: '#81C784',
    background: '#f5f5f5',
    text: '#333333',
    card: '#ffffff',
    border: '#e0e0e0',
  },
  admin: {
    primary: '#9C27B0',
    secondary: '#BA68C8',
    background: '#f5f5f5',
    text: '#333333',
    card: '#ffffff',
    border: '#e0e0e0',
  },
  default: {
    primary: '#0da6f2',
    secondary: '#00d4ff',
    background: '#f5f5f5',
    text: '#333333',
    card: '#ffffff',
    border: '#e0e0e0',
  }
};

export const ThemeProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const getTheme = () => {
    if (!user) return themes.default;
    return themes[user.role] || themes.default;
  };

  const theme = getTheme();

  return (
    <ThemeContext.Provider value={{ theme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
