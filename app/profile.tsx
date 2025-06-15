import { useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';
import styles from './profile.styles.ts';

interface User {
  name: string;
  points: number;
  level: number;
}

interface ProfileScreenProps {
  user?: User;
  readOnly?: boolean;
}

export default function ProfileScreen({ user, readOnly = false }: ProfileScreenProps) {
  const [theme, setTheme] = useState("Light");

  const userData = user ?? {
    name: "User Profile",
    points: 0,
    level: 1,
  };

  const handleSave = () => {
    if (readOnly) return;
    Alert.alert("Preferences saved", `Theme = ${theme}`);
  };

  const handleLogout = () => {
    if (readOnly) return;
    Alert.alert("Logging out...");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{userData.name}</Text>
      <Text style={styles.text}>Points: {userData.points}</Text>
      <Text style={styles.text}>Level: {userData.level}</Text>

      <Text style={styles.text}>Theme: {theme}</Text>
      <Button
        title={`Switch to ${theme === 'Light' ? 'Dark' : 'Light'} Theme`}
        onPress={() => setTheme(theme === 'Light' ? 'Dark' : 'Light')}
        disabled={readOnly}
      />

      {!readOnly && (
        <>
          <Button title="Save Preferences" onPress={handleSave} />
          <Button title="Log Out" onPress={handleLogout} />
        </>
      )}
    </View>
  );
}
