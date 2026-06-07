// ThemeContext - loads theme from Firestore, applies CSS variables live
import { createContext, useContext, useState, useEffect } from 'react';
import { getTheme, DEFAULT_THEME } from '../lib/firebase';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [theme,  setTheme]  = useState(DEFAULT_THEME);

  const applyTheme = (t, dark) => {
    const root = document.documentElement;
    root.style.setProperty('--color-gold',       t.colorGold);
    root.style.setProperty('--color-sage',       t.colorSage);
    root.style.setProperty('--color-bg',         dark ? t.colorBgDark     : t.colorBg);
    root.style.setProperty('--color-bg-card',    dark ? t.colorBgCardDark : t.colorBgCard);
    root.style.setProperty('--color-text',       dark ? t.colorTextDark   : t.colorText);
    root.style.setProperty('--color-border',     dark ? '#3a3528'         : '#e5dbc1');
    root.style.setProperty('--color-text-muted', dark ? '#9a8f7e'         : '#7a7065');
  };

  useEffect(() => {
    // Load dark preference
    const dark = localStorage.getItem('khareef_theme') === 'dark';
    setIsDark(dark);
    if (dark) document.documentElement.classList.add('dark');

    // Load theme from Firestore
    getTheme().then(t => {
      setTheme(t);
      applyTheme(t, dark);
    }).catch(() => applyTheme(DEFAULT_THEME, dark));
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      if (next) { document.documentElement.classList.add('dark'); localStorage.setItem('khareef_theme', 'dark'); }
      else      { document.documentElement.classList.remove('dark'); localStorage.setItem('khareef_theme', 'light'); }
      applyTheme(theme, next);
      return next;
    });
  };

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme, isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
