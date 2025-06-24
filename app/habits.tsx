import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet } from 'react-native';

type Habit = {
  id: string;
  title: string;
  category: string;
  description: string;
  streak: number;
  points: number;
  isEnabled: boolean;
};

const initialHabits: Habit[] = [
  {
    id: '1',
    title: 'Drink 8 glasses of water',
    category: 'Health',
    description: 'Stay hydrated!',
    streak: 5,
    points: 10,
    isEnabled: false,
  },
  {
    id: '2',
    title: 'Study 2 hours',
    category: 'Productivity',
    description: 'Focus and learn',
    streak: 3,
    points: 20,
    isEnabled: true,
  },
  {
    id: '3',
    title: 'Morning meditation',
    category: 'Spiritual',
    description: 'Clear your mind',
    streak: 10,
    points: 15,
    isEnabled: false,
  },
  {
    id: '4',
    title: 'Exercise 30 minutes',
    category: 'Health',
    description: 'Get moving!',
    streak: 2,
    points: 12,
    isEnabled: false,
  },
  {
    id: '5',
    title: 'Plan daily goals',
    category: 'Productivity',
    description: 'Start with clarity',
    streak: 6,
    points: 9,
    isEnabled: true,
  },
  {
    id: '6',
    title: 'Read 10 pages',
    category: 'Growth',
    description: 'Learn something new',
    streak: 4,
    points: 11,
    isEnabled: false,
  },
  {
    id: '7',
    title: 'Stretch for 10 minutes',
    category: 'Health',
    description: 'Loosen up your body',
    streak: 1,
    points: 7,
    isEnabled: false,
  },
  {
    id: '8',
    title: 'No phone for 1 hour',
    category: 'Focus',
    description: 'Digital detox',
    streak: 2,
    points: 13,
    isEnabled: true,
  },
  {
    id: '9',
    title: 'Sleep 8 hours',
    category: 'Health',
    description: 'Rest fully',
    streak: 3,
    points: 18,
    isEnabled: false,
  },
  {
    id: '10',
    title: 'Call a loved one',
    category: 'Social',
    description: 'Stay connected',
    streak: 1,
    points: 5,
    isEnabled: false,
  },
  {
    id: '11',
    title: 'Journal your thoughts',
    category: 'Mental Health',
    description: 'Reflect on your day',
    streak: 2,
    points: 10,
    isEnabled: false,
  },
  {
    id: '12',
    title: 'Practice gratitude',
    category: 'Spiritual',
    description: 'Write 3 things you’re thankful for',
    streak: 6,
    points: 8,
    isEnabled: false,
  },
  {
    id: '13',
    title: 'Review finances',
    category: 'Finance',
    description: 'Check your spending',
    streak: 3,
    points: 14,
    isEnabled: false,
  },
  {
    id: '14',
    title: 'Declutter 1 item',
    category: 'Minimalism',
    description: 'Keep things simple',
    streak: 2,
    points: 7,
    isEnabled: true,
  },
  {
    id: '15',
    title: 'Cook a meal at home',
    category: 'Health',
    description: 'Eat clean',
    streak: 4,
    points: 12,
    isEnabled: false,
  },
  {
    id: '16',
    title: 'Limit sugar intake',
    category: 'Health',
    description: 'Make better choices',
    streak: 3,
    points: 9,
    isEnabled: false,
  },
  {
    id: '17',
    title: 'Clean up workspace',
    category: 'Productivity',
    description: 'Tidy environment = clear mind',
    streak: 1,
    points: 6,
    isEnabled: false,
  },
  {
    id: '18',
    title: 'Help someone',
    category: 'Kindness',
    description: 'Spread good energy',
    streak: 2,
    points: 11,
    isEnabled: false,
  },
  {
    id: '19',
    title: 'Listen to an educational podcast',
    category: 'Growth',
    description: 'Fuel your brain',
    streak: 3,
    points: 10,
    isEnabled: false,
  },
  {
    id: '20',
    title: 'Do one creative thing',
    category: 'Creativity',
    description: 'Express yourself',
    streak: 2,
    points: 10,
    isEnabled: false,
  },
];

export default function Habits() {
  const [habits, setHabits] = useState(initialHabits);

  const toggleHabit = (id: string) => {
    const updated = habits.map((habit) =>
      habit.id === id ? { ...habit, isEnabled: !habit.isEnabled } : habit
    );
    setHabits(updated);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Daily Habits</Text>
      {habits.map(habit => (
        <View key={habit.id} style={styles.card}>
          <View style={{ flex: 1 }}>
            <Text style={styles.habitName}>{habit.name}</Text>
            <Text style={styles.category}>{habit.category}</Text>
            {habit.note && <Text style={styles.note}>{habit.note}</Text>}
            <Text style={styles.meta}>🔥 Streak: {habit.streak} days</Text>
            <Text style={styles.meta}>🏆 Points: {habit.points}</Text>
          </View>
          <Switch
            value={habit.isCompleted}
            onValueChange={() => toggleHabit(habit.id)}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
    marginBottom: 16,
    alignItems: 'center',
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
  },
  category: {
    fontStyle: 'italic',
    color: '#555',
  },
  note: {
    color: '#333',
  },
  meta: {
    fontSize: 12,
    color: '#888',
  },
});
