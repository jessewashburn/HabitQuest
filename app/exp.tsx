// app/exp.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ExpPage() {
  // Placeholder data (replace with real context or API later)
  const totalExp = 1520;
  const categoryExp = {
    Health: 620,
    Productivity: 500,
    Mindfulness: 400,
  };
  const streakLength = 12; // days

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎖️ My EXP</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Total EXP</Text>
        <Text style={styles.value}>{totalExp}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Category EXP</Text>
        {Object.entries(categoryExp).map(([category, exp]) => (
          <View key={category} style={styles.categoryRow}>
            <Text style={styles.category}>{category}</Text>
            <Text style={styles.exp}>{exp}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🔥 Streak Length</Text>
        <Text style={styles.value}>{streakLength} days</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f0f4ff',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1f3c88',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1f3c88',
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  category: {
    fontSize: 16,
    color: '#444',
  },
  exp: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f3c88',
  },
});