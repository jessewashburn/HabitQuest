import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { MdOutlineEdit } from 'react-icons/md';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  const [theme, setTheme] = useState("Light");
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [userName, setUserName] = useState("Enter a username");
  const [isEditingName, setIsEditingName] = useState(false);

  const userData = user ?? {
    name: userName,
    points: 0,
    level: 1,
    profileImage: "https://static.vecteezy.com/system/resources/previews/000/574/512/original/vector-sign-of-user-icon.jpg",
  };

  const handleSave = () => {
    if (readOnly) return;
    Alert.alert("Preferences saved", `Theme = ${theme}`);
  };

  const handleLogout = () => {
    if (readOnly) return;
    Alert.alert("Logging out...");
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

  return (
    <LinearGradient
      colors={['#F0E8D0', '#7BB8CC']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <View style={styles.narrowContainer}>
          <Text style={styles.title}>Profile</Text>
        </View>
        <View style={styles.contentContainer}>
          <TouchableOpacity 
            onPress={() => !readOnly && setIsEditingName(!isEditingName)}
            disabled={readOnly}
          >
            {isEditingName && !readOnly ? (
              <TextInput
                style={styles.nameInput}
                value={userName}
                onChangeText={setUserName}
                onBlur={() => setIsEditingName(false)}
                onSubmitEditing={() => setIsEditingName(false)}
                autoFocus
                placeholder="Enter your name"
              />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={[styles.text, styles.nameText]}>
                  {userName}
                </Text>
                {!readOnly && <MdOutlineEdit size={16} color="#2D4E85" />}
              </View>
            )}
          </TouchableOpacity>
          
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
          
          <TouchableOpacity
            style={[styles.button, readOnly && styles.buttonDisabled]}
            onPress={() => setTheme(theme === 'Light' ? 'Dark' : 'Light')}
            disabled={readOnly}
          >
            <Text style={styles.buttonText}>
              Switch to {theme === 'Light' ? 'Dark' : 'Light'} Theme
            </Text>
          </TouchableOpacity>

          {!readOnly && (
            <>
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Save Preferences</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.button, styles.buttonDanger]} onPress={handleLogout}>
                <Text style={styles.buttonText}>Log Out</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}
