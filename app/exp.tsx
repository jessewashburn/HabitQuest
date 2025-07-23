import { useTheme } from '@/hooks/ThemeContext';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function EXPPage() {
  const { theme, colors } = useTheme();

  const expData = {
    totalExp: 1250,
    categoryExp: {
      Fitness: 700,
      Mindfulness: 350,
      Productivity: 200,
    },
    streakLength: 12 ,
  };

  const lightBackground = '#e7f0f9'; // matches logo's soft blue background

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme === 'dark' ? colors.background : lightBackground },
      ]}
    >
      <Text style={[styles.header, { color: colors.text }]}>
        Experience Points
      </Text>

      <View style={[styles.card, { backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff' }]}>
        <Text style={[styles.title, { color: colors.text }]}>Total EXP</Text>
        <Text style={[styles.value, { color: '#0066cc' }]}>{expData.totalExp}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff' }]}>
        <Text style={[styles.title, { color: colors.text }]}>Category EXP</Text>
        {Object.entries(expData.categoryExp).map(([category, value]) => (
          <Text key={category} style={[styles.categoryLine, { color: '#333' }]}>
            {category}: {value}
          </Text>
        ))}
      </View>

      <View style={[styles.card, { backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff' }]}>
        <Text style={[styles.title, { color: colors.text }]}>Streak Length 🔥</Text>
        <Text style={[styles.value, { color: '#f4b400' }]}>{expData.streakLength} Days</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    minHeight: '100%',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  categoryLine: {
    fontSize: 16,
    marginBottom: 4,
  },
});