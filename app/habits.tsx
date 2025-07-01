import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styles from './habits.styles';

type Habit = {
  id: string;
  name: string;
  category: 'Health' | 'Productivity' | 'Spiritual';
  note?: string;
  isCompleted: boolean;
  streak: number;
  points: number;
};

const initialHabits: Habit[] = [
  { id: '1', name: 'Drink 8 glasses of water', category: 'Health', note: 'Stay hydrated!', isCompleted: false, streak: 5, points: 10 },
  { id: '2', name: 'Study 2 hours', category: 'Productivity', isCompleted: true, streak: 3, points: 20 },
  { id: '3', name: 'Morning meditation', category: 'Spiritual', isCompleted: false, streak: 10, points: 15 },
  { id: '4', name: 'Exercise 30 minutes', category: 'Health', isCompleted: false, streak: 2, points: 12 },
  { id: '5', name: 'Plan daily goals', category: 'Productivity', isCompleted: true, streak: 6, points: 9 },
  { id: '6', name: 'Read 10 pages', category: 'Productivity', isCompleted: false, streak: 4, points: 11 },
  { id: '7', name: 'Practice gratitude', category: 'Spiritual', isCompleted: true, streak: 7, points: 13 },
  { id: '8', name: 'Stretch in the morning', category: 'Health', isCompleted: false, streak: 1, points: 6 },
  { id: '9', name: 'Journal before bed', category: 'Spiritual', isCompleted: false, streak: 5, points: 14 },
  { id: '10', name: 'No social media after 9pm', category: 'Productivity', isCompleted: false, streak: 2, points: 8 },
  { id: '11', name: 'Call a friend', category: 'Spiritual', isCompleted: false, streak: 1, points: 7 },
  { id: '12', name: 'Cook a healthy meal', category: 'Health', isCompleted: true, streak: 3, points: 10 },
  { id: '13', name: 'Review class notes', category: 'Productivity', isCompleted: true, streak: 6, points: 16 },
  { id: '14', name: 'Affirmations', category: 'Spiritual', isCompleted: false, streak: 5, points: 9 },
  { id: '15', name: 'Sleep 8 hours', category: 'Health', isCompleted: false, streak: 2, points: 10 },
  { id: '16', name: 'Inbox Zero', category: 'Productivity', isCompleted: true, streak: 4, points: 7 },
  { id: '17', name: 'Donate or help someone', category: 'Spiritual', isCompleted: false, streak: 1, points: 12 },
  { id: '18', name: 'Meal prep for tomorrow', category: 'Health', isCompleted: true, streak: 2, points: 11 },
  { id: '19', name: 'Watch a TED Talk', category: 'Productivity', isCompleted: false, streak: 3, points: 9 },
  { id: '20', name: 'Reflect on goals', category: 'Spiritual', isCompleted: false, streak: 2, points: 8 },
];

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);

  const toggleHabit = (id: string) => {
    const updated = habits.map(habit =>
      habit.id === id ? { ...habit, isCompleted: !habit.isCompleted } : habit
    );
    setHabits(updated);
  };

  return (
    <LinearGradient
      colors={['#F5EDD8', '#6BA8D6']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <View style={styles.narrowContainer}>
          <Text style={styles.title}>Your Daily Habits</Text>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {habits.map(habit => (
              <View key={habit.id} style={[styles.card, habit.isCompleted && styles.completedCard]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.habitName, habit.isCompleted && styles.completedText]}>{habit.name}</Text>
                  <Text style={styles.category}>{habit.category}</Text>
                  {habit.note && <Text style={styles.note}>{habit.note}</Text>}
                  <Text style={styles.meta}>🔥 Streak: {habit.streak} days</Text>
                  <Text style={styles.meta}>🏆 Points: {habit.points}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.checkbox, habit.isCompleted && styles.checkedBox]}
                  onPress={() => toggleHabit(habit.id)}
                >
                  {habit.isCompleted && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
}
