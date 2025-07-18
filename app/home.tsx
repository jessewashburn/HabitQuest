import { LinearGradient } from 'expo-linear-gradient';
import { Image, ScrollView, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useHabits } from '../contexts/HabitsContext';
import styles from './index.styles';

export default function Home() {
  const { user } = useAuth();
  const { getCompletedHabits, getDueHabits, loading, error } = useHabits();
  
  const completedHabits = getCompletedHabits();
  const dueHabits = getDueHabits();

  return (
    <LinearGradient
      colors={['#E8F0FF', '#8BB3E8']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.gradientBackground}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('../assets/images/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome back, {user?.username || 'User'}!</Text>
        <Text style={styles.subtitle}>Level Up Your Life – One Habit at a Time</Text>
        
        <View style={styles.statsContainer}>
          {loading ? (
            <Text style={styles.statsText}>Loading your habits...</Text>
          ) : error ? (
            <Text style={styles.statsText}>Error loading habits</Text>
          ) : (
            <Text style={styles.statsText}>
              Today's Progress: {completedHabits.length}/{completedHabits.length + dueHabits.length} habits completed
            </Text>
          )}
        </View>

        <View style={styles.sectionsContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Due Today</Text>
            {loading ? (
              <Text style={styles.habitItem}>Loading...</Text>
            ) : dueHabits.length > 0 ? (
              dueHabits.map((habit, index) => (
                <Text key={habit.id || index} style={styles.habitItem}>{habit.name}</Text>
              ))
            ) : (
              <Text style={styles.habitItem}>All habits completed! 🎉</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✅ Completed Today</Text>
            {loading ? (
              <Text style={styles.habitItem}>Loading...</Text>
            ) : completedHabits.length > 0 ? (
              completedHabits.map((habit, index) => (
                <Text key={habit.id || index} style={styles.habitItem}>{habit.name}</Text>
              ))
            ) : (
              <Text style={styles.habitItem}>No habits completed yet today</Text>
            )}
          </View>
        </View>

      </ScrollView>
    </LinearGradient>
  );
}
