import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import styles from './index.styles';

export default function Welcome() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to main app
    if (isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated]);

  const handleGetStarted = () => {
    router.push('./login');
  };

  // If authenticated, this component won't render due to redirect
  return (
    <LinearGradient
      colors={['#E8F0FF', '#8BB3E8']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <Image
          source={require('../assets/images/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Habit Quest</Text>
        <Text style={styles.subtitle}>Level Up Your Life – One Habit at a Time</Text>

        <View style={styles.formContainer}>
          <Pressable
            style={[styles.button, styles.primaryButton]}
            onPress={handleGetStarted}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}
