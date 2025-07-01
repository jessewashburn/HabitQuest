import { Slot } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import Navbar from '../components/Navbar';
import { AuthProvider } from '../contexts/AuthContext';

export default function Layout() {
  return (
    <AuthProvider>
      <View style={{ flex: 1 }}>
        <Navbar />
        <Slot />
      </View>
    </AuthProvider>
  );
}
