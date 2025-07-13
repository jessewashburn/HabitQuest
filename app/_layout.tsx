import { Slot } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import Navbar from '../components/Navbar';
import { AuthProvider } from '../contexts/AuthContext';
import { HabitsProvider } from '../contexts/HabitsContext';
import { ThemeProvider } from '../hooks/ThemeContext';

export default function Layout() {
  return (
    <AuthProvider>
      <HabitsProvider>
      <ThemeProvider>
        <View style={{ flex: 1 }}>
          <Navbar />
          <Slot />
        </View>
      </HabitsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
