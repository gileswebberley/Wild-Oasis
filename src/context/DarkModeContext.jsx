import { createContext, useContext, useEffect } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

const DarkModeContext = createContext();

function DarkModeProvider({ children }) {
  //set the default by checking if the user has a browser preference set for dark-mode
  const [isDarkMode, setIsDarkMode] = useLocalStorageState(
    window.matchMedia('(prefers-color-scheme: dark)').matches,
    'dark-mode'
  );

  function toggleDarkMode() {
    setIsDarkMode((isDark) => !isDark);
  }
  useEffect(() => {
    const htmlClassList = document.documentElement.classList;
    htmlClassList.toggle('dark-mode', isDarkMode);
    htmlClassList.toggle('light-mode', !isDarkMode);
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('DarkModeContext was used outside of DarkModeProvider');
  }
  return context;
}

export { DarkModeProvider, useDarkMode };
