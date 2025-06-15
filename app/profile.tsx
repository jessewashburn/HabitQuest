import { useState } from 'react';
import { Alert, Button, Image, Text, View } from 'react-native';
import styles from './profile.styles.ts';

interface User {
  name: string;
  points: number;
  level: number;
  profileImage?: string;
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
    profileImage: "https://private-user-images.githubusercontent.com/142361664/453683987-afde7c2b-8220-492a-8ab0-cb6c8e247725.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTAwMTQxNTQsIm5iZiI6MTc1MDAxMzg1NCwicGF0aCI6Ii8xNDIzNjE2NjQvNDUzNjgzOTg3LWFmZGU3YzJiLTgyMjAtNDkyYS04YWIwLWNiNmM4ZTI0NzcyNS5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwNjE1JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDYxNVQxODU3MzRaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT03NzM3OThiYzdlOTY2ZTIwODFiODk3YzY2ZmQwYmIyMTljYmQ1NzRhZGFkNWViNGE4ZjQxMDEwMDEwYjhkNGJkJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.8poW-ufKISgEsdm4oO98JdyzMOui6ddmeeU5GYlpnLs",
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
      <Image
  source={{ uri: userData.profileImage }}
  style={styles.profileImage}
/>

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
