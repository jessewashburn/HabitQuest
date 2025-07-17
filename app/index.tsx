import { useTheme } from '@/hooks/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import styles from './index.styles';

export default function Welcome() {
  const { colors } = useTheme();
  const { isAuthenticated } = useAuth();
  const handleGetStarted = () => {
    router.push('./login');
  };
  return (
    <LinearGradient
      colors={colors.gradient as [string, string]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.gradientBackground}
    >
      <View style={[styles.container, colors.background !== '#FFFFFF' && { backgroundColor: colors.background }]}> 
        <Image
          source={require('../assets/images/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: colors.text }]}>Habit Quest</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>Level Up Your Life – One Habit at a Time</Text>
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
