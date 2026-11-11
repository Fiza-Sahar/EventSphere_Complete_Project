import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = {
  WHATSAPP: 'whatsapp',
  NEON: 'neon'
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('eventsphere_theme');
    return saved === THEMES.NEON ? THEMES.NEON : THEMES.WHATSAPP;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('eventsphere_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === THEMES.WHATSAPP ? THEMES.NEON : THEMES.WHATSAPP));
  };

  const isNeon = theme === THEMES.NEON;
  const isWhatsApp = theme === THEMES.WHATSAPP;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isNeon, isWhatsApp }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
