import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useHabits } from '../contexts/HabitsContext';
import { habitsAPI } from '../services/api/habits';
import { getUserProfile, UserProfile } from '../services/api/users';
import styles from './index.styles';

export default function Home() {
  const { user } = useAuth();
  const { getCompletedHabits, getDueHabits, loading, error } = useHabits();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [completingTask, setCompletingTask] = useState<string | null>(null);
  
  const completedHabits = getCompletedHabits();
  const dueHabits = getDueHabits();

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) {
        setProfile(null);
        setProfileLoading(false);
        return;
      }
      
      try {
        setProfileLoading(true);
        const userProfile = await getUserProfile(user.id);
        console.log('📊 User Profile Data:', JSON.stringify(userProfile, null, 2));
        console.log('📋 Habits count:', userProfile.habits?.length || 0);
        setProfile(userProfile);
      } catch (err) {
        console.error('Failed to load user profile:', err);
        Alert.alert('Error', `Failed to load user profile: ${err.message}`);
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [user?.id]);

  // Function to complete a habit task
  const completeHabitTask = async (taskId: string, habitName: string) => {
    try {
      setCompletingTask(taskId);
      await habitsAPI.completeHabitTask(taskId);
      
      // Refresh profile to get updated levels/experience
      const updatedProfile = await getUserProfile(user?.id);
      setProfile(updatedProfile);
      
      Alert.alert('Success!', `Completed ${habitName}! You earned XP!`);
    } catch (err) {
      console.error('Failed to complete habit task:', err);
      Alert.alert('Error', 'Failed to complete habit task');
    } finally {
      setCompletingTask(null);
    }
  };

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
        {profileLoading ? (
          <Text style={styles.subtitle}>Loading your progress...</Text>
        ) : profile ? (
          <View>
            <Text style={styles.subtitle}>Level {profile.levels.totalLevel} • {profile.experience.totalExperience} XP</Text>
            <Text style={styles.subtitle}>Today: +{profile.experience.todayExperience} XP</Text>
          </View>
        ) : (
          <Text style={styles.subtitle}>Level Up Your Life – One Habit at a Time</Text>
        )}
        
        <View style={styles.statsContainer}>
          {loading ? (
            <Text style={styles.statsText}>Loading your habits...</Text>
          ) : error ? (
            <Text style={styles.statsText}>Error loading habits</Text>
          ) : (
            <Text style={styles.statsText}>
              Today&apos;s Progress: {completedHabits.length}/{completedHabits.length + dueHabits.length} habits completed
            </Text>
          )}
        </View>

        <View style={styles.sectionsContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Today’s Habit Tasks</Text>
            {profileLoading ? (
              <Text style={styles.habitItem}>Loading your tasks...</Text>
            ) : profile?.habits && profile.habits.length > 0 ? (
              profile.habits.map((habitData) => {
                console.log('🔍 Processing habit:', habitData.habitName, 'Task completed:', habitData.habitTask?.isCompleted);
                const isCompleted = habitData.habitTask?.isCompleted || false;
                const isCompleting = completingTask === habitData.habitTask?.id;
                
                return (
                  <View key={habitData.habitId} style={[styles.habitTaskItem, isCompleted && styles.completedTaskItem]}>
                    <View style={styles.habitTaskInfo}>
                      <Text style={[styles.habitTaskName, isCompleted && styles.completedTaskName]}>
                        {habitData.habitName}
                      </Text>
                      <Text style={styles.habitCategory}>
                        {habitData.habitDetails?.category?.name || 'General'}
                      </Text>
                    </View>
                    
                    {isCompleted ? (
                      <Text style={styles.completedBadge}>✓ Done</Text>
                    ) : habitData.habitTask?.id ? (
                      <TouchableOpacity 
                        style={[styles.completeButton, isCompleting && styles.completingButton]}
                        onPress={() => completeHabitTask(habitData.habitTask.id, habitData.habitName)}
                        disabled={isCompleting}
                      >
                        {isCompleting ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text style={styles.completeButtonText}>Complete</Text>
                        )}
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.completedBadge}>No task</Text>
                    )}
                  </View>
                );
              })
            ) : !profileLoading && dueHabits.length > 0 ? (
              // Fallback: show habits from HabitsContext if no profile data
              <View>
                <Text style={styles.habitItem}>Using fallback habit data:</Text>
                {dueHabits.map((habit, index) => (
                  <View key={habit.id || index} style={styles.habitTaskItem}>
                    <View style={styles.habitTaskInfo}>
                      <Text style={styles.habitTaskName}>{habit.name}</Text>
                      <Text style={styles.habitCategory}>Active Habit</Text>
                    </View>
                    <Text style={styles.completedBadge}>Legacy</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View>
                <Text style={styles.habitItem}>No habit tasks for today</Text>
                {profile && (
                  <Text style={styles.habitItem}>Debug: Profile loaded, habits count: {profile.habits?.length || 0}</Text>
                )}
                {!profile && !profileLoading && (
                  <Text style={styles.habitItem}>Debug: No profile data loaded</Text>
                )}
              </View>
            )}
          </View>

          {profile?.levels.categoryLevels && profile.levels.categoryLevels.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🏆 Category Levels</Text>
              {profile.levels.categoryLevels.map((category: any, index) => (
                <View key={index} style={styles.categoryLevelItem}>
                  <Text style={styles.categoryName}>{category.categoryName}</Text>
                  <Text style={styles.categoryLevel}>Level {category.level} • {category.experience} XP</Text>
                </View>
              ))}
            </View>
          )}
        </View>

      </ScrollView>
    </LinearGradient>
  );
}
