import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import { authAPI } from '../services/api';
import styles from './index.styles';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    general?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const clearErrors = () => {
    setErrors({});
  };

  const handleRegister = async () => {
    setLoading(true);
    clearErrors();
    
    // Basic validation
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrors({ general: 'Please fill in all fields' });
      setLoading(false);
      return;
    }

    // Username validation
    if (username.trim().length < 3) {
      setErrors({ username: 'Username must be at least 3 characters long' });
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrors({ email: 'Please enter a valid email address' });
      setLoading(false);
      return;
    }

    // Password validation
    if (password.length < 6) {
      setErrors({ password: 'Password must be at least 6 characters long' });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      console.log('📝 Attempting AWS registration with real API...');
      const newUser = await authAPI.register({
        username: username.trim(),
        email: email.trim(),
        password: password.trim()
      });
      
      console.log('✅ Registration successful:', newUser);
      router.back();
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      setErrors({ general: error.message || 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    router.back();
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
        <Text style={styles.title}>Join Habit Quest</Text>
        <Text style={styles.subtitle}>Start your journey to better habits</Text>

        <View style={styles.formContainer}>
          {errors.general && (
            <Text style={styles.errorText}>{errors.general}</Text>
          )}
          
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (errors.username) clearErrors();
            }}
            style={[styles.input, errors.username && styles.inputError]}
            autoCapitalize="none"
            editable={!loading}
          />
          {errors.username && (
            <Text style={styles.errorText}>{errors.username}</Text>
          )}
          
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) clearErrors();
            }}
            style={[styles.input, errors.email && styles.inputError]}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}
          
          <TextInput
            placeholder="Password (min 6 characters)"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) clearErrors();
            }}
            secureTextEntry
            style={[styles.input, errors.password && styles.inputError]}
            editable={!loading}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
          
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword) clearErrors();
            }}
            secureTextEntry
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            editable={!loading}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}

          <Pressable
            style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </Pressable>

          <Text style={styles.orText}>Already have an account?</Text>

          <Pressable
            style={[styles.button, styles.secondaryButton]}
            onPress={handleNavigateToLogin}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}
