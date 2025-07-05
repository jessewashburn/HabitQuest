import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useHabits } from '../contexts/HabitsContext';
import styles from './habits.styles';

export default function HabitsPage() {
  const { habits, toggleHabit } = useHabits();

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
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            style={{ flex: 1 }}
          >
            {habits.map(habit => (
              <TouchableOpacity 
                key={habit.id} 
                style={[styles.card, habit.isCompleted && styles.completedCard]}
                onPress={() => toggleHabit(habit.id)}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.habitName, habit.isCompleted && styles.completedText]}>{habit.name}</Text>
                  <Text style={styles.category}>{habit.category}</Text>
                  {habit.note && <Text style={styles.note}>{habit.note}</Text>}
                  <Text style={styles.meta}>🔥 Streak: {habit.streak} days</Text>
                  <Text style={styles.meta}>🏆 Points: {habit.points}</Text>
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
