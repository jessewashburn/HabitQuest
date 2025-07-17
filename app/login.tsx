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
  const [errors, setErrors] = useState<{email?: string, password?: string, general?: string}>({});
  const { login } = useAuth();

  const clearErrors = () => {
    setErrors({});
  };

  const handleLogin = async () => {
    clearErrors();
    
    // Validation
    const newErrors: {email?: string, password?: string, general?: string} = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
      console.log('🚨 About to show alert with message:', error.message);
      setErrors({ general: error.message || 'Invalid credentials' });
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
          {errors.general && (
            <Text style={styles.errorText}>{errors.general}</Text>
          )}
          
          <TextInput
            placeholder="Email address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) clearErrors();
            }}
            style={[styles.input, errors.email && styles.inputError]}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            editable={!loading}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}
          
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) clearErrors();
            }}
            secureTextEntry
            style={[styles.input, errors.password && styles.inputError]}
            autoComplete="password"
            editable={!loading}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

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
