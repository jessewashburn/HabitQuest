import { Auth } from 'aws-amplify';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Alert, Button, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MdOutlineEdit } from 'react-icons/md';

import styles from './profile.styles.ts';
import { API_BASE_URL } from './config.ts';
import { useTheme } from '@/hooks/ThemeContext.tsx';
import { router } from 'expo-router';
import { useState } from 'react';
import { MdOutlineEdit } from 'react-icons/md';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import styles from './profile.styles';

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
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState<User>(user ?? {
    name: 'User Profile',
    points: 0,
    level: 1,
    profileImage: 'https://static.vecteezy.com/system/resources/previews/000/574/512/original/vector-sign-of-user-icon.jpg',
  });

  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { theme, setTheme } = useTheme();
  const { user: authUser, logout } = useAuth();

  const userData = user ?? {
    name: authUser?.username || userName,
    points: 0,
    level: 1,
    profileImage: "https://static.vecteezy.com/system/resources/previews/000/574/512/original/vector-sign-of-user-icon.jpg",
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const session = await Auth.currentSession();
        const token = session.getAccessToken().getJwtToken();

        const res = await fetch(`${API_BASE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setUserData({
          name: data.username,
          points: data.points ?? 0,
          level: data.level ?? 1,
          profileImage: data.profileImage ?? userData.profileImage,
        });

        setUsername(data.username);
        setEmail(data.email);
        if (data.theme) setTheme(data.theme);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
  const handleLogout = () => {
    if (readOnly) return;
    logout();
    router.replace('/login');
  };

  const pickImage = async () => {
    if (readOnly) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (readOnly) return;

    if (!username.trim() || !email.includes('@')) {
      Alert.alert('Invalid input', 'Please enter a valid username and email.');
      return;
    }

    try {
      setSaving(true);
      setSaveSuccess(false);

      const token = (await Auth.currentSession()).getAccessToken().getJwtToken();
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          email,
          theme,
        }),
      });

      if (response.ok) {
        setSaveSuccess(true);
      } else {
        const errorData = await response.json();
        console.error('Save failed:', errorData);
        Alert.alert('Error', 'Failed to save profile.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (readOnly) return;
    try {
      await Auth.signOut();
      Alert.alert('Logged out successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error logging out');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{error}</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#F0E8D0', '#7BB8CC']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => !readOnly && setIsEditingName(!isEditingName)}
          disabled={readOnly}
        >
          {isEditingName && !readOnly ? (
            <TextInput
              style={styles.nameInput}
              value={username}
              onChangeText={setUsername}
              onBlur={() => setIsEditingName(false)}
              onSubmitEditing={() => setIsEditingName(false)}
              autoFocus
            />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.text}>{username}</Text>
              {!readOnly && <MdOutlineEdit size={16} color="#2D4E85" />}
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.text}>Email:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          editable={!readOnly}
          keyboardType="email-address"
        />

        <Text style={styles.text}>Points: {userData.points}</Text>
        <Text style={styles.text}>Level: {userData.level}</Text>

        <TouchableOpacity onPress={pickImage} disabled={readOnly}>
          <Image
            source={{ uri: profileImageUri || userData.profileImage }}
            style={[styles.profileImage, readOnly && styles.disabledImage]}
          />
          {!readOnly && <Text style={styles.imageHint}>Tap to change photo</Text>}
        </TouchableOpacity>

        <Text style={styles.text}>Theme: {theme}</Text>
        <Button
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Theme`}
          onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          disabled={readOnly}
        />

        {!readOnly && (
          <>
            {saveSuccess && <Text style={{ color: 'green' }}>Saved successfully!</Text>}

            <Button
              title={saving ? 'Saving...' : 'Save Preferences'}
              onPress={handleSave}
              disabled={saving}
            />
            <Button title="Log Out" onPress={handleLogout} />
          </>
        )}
      </View>
    </LinearGradient>
  );
}
