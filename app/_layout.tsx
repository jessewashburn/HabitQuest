import { Slot } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import Navbar from '../components/Navbar';
import { AuthProvider } from '../contexts/AuthContext';
import { HabitsProvider } from '../contexts/HabitsContext';

export default function Layout() {
  return (
    <AuthProvider>
      <HabitsProvider>
        <View style={{ flex: 1 }}>
          <Navbar />
          <Slot />
        </View>
      </HabitsProvider>
    </AuthProvider>
  );
}
