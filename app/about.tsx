import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function About() {
  return (
    <LinearGradient
      colors={['#FFFFFF', '#C6D8FF']} // Reversed pattern
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>About Habit Quest</Text>
        <Text style={styles.text}>
          Habit Quest is a fun, gamified habit-tracking platform that helps you stay accountable and grow daily.
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  content: {
    alignItems: 'center'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2D4E85',
    marginBottom: 12
  },
  text: {
    fontSize: 16,
    color: '#2D4E85',
    textAlign: 'center'
  }
});
