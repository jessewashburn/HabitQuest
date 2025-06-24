/// --- app/index.tsx ---
import React from 'react';
import { Text, Image, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {
  return (
    <LinearGradient
      colors={['#C6D8FF', '#FFFFFF']}
      style={styles.background}
    >
      <View style={styles.content}>
        <Image source={require('../assets/logo.jpg')} style={styles.logo} />
        <Text style={styles.title}>Welcome to Habit Quest</Text>
        <Text style={styles.subtitle}>Track your habits. Level up your life.</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    alignItems: 'center'
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 50
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D4E85',
  },
  subtitle: {
    fontSize: 18,
    color: '#2D4E85'
  }
});
