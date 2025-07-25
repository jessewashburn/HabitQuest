import { Slot } from 'expo-router';
import React from 'react';
import { View } from 'react-native';


import Navbar from '../components/Navbar';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { HabitsProvider } from '../contexts/HabitsContext';
import { ThemeProvider } from '../hooks/ThemeContext';


function LayoutContent() {
  const { isAuthenticated } = useAuth();
  return (
    <View style={{ flex: 1 }}>
      {isAuthenticated && <Navbar />}
      <Slot />
    </View>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <HabitsProvider>
        <ThemeProvider>
          <LayoutContent />
        </ThemeProvider>
      </HabitsProvider>
    </AuthProvider>
  );
}
