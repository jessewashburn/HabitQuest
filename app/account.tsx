import { signUp } from 'aws-amplify/auth';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import styles from './account.styles.ts';

export default function CreateAccount({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCreateAccount = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      await signUp({
        username,
        password,
        options: {
        userAttributes: {
          email,
        }
        },
      });

      Alert.alert('Success', 'Account created! Please log in.');
      navigation.navigate('Login');
    } catch (err: any) {
      Alert.alert('Sign-up failed', err.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join Habit Quest and start tracking!</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <Button title="Create Account" onPress={handleCreateAccount} />
      </View>

      <Text style={styles.orText}>Already have an account?</Text>

      <View style={styles.buttonContainer}>
        <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
      </View>
    </View>
  );
}
