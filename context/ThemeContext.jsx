import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Colors } from '../constants/theme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light');
  const [colors, setColors] = useState(Colors);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    // In a real app, you would switch colors based on theme
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;