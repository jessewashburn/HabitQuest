import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeType = 'light' | 'dark';

export const lightTheme = {
  background: '#FFFFFF',
  text: '#000000',
  buttonBackground: '#007AFF',
  buttonText: '#FFFFFF',
  gradient: ['#F0E8D0', '#7BB8CC'],
};

export const darkTheme = {
  background: '#23272A', // dark grey
  text: '#F3F3F3', // light grey for text
  buttonBackground: '#3A3F44', // medium grey for buttons
  buttonText: '#F3F3F3',
  gradient: ['#23272A', '#393E46'], // smooth dark gradient
};

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: typeof lightTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeType>('light');

  const colors = theme === 'light' ? lightTheme : darkTheme;

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('user-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme);
      }
    };
    loadTheme();
  }, []);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    AsyncStorage.setItem('user-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
