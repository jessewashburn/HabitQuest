import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Pressable, Text, TextInput, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import styles from './index.styles';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    
    try {
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      
      if (trimmedUsername === 'admin' && trimmedPassword === 'admin') {
        login(trimmedUsername);
        router.replace('/home');
      } else {
        Alert.alert('Login Failed', 'Invalid credentials. Try admin/admin for testing.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    
    try {
      login('Guest');
      router.replace('/home');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToRegister = () => {
    router.push('./register');
  };

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
        <Text style={styles.title}>Welcome to Habit Quest</Text>
        <Text style={styles.subtitle}>Track your habits. Level up your life.</Text>

        <View style={styles.formContainer}>
          <TextInput
            placeholder="Username (try: admin)"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            autoCapitalize="none"
            editable={!loading}
          />
          <TextInput
            placeholder="Password (try: admin)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            editable={!loading}
          />

          <Pressable
            style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Signing In...' : 'Login'}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.secondaryButton]}
            onPress={handleGuestLogin}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>
              {loading ? 'Signing In...' : 'Continue as Guest'}
            </Text>
          </Pressable>

          <Text style={styles.orText}>Don't have an account?</Text>

          <Pressable
            style={[styles.button, styles.secondaryButton]}
            onPress={handleNavigateToRegister}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}
