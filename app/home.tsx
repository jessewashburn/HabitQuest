import { LinearGradient } from 'expo-linear-gradient';
import { Image, ScrollView, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import styles from './index.styles';

export default function Home() {
  const { user } = useAuth();
  const completedHabits = ['Morning meditation', 'Exercise 30 minutes'];
  const dueHabits = ['Drink 8 glasses of water', 'Study 2 hours'];

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

        <View style={styles.sectionsContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Due Today</Text>
            {dueHabits.map((habit, index) => (
              <Text key={index} style={styles.habitItem}>{habit}</Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✅ Completed Today</Text>
            {completedHabits.map((habit, index) => (
              <Text key={index} style={styles.habitItem}>{habit}</Text>
            ))}
          </View>
        </View>

      </ScrollView>
    </LinearGradient>
  );
}