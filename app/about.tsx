import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, Text, View } from 'react-native';
import styles from './about.styles';

export default function AboutScreen() {
  return (
    <LinearGradient
      colors={['#F5EDD8', '#6BA8D6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <View style={styles.narrowContainer}>
          <Text style={styles.pageTitle}>About</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionHeader}>What is HabitQuest?</Text>
            <Text style={styles.text}>
              HabitQuest is a habit tracker and game, built to help students and young adults form lasting, healthy routines.
              With point-based progression, habit streaks, and social features, it turns personal growth into an interactive experience.
            </Text>

            <Text style={styles.sectionHeader}>Who Built It?</Text>
            <Text style={styles.text}>
              HabitQuest was created by CTRL+ALT+ELITE, a team of student developers at Towson University. These developers are: Harrison Kunkel, Mohamed Bundu,
              Samuel Kleanthous, and Jesse Washburn.
            </Text>

            <Text style={styles.sectionHeader}>What Makes It Different?</Text>
            <Text style={styles.text}>
              Unlike other to-do apps, HabitQuest combines habit tracking with video game like mechanics, social challenges, and visual progress.
              HabitQuest is tailored for students and young adults, combining structure and fun into one platform.
            </Text>

            <Text style={styles.sectionHeader}>Freemium Model & Student Focus</Text>
            <Text style={styles.text}>
              HabitQuest's core features are free, with optional upgrades like habit themes and avatar customizations that cost a meager price.
              HabitQuest is built with affordability and accessibility in mind, especially for students who are looking to improve discipline
              and academic performance.
            </Text>

            <Text style={styles.sectionHeader}>Game-Inspired Design</Text>
            <Text style={styles.text}>
              Users earn points for completing habits, level up over time, and track their habit streaks.
              With future updates including mini-games and leaderboards, HabitQuest keeps users engaged and bettering themselves every day.
            </Text>
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
}
