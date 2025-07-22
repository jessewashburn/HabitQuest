import { FriendProfileView } from '@/components/FriendProfileView';
import { useTheme } from '@/hooks/ThemeContext';
import { friendsAPI } from '@/services/api/friends';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import styles from './friends.styles';

// User state: fetched from API
type UserListItem = {
  id: string;
  name: string;
  isFriend: boolean;
};

// Custom fuzzy search function
function fuzzySearch(query: string, text: string): number {
  const normalizedQuery = query.toLowerCase().trim();
  const normalizedText = text.toLowerCase();
  if (normalizedQuery.length === 0) return 0;
  if (normalizedText === normalizedQuery) return 1.0;
  if (normalizedText.startsWith(normalizedQuery)) return 0.95;
  if (normalizedText.includes(normalizedQuery)) return 0.85;
  const words = normalizedText.split(/\s+/);
  for (const word of words) {
    if (word.startsWith(normalizedQuery)) return 0.8;
  }

  let queryIndex = 0;
  let textIndex = 0;
  let matches = 0;
  let consecutive = 0;
  let maxConsecutive = 0;
  
  while (queryIndex < normalizedQuery.length && textIndex < normalizedText.length) {
    if (normalizedQuery[queryIndex] === normalizedText[textIndex]) {
      matches++;
      consecutive++;
      maxConsecutive = Math.max(maxConsecutive, consecutive);
      queryIndex++;
    } else {
      consecutive = 0;
    }
    textIndex++;
  }
  const matchRatio = matches / normalizedQuery.length;
  const consecutiveBonus = maxConsecutive / normalizedQuery.length;
  const lengthPenalty = Math.min(1, normalizedQuery.length / normalizedText.length);
  
  if (matchRatio < 0.6) return 0;
  const baseScore = matchRatio * 0.6;
  const consecutiveScore = consecutiveBonus * 0.3;
  const lengthScore = lengthPenalty * 0.1;
  return Math.min(0.75, baseScore + consecutiveScore + lengthScore); // Cap fuzzy matches at 0.75
}

// Function to highlight matching characters in search results
function highlightMatch(text: string, query: string): { text: string; isHighlighted: boolean }[] {
  if (!query.trim()) return [{ text, isHighlighted: false }];
  
  const normalizedQuery = query.toLowerCase();
  const normalizedText = text.toLowerCase();
  const result: { text: string; isHighlighted: boolean }[] = [];
  
  if (normalizedText.includes(normalizedQuery)) {
    // Simple substring highlighting
    const index = normalizedText.indexOf(normalizedQuery);
    if (index > 0) {
      result.push({ text: text.substring(0, index), isHighlighted: false });
    }
    result.push({ text: text.substring(index, index + query.length), isHighlighted: true });
    if (index + query.length < text.length) {
      result.push({ text: text.substring(index + query.length), isHighlighted: false });
    }
  } else {
    // For fuzzy matches, just return the original text
    result.push({ text, isHighlighted: false });
  }
  
  return result;
}

export default function FriendsScreen() {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [confirmUnfriend, setConfirmUnfriend] = useState<{ id: string; name: string } | null>(null);
  const [profilePopup, setProfilePopup] = useState<{ id: string; name: string } | null>(null);
  const [profileData, setProfileData] = useState<{ username: string; level: number; totalExperience: number } | null>(null);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Use AuthContext for user and token
  const { user } = useAuth();
  const currentUserId = user?.id || '';
  const token = window.localStorage.getItem('authToken') || '';

  // Fetch friends list on mount
  useEffect(() => {
    async function fetchFriends() {
      if (!currentUserId || !token) return;
      setLoading(true);
      try {
        const friends = await friendsAPI.getFriends(currentUserId, token);
        // Map to UserListItem
        const friendList: UserListItem[] = friends.map(f => ({
          id: f.userId === currentUserId ? f.targetUserId : f.userId,
          name: f.userId === currentUserId ? f.targetUser?.username || '' : f.user?.username || '',
          isFriend: f.type === 'FRIEND',
        }));
        setUsers(friendList);
      } catch (err) {
        setSnackbar('Failed to load friends');
      } finally {
        setLoading(false);
      }
    }
    fetchFriends();
  }, [currentUserId, token]);

  // Search users
  useEffect(() => {
    if (search.trim().length === 0) return;
    let active = true;
    setLoading(true);
    if (!token) return;
    friendsAPI.searchUsers(search, token)
      .then(results => {
        if (!active) return;
        // Map search results to UserListItem
        const searchList: UserListItem[] = results.map((u: any) => ({
          id: u.id,
          name: u.username,
          isFriend: users.some(f => f.id === u.id && f.isFriend),
        }));
        setUsers(searchList);
      })
      .catch(() => setSnackbar('Search failed'))
      .finally(() => setLoading(false));
    return () => { active = false; };
  }, [search]);

  // Add friend
  const handleAdd = async (id: string) => {
    if (!currentUserId || !token) return;
    setLoading(true);
    try {
      await friendsAPI.sendFriendRequest(currentUserId, id, token);
      setUsers(users => users.map(u => (u.id === id ? { ...u, isFriend: true } : u)));
      const user = users.find(u => u.id === id);
      setSnackbar(`Friend request sent to ${user?.name}`);
    } catch {
      setSnackbar('Failed to send friend request');
    } finally {
      setLoading(false);
    }
  };

  // Remove friend
  const handleRemove = async (id: string) => {
    if (!token) return;
    setLoading(true);
    try {
      // You need the relationshipId, not just userId. For demo, assume id is relationshipId.
      await friendsAPI.removeFriend(id, token);
      setUsers(users => users.map(u => (u.id === id ? { ...u, isFriend: false } : u)));
      const user = users.find(u => u.id === id);
      setSnackbar(`Removed ${user?.name} from friends`);
      setConfirmUnfriend(null);
    } catch {
      setSnackbar('Failed to remove friend');
    } finally {
      setLoading(false);
    }
  };

  // View profile
  const handleViewProfile = async (id: string, name: string) => {
    if (!token) return;
    setProfilePopup({ id, name });
    setProfileData(null);
    setLoading(true);
    try {
      const profile = await friendsAPI.getUserProfile(id, token);
      setProfileData({
        username: profile.user.username,
        level: profile.levels?.totalLevel || 0,
        totalExperience: profile.experience?.totalExperience || 0,
      });
    } catch {
      setSnackbar('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: UserListItem }) => {
    const highlightedName = highlightMatch(item.name, search);
    return (
      <View style={styles.friendRow}>
        <TouchableOpacity onPress={() => handleViewProfile(item.id, item.name)}>
          <Text style={[styles.friendName, styles.friendNameLink]}>
            {highlightedName.map((part, index) => (
              <Text
                key={index}
                style={part.isHighlighted ? styles.highlightedText : undefined}
              >
                {part.text}
              </Text>
            ))}
          </Text>
        </TouchableOpacity>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, item.isFriend ? styles.buttonDisabled : styles.buttonAdd]}
            disabled={item.isFriend}
            onPress={() => handleAdd(item.id)}
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, !item.isFriend ? styles.buttonDisabled : styles.buttonRemove]}
            disabled={!item.isFriend}
            onPress={() => setConfirmUnfriend({ id: item.id, name: item.name })}
          >
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={colors.gradient as [string, string]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.gradientBackground}
    >
      <View style={[styles.container, colors.background !== '#FFFFFF' && { backgroundColor: colors.background }]}> 
        <View style={styles.narrowContainer}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>Friends</Text>
          <Text style={[styles.text, { color: colors.text }]}>Connect with friends to stay motivated!</Text>
          <View style={styles.searchBarContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="Find friends"
              value={search}
              onChangeText={setSearch}
              autoCorrect={false}
              autoCapitalize="none"
            />
            {search.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearch('')}
                accessibilityLabel="Clear search"
              >
                <Text style={styles.clearButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
          {search.length > 0 && (
            <Text style={styles.searchResults}>
              {users.length} result{users.length !== 1 ? 's' : ''} found
              {users.length === 0 && search.length > 0 && (
                <Text style={styles.searchHint}> - Try shorter terms or check spelling</Text>
              )}
            </Text>
          )}
          <FlatList
            data={users}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
        </View>
        <Modal
          visible={!!confirmUnfriend}
          transparent
          animationType="fade"
          onRequestClose={() => setConfirmUnfriend(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Are you sure you want to unfriend {confirmUnfriend?.name}?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonRemove, { marginRight: 16 }]}
                  onPress={() => handleRemove(confirmUnfriend!.id)}
                >
                  <Text style={styles.buttonText}>Confirm Unfriend</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonNeutral]}
                  onPress={() => setConfirmUnfriend(null)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          visible={!!profilePopup}
          transparent
          animationType="fade"
          onRequestClose={() => setProfilePopup(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {profilePopup && profileData ? (
                <FriendProfileView
                  username={profileData.username}
                  level={profileData.level}
                  totalExperience={profileData.totalExperience}
                />
              ) : (
                <Text style={styles.modalText}>Loading profile...</Text>
              )}
              <TouchableOpacity
                style={[styles.button, styles.buttonNeutral, { marginTop: 16 }]}
                onPress={() => setProfilePopup(null)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {snackbar && (
          <View style={styles.snackbar}>
            <Text style={styles.snackbarText}>{snackbar}</Text>
            <TouchableOpacity onPress={() => setSnackbar(null)}>
              <Text style={styles.snackbarAction}>OK</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}
