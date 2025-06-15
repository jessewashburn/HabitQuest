import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import styles from './profile.styles.ts';

export default function ProfileScreen() {
  const [theme, setTheme] = useState("Light");

  const user = {
    name: "User Profile",
    points: 0,
    level: 1,
  };

  const handleSave = () => {
    Alert.alert("Preferences saved", `Theme = ${theme}`);
  };

  const handleLogout = () => {
    Alert.alert("Logging out...");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{user.name}</Text>
      <Text style={styles.text}>Points: {user.points}</Text>
      <Text style={styles.text}>Level: {user.level}</Text>

      <Text style={styles.text}>Theme: {theme}</Text>
      <Button
        title={`Switch to ${theme === 'Light' ? 'Dark' : 'Light'} Theme`}
        onPress={() => setTheme(theme === 'Light' ? 'Dark' : 'Light')}
      />

      <Button title="Save Preferences" onPress={handleSave} />
      <Button title="Log Out" onPress={handleLogout} />
    </View>
  );
}
