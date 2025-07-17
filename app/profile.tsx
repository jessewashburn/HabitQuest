import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { MdOutlineEdit } from 'react-icons/md';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/hooks/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from './config';
import styles from './profile.styles';

// Feature flags - toggle these based on what's available
const USE_BACKEND = false; // Set to true to test live backend connectivity
const USE_MOCK_AWS = false; // Set to true to simulate AWS Auth without real backend
const USE_LOCAL_FALLBACK = true; // Use simple alerts for now

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
  // Feature flags logging
  console.log('[INIT] ProfileScreen component initialized');
  console.log('[CONFIG] Feature flags status:');
  console.log('   USE_BACKEND:', USE_BACKEND);
  console.log('   USE_MOCK_AWS:', USE_MOCK_AWS);
  console.log('   USE_LOCAL_FALLBACK:', USE_LOCAL_FALLBACK);
  console.log('[CONFIG] Component props:');
  console.log('   user:', user);
  console.log('   readOnly:', readOnly);
  console.log('[CONFIG] API Configuration:');
  console.log('   API_BASE_URL:', API_BASE_URL);

  //state variables
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const { theme, setTheme, colors } = useTheme();
  const [userData, setUserData] = useState<User>({
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

  // Current working state (for fallback)
  const [userName, setUserName] = useState("Enter a display name");

  const { user: authUser, logout } = useAuth();
  const router = useRouter();

  //useEffect for fetching profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (USE_BACKEND) {
        console.log('[BACKEND] Starting profile fetch...');
        console.log('[BACKEND] API Base URL:', API_BASE_URL);
        console.log('[BACKEND] Testing live backend connectivity...');
        
        // Original backend code (commented out Auth parts for now)
        try {
          console.log('[AUTH] Attempting to get session (commented out for now)');
          // const session = await Auth.currentSession();
          // const token = session.getAccessToken().getJwtToken();
          console.log('[AUTH] Using mock token for testing');

          const endpoint = `${API_BASE_URL}/api/profile`;
          console.log('[REQUEST] Attempting to fetch from live endpoint:', endpoint);
          
          const headers = { 
            Authorization: `Bearer mock-token`, // Mock token for now
            'X-API-Key': 'UUo4AX1Ikc2gejXqZjpMM9GVvzfbfctn8x4FOI2C',
            'Content-Type': 'application/json'
          };
          console.log('[REQUEST] Using headers with live API key');
          console.log('[REQUEST] Headers:', headers);

          console.log('[NETWORK] Initiating fetch request...');
          const startTime = Date.now();
          
          const res = await fetch(endpoint, { 
            headers,
            method: 'GET'
          });
          
          const responseTime = Date.now() - startTime;
          console.log('[NETWORK] Request completed in', responseTime, 'ms');
          
          console.log('[RESPONSE] Status:', res.status);
          console.log('[RESPONSE] Status Text:', res.statusText);
          console.log('[RESPONSE] OK:', res.ok);
          console.log('[RESPONSE] Headers:', Object.fromEntries(res.headers.entries()));

          if (!res.ok) {
            console.error('[BACKEND] Live backend request failed with status:', res.status);
            
            // Try to get response body for more details
            try {
              const errorText = await res.text();
              console.error('[BACKEND] Error response body:', errorText);
            } catch (bodyError) {
              console.error('[BACKEND] Could not read error response body:', bodyError);
            }
            
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          
          const data = await res.json();
          console.log('[BACKEND] Successfully received data from live backend:', data);

          setUserData({
            name: data.username,
            points: data.points ?? 0,
            level: data.level ?? 1,
            profileImage: data.profileImage ?? userData.profileImage,
          });

          setUsername(data.username);
          setEmail(data.email);
          if (data.theme) setTheme(data.theme);
          
          console.log('[BACKEND] Profile data successfully loaded and applied');
        } catch (err) {
          console.error('[BACKEND] Error fetching profile:', err);
          console.error('[BACKEND] Error details:', {
            message: err instanceof Error ? err.message : String(err),
            stack: err instanceof Error ? err.stack : 'No stack trace',
            name: err instanceof Error ? err.name : 'Unknown error type'
          });
          setError('Failed to load profile data. Please try again.');
        } finally {
          setLoading(false);
          console.log('[BACKEND] Profile fetch completed');
        }
      } else {
        console.log('[LOCAL] Using local fallback mode');
        console.log('[LOCAL] Backend disabled, initializing with local data');
        
        // Fallback: Initialize with user prop or defaults
        if (user) {
          console.log('[LOCAL] Using provided user prop:', user);
          setUserData(user);
          setUsername(user.name);
        } else if (authUser) {
          console.log('[LOCAL] Using authenticated user:', authUser);
          setUserData({
            name: authUser.username,
            points: 0,
            level: 1,
            profileImage: 'https://static.vecteezy.com/system/resources/previews/000/574/512/original/vector-sign-of-user-icon.jpg',
          });
          setUsername(authUser.username);
          setUserName(authUser.username);
        } else {
          console.log('[LOCAL] No user data available, using defaults');
          setUsername(userName);
        }
        setLoading(false);
        console.log('[LOCAL] Local initialization completed');
      }
    };

    fetchProfile();
  }, [user, authUser]);

  //handleSave function with feature flags
  const handleSave = async () => {
    if (readOnly) return;

    console.log('[SAVE] Save operation initiated');
    console.log('[SAVE] Current mode - USE_BACKEND:', USE_BACKEND, 'USE_LOCAL_FALLBACK:', USE_LOCAL_FALLBACK);

    if (USE_BACKEND) {
      console.log('[BACKEND] Using backend save mode');
      console.log('[BACKEND] Validating input data...');
      console.log('[BACKEND] Username:', username, '(length:', username.length, ')');
      console.log('[BACKEND] Email:', email, '(includes @:', email.includes('@'), ')');
      
      // Original backend save code
      if (!username.trim() || !email.includes('@')) {
        console.warn('[VALIDATION] Input validation failed');
        console.warn('[VALIDATION] Username valid:', !!username.trim());
        console.warn('[VALIDATION] Email valid:', email.includes('@'));
        Alert.alert('Invalid input', 'Please enter a valid username and email.');
        return;
      }

      console.log('[VALIDATION] Input validation passed');

      try {
        setSaving(true);
        setSaveSuccess(false);
        console.log('[BACKEND] Starting save operation...');

        console.log('[AUTH] Getting authentication token (commented out for now)');
        // const token = (await Auth.currentSession()).getAccessToken().getJwtToken();
        console.log('[AUTH] Using mock token for testing live backend');

        const endpoint = `${API_BASE_URL}/api/profile`;
        const payload = {
          username,
          email,
          theme,
        };
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer mock-token`, // Mock for now
          'X-API-Key': 'UUo4AX1Ikc2gejXqZjpMM9GVvzfbfctn8x4FOI2C'
        };

        console.log('[REQUEST] Making PUT request to live backend:', endpoint);
        console.log('[REQUEST] Headers with live API key:', headers);
        console.log('[REQUEST] Payload:', payload);

        console.log('[NETWORK] Initiating save request to live backend...');
        const startTime = Date.now();

        const response = await fetch(endpoint, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload),
        });

        const responseTime = Date.now() - startTime;
        console.log('[NETWORK] Save request completed in', responseTime, 'ms');

        console.log('[RESPONSE] Status:', response.status);
        console.log('[RESPONSE] Status Text:', response.statusText);
        console.log('[RESPONSE] OK:', response.ok);
        console.log('[RESPONSE] Headers:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
          console.log('[BACKEND] Save successful on live backend!');
          try {
            const responseData = await response.text();
            console.log('[RESPONSE] Body:', responseData);
          } catch (bodyError) {
            console.log('[RESPONSE] Could not read response body (may be empty)');
          }
          setSaveSuccess(true);
          Alert.alert('Success', 'Profile saved to live backend!');
        } else {
          console.error('[BACKEND] Save failed on live backend with status:', response.status);
          try {
            const errorData = await response.json();
            console.error('[BACKEND] Error response data:', errorData);
          } catch (parseError) {
            console.error('[BACKEND] Could not parse error response as JSON');
            try {
              const errorText = await response.text();
              console.error('[BACKEND] Raw error response:', errorText);
            } catch (textError) {
              console.error('[BACKEND] Could not read error response as text');
            }
          }
          Alert.alert('Error', `Backend responded with status ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('[BACKEND] Network/Request error:', error);
        console.error('[BACKEND] Error details:', {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : 'No stack trace',
          name: error instanceof Error ? error.name : 'Unknown error type'
        });
        Alert.alert('Error', 'An unexpected error occurred.');
      } finally {
        setSaving(false);
        console.log('[BACKEND] Save operation completed');
      }
    } else if (USE_LOCAL_FALLBACK) {
      console.log('[LOCAL] Using local fallback save mode');
      const saveData = {
        name: username || userName,
        email: email || 'No email set',
        theme: theme
      };
      console.log('[LOCAL] Data to be "saved":', saveData);
      
      // Simple fallback that works immediately
      Alert.alert("Preferences saved", 
        `Name: ${username || userName}\nEmail: ${email || 'No email set'}\nTheme: ${theme}`
      );
      console.log('[LOCAL] Local save completed successfully');
    } else {
      console.warn('[SAVE] No save mode enabled - no operation performed');
    }
  };

  //handleLogout with feature flags
  const handleLogout = async () => {
    if (readOnly) return;
    
    console.log('[LOGOUT] Logout operation initiated');
    console.log('[LOGOUT] Current mode - USE_BACKEND:', USE_BACKEND, 'USE_MOCK_AWS:', USE_MOCK_AWS);
    
    if (USE_BACKEND || USE_MOCK_AWS) {
      console.log('[BACKEND] Using backend logout mode');
      try {
        console.log('[AUTH] Attempting AWS Auth signout (commented out for now)');
        // await Auth.signOut(); // Commented out until AWS is set up
        console.log('[AUTH] AWS signout would be called here');
        
        console.log('[LOCAL] Calling local logout function');
        logout();
        
        console.log('[NAVIGATION] Redirecting to login page');
        router.replace('/login');
        
        Alert.alert('Success', 'Logged out successfully');
        console.log('[LOGOUT] Backend logout completed successfully');
      } catch (error) {
        console.error('[LOGOUT] Error during backend logout:', error);
        console.error('[LOGOUT] Error details:', {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : 'No stack trace',
          name: error instanceof Error ? error.name : 'Unknown error type'
        });
        Alert.alert('Error', 'Error logging out');
      }
    } else {
      console.log('[LOCAL] Using local logout mode');
      console.log('[LOCAL] Calling local logout function');
      logout();
      
      console.log('[NAVIGATION] Redirecting to login page');
      router.replace('/login');
      
      console.log('[LOGOUT] Local logout completed successfully');
    }
  };

  const pickImage = async () => {
    if (readOnly) {
      console.log('[IMAGE] Image picker disabled (read-only mode)');
      return;
    }
    
    console.log('[IMAGE] Starting image picker...');
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log('[IMAGE] Image picker result:', {
      canceled: result.canceled,
      assetsCount: result.canceled ? 0 : result.assets.length
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      console.log('[IMAGE] Image selected:', imageUri);
      setProfileImageUri(imageUri);
      console.log('[IMAGE] Profile image updated successfully');
    } else {
      console.log('[IMAGE] Image selection canceled by user');
    }
  };

  // loading and error states (only show when using backend)
  if (USE_BACKEND && loading) {
    return (
      <LinearGradient
        colors={['#F0E8D0', '#7BB8CC']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBackground}
      >
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <Text style={styles.text}>Loading profile...</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  if (USE_BACKEND && error) {
    return (
      <LinearGradient
        colors={['#F0E8D0', '#7BB8CC']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBackground}
      >
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <Text style={styles.text}>{error}</Text>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => window.location.reload()}
            >
              <Text style={styles.buttonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
<LinearGradient
  colors={colors.gradient as [string, string]}  start={{ x: 0, y: 1 }}
  end={{ x: 1, y: 0 }}
  style={styles.gradientBackground}
>

        <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.narrowContainer}>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        </View>
        <View style={styles.contentContainer}>
          <TouchableOpacity 
            onPress={() => !readOnly && setIsEditingName(!isEditingName)}
            disabled={readOnly}
          >
            {isEditingName && !readOnly ? (
              <TextInput
                style={styles.nameInput}
                value={USE_BACKEND ? username : userName}
                onChangeText={USE_BACKEND ? setUsername : setUserName}
                onBlur={() => setIsEditingName(false)}
                onSubmitEditing={() => setIsEditingName(false)}
                selectTextOnFocus={true}
                autoFocus
                placeholder="Enter your name"
              />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={[styles.text, styles.nameText]}>
                  {USE_BACKEND ? username : userName}
                </Text>
                {!readOnly && <MdOutlineEdit size={16} color="#2D4E85" />}
              </View>
            )}
          </TouchableOpacity>

          {/* Show email field only when using backend */}
          {USE_BACKEND && (
            <>
              <Text style={styles.text}>Email:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                editable={!readOnly}
                keyboardType="email-address"
              />
            </>
          )}
          
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
            onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            disabled={readOnly}
          >
            <Text style={styles.buttonText}>
              Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
            </Text>
          </TouchableOpacity>

          {!readOnly && (
            <>
              {/* Show success message from backend */}
              {saveSuccess && <Text style={{ color: 'green', marginBottom: 8 }}>Saved successfully!</Text>}

              <TouchableOpacity 
                style={[styles.button, (saving || readOnly) && styles.buttonDisabled]} 
                onPress={handleSave}
                disabled={saving || readOnly}
              >
                <Text style={styles.buttonText}>
                  {saving ? 'Saving...' : 'Save Preferences'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.buttonDanger]} 
                onPress={handleLogout}
              >
                <Text style={styles.buttonText}>Log Out</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}
