import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Pressable, Text, TextInput, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import styles from './index.styles';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      console.log('🔑 Attempting AWS login with real API...');
      const result = await authAPI.login({ 
        email: email.trim(), 
        password: password.trim() 
      });
      
      console.log('✅ Login successful:', result);
      // Use email as username since backend only returns { message, token }
      login(email.trim());
      router.replace('/home');
      Alert.alert('Success', 'Login successful!');
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
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
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            editable={!loading}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            autoComplete="password"
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
