import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { Alert, Button, GestureResponderEvent, Text, TextInput, View } from 'react-native';
import styles from './index.styles.ts';

export default function Login({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await Auth.signIn(username, password);
      Alert.alert('Success', 'You are now logged in!');
    } catch (err: any) {
      Alert.alert('Login failed', err.message || 'Something went wrong');
    }
  };

  const handleNavigateToCreateNewAccount = () => {
    navigation.navigate('Create New Account'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Habit Quest</Text>
      <Text style={styles.subtitle}>Track your habits. Level up your life.</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} />
      </View>

      <Text style={styles.orText}>or</Text>

      <View style={styles.buttonContainer}>
        <Button title="Create New Account" onPress={handleNavigateToCreateNewAccount} />
      </View>
    </View>
  );
}
