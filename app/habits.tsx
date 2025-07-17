import { useTheme } from '@/hooks/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useHabits } from '../contexts/HabitsContext';
import styles from './habits.styles';

export default function HabitsPage() {
  const { colors } = useTheme();
  const [habits, setHabits] = useState<Habit[]>(initialHabits);

  const toggleHabit = (id: string) => {
    const updated = habits.map(habit =>
      habit.id === id ? { ...habit, isCompleted: !habit.isCompleted } : habit
    );
    setHabits(updated);
  };

  return (
    <LinearGradient
      colors={colors.gradient as [string, string]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.gradientBackground}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}> 
        <View style={styles.narrowContainer}>
          <Text style={[styles.title, { color: colors.text }]}>Your Daily Habits</Text>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {habits.map(habit => (
              <View key={habit.id} style={[styles.card, habit.isCompleted && styles.completedCard, { backgroundColor: habit.isCompleted ? (colors.background) : colors.background }]}> 

                <View style={{ flex: 1 }}>
                  <Text style={[styles.habitName, habit.isCompleted && styles.completedText, { color: colors.text }]}>{habit.name}</Text>
                  <Text style={[styles.category, { color: colors.text }]}>{habit.category}</Text>
                  {habit.note && <Text style={[styles.note, { color: colors.text }]}>{habit.note}</Text>}
                  <Text style={[styles.meta, { color: colors.text }]}>🔥 Streak: {habit.streak} days</Text>
                  <Text style={[styles.meta, { color: colors.text }]}>🏆 Points: {habit.points}</Text>
                </View>
                <View style={[styles.checkbox, habit.isCompleted && styles.checkedBox]}>
                  {habit.isCompleted && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
}
