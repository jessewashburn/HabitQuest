import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const initialHabits = [
    // Mental Health
    { id: '1', title: 'Meditate for 10 minutes', category: 'Mental Health', description: 'Calm your mind', streak: 0, points: 10, isEnabled: false },
    { id: '2', title: 'Journal your thoughts', category: 'Mental Health', description: 'Reflect on your day', streak: 0, points: 10, isEnabled: false },
    { id: '3', title: 'Practice gratitude', category: 'Mental Health', description: 'List 3 things you’re thankful for', streak: 0, points: 8, isEnabled: false },
    { id: '4', title: 'Limit social media to 30 minutes', category: 'Mental Health', description: 'Reduce stress and anxiety', streak: 0, points: 12, isEnabled: false },
    { id: '5', title: 'Do a digital detox for 1 hour', category: 'Mental Health', description: 'Reset your brain', streak: 0, points: 10, isEnabled: false },
    { id: '6', title: 'Write 1 affirmation', category: 'Mental Health', description: 'Boost self-esteem', streak: 0, points: 6, isEnabled: false },
    { id: '7', title: 'Take 3 deep breaths before bed', category: 'Mental Health', description: 'Clear your thoughts', streak: 0, points: 5, isEnabled: false },
    { id: '8', title: 'Avoid negative self-talk', category: 'Mental Health', description: 'Replace with positive phrases', streak: 0, points: 7, isEnabled: false },
    { id: '9', title: 'Compliment yourself in the mirror', category: 'Mental Health', description: 'Build self-confidence', streak: 0, points: 6, isEnabled: false },
    { id: '10', title: 'Listen to calming music', category: 'Mental Health', description: 'Relax your nervous system', streak: 0, points: 8, isEnabled: false },
  
    // Physical Wellness
    { id: '11', title: 'Drink 8 cups of water', category: 'Health', description: 'Stay hydrated', streak: 0, points: 10, isEnabled: false },
    { id: '12', title: 'Get 8 hours of sleep', category: 'Health', description: 'Recharge your body', streak: 0, points: 10, isEnabled: false },
    { id: '13', title: 'Stretch for 10 minutes', category: 'Health', description: 'Improve flexibility', streak: 0, points: 7, isEnabled: false },
    { id: '14', title: 'Go for a 15-minute walk', category: 'Health', description: 'Boost circulation', streak: 0, points: 9, isEnabled: false },
    { id: '15', title: 'Cook a healthy meal', category: 'Health', description: 'Fuel your body right', streak: 0, points: 11, isEnabled: false },
    { id: '16', title: 'Eat 2 servings of vegetables', category: 'Health', description: 'Support immunity', streak: 0, points: 6, isEnabled: false },
    { id: '17', title: 'Do 20 push-ups', category: 'Health', description: 'Build strength', streak: 0, points: 10, isEnabled: false },
    { id: '18', title: 'Take the stairs instead of elevator', category: 'Health', description: 'Increase daily activity', streak: 0, points: 5, isEnabled: false },
    { id: '19', title: 'Track your meals', category: 'Health', description: 'Build healthy awareness', streak: 0, points: 7, isEnabled: false },
    { id: '20', title: 'Avoid sugar for the day', category: 'Health', description: 'Improve energy levels', streak: 0, points: 9, isEnabled: false },
  
    // Academic / School
    { id: '21', title: 'Review class notes for 15 minutes', category: 'School', description: 'Reinforce learning', streak: 0, points: 12, isEnabled: false },
    { id: '22', title: 'Organize your school bag', category: 'School', description: 'Reduce stress', streak: 0, points: 6, isEnabled: false },
    { id: '23', title: 'Plan tomorrow’s to-do list', category: 'School', description: 'Increase productivity', streak: 0, points: 9, isEnabled: false },
    { id: '24', title: 'Study one subject for 30 minutes', category: 'School', description: 'Stay ahead', streak: 0, points: 14, isEnabled: false },
    { id: '25', title: 'Complete all assignments on time', category: 'School', description: 'Avoid backlog', streak: 0, points: 15, isEnabled: false },
    { id: '26', title: 'Read a textbook chapter', category: 'School', description: 'Deepen knowledge', streak: 0, points: 11, isEnabled: false },
    { id: '27', title: 'Watch 1 educational video', category: 'School', description: 'Visual learning boost', streak: 0, points: 7, isEnabled: false },
    { id: '28', title: 'Meet with a study partner', category: 'School', description: 'Boost understanding', streak: 0, points: 8, isEnabled: false },
    { id: '29', title: 'Check assignment deadlines', category: 'School', description: 'Stay organized', streak: 0, points: 5, isEnabled: false },
    { id: '30', title: 'Ask a teacher one question', category: 'School', description: 'Clarify doubts early', streak: 0, points: 10, isEnabled: false }
  ];
  
export default function Habits() {
  const [habits, setHabits] = useState(initialHabits);

  const toggleHabit = (id: string) => {
    setHabits(prev =>
      prev.map(h => h.id === id ? { ...h, isEnabled: !h.isEnabled } : h)
    );
  };

  return (
    <LinearGradient colors={['#C6D8FF', '#FFFFFF']} style={styles.container}>
      <Text style={styles.header}>Your Daily Habits</Text>
      <ScrollView>
        {habits.map(habit => (
          <View key={habit.id} style={styles.habitRow}>
            <View>
              <Text style={styles.title}>{habit.title}</Text>
              <Text style={styles.meta}>{habit.category}</Text>
              <Text style={styles.meta}>🔥 Streak: {habit.streak} days</Text>
              <Text style={styles.meta}>🏆 Points: {habit.points}</Text>
            </View>
            <Switch value={habit.isEnabled} onValueChange={() => toggleHabit(habit.id)} />
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2D4E85'
  },
  habitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#f0f4ff'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D4E85'
  },
  meta: {
    fontSize: 13,
    color: '#555'
  }
});
