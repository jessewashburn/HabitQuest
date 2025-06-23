import { Image, ScrollView, Text, View } from 'react-native';
import styles from './index.styles.ts';

export default function Home() {
  const completedHabits = ['Morning meditation', 'Exercise 30 minutes'];
  const dueHabits = ['Drink 8 glasses of water', 'Study 2 hours'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('./assets/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Habit Quest</Text>
      <Text style={styles.subtitle}>Level Up Your Life – One Habit at a Time</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}> Completed Today</Text>
        {completedHabits.map((habit, index) => (
          <Text key={index} style={styles.habitItem}>{habit}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}> Due Today</Text>
        {dueHabits.map((habit, index) => (
          <Text key={index} style={styles.habitItem}>{habit}</Text>
        ))}
      </View>
    </ScrollView>
  );
}
