import { useTheme } from '@/hooks/ThemeContext';
import { friendsAPI } from '@/services/api/friends';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import styles from './friends.styles';

// User state: fetched from API
type UserListItem = {
  id: string;
  name: string;
  isFriend: boolean;
};

// Damerau-Levenshtein distance-based fuzzy search
function damerauLevenshtein(a: string, b: string): number {
  const alen = a.length;
  const blen = b.length;
  if (alen === 0) return blen;
  if (blen === 0) return alen;
  const dp = Array.from({ length: alen + 1 }, () => new Array(blen + 1).fill(0));
  for (let i = 0; i <= alen; i++) dp[i][0] = i;
  for (let j = 0; j <= blen; j++) dp[0][j] = j;
  for (let i = 1; i <= alen; i++) {
    for (let j = 1; j <= blen; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // deletion
        dp[i][j - 1] + 1,      // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
      if (
        i > 1 &&
        j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1]
      ) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + cost); // transposition
      }
    }
  }
  return dp[alen][blen];
}

function fuzzySearch(query: string, text: string): number {
  const normalizedQuery = query.toLowerCase().trim();
  const normalizedText = text.toLowerCase();
  if (normalizedQuery.length === 0) return 0;
  if (normalizedText === normalizedQuery) return 1.0;
  if (normalizedText.startsWith(normalizedQuery)) return 0.95;
  if (normalizedText.includes(normalizedQuery)) return 0.85;
  // Damerau-Levenshtein distance for typo tolerance
  const dist = damerauLevenshtein(normalizedQuery, normalizedText);
  const maxLen = Math.max(normalizedQuery.length, normalizedText.length);
  const score = 1 - dist / maxLen;
  // Only return matches with reasonable similarity
  return score >= 0.6 ? score : 0;
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
  const [allUsers, setAllUsers] = useState<UserListItem[]>([]);
  const [friends, setFriends] = useState<UserListItem[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]); // Track sent friend requests
  const [confirmUnfriend, setConfirmUnfriend] = useState<{ id: string; name: string } | null>(null);
  const [profilePopup, setProfilePopup] = useState<{ id: string; name: string } | null>(null);
  const [profileData, setProfileData] = useState<{ username: string; level: number; totalExperience: number; profileImage?: string } | null>(null);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Use AuthContext for user and token
  const { user } = useAuth();
  const currentUserId = user?.id || '';
  const token = window.localStorage.getItem('authToken') || '';

  // Fetch friends list on mount
  useEffect(() => {
    async function fetchFriendsAndRequests() {
      if (!currentUserId || !token) return;
      setLoading(true);
      try {
        const [friendsRes, requests] = await Promise.all([
          friendsAPI.getFriends(currentUserId, token),
          friendsAPI.getPendingRequests(currentUserId, token)
        ]);
        // Map to UserListItem
        const friendList: UserListItem[] = friendsRes.map(f => ({
          id: f.userId === currentUserId ? f.targetUserId : f.userId,
          name: f.userId === currentUserId ? f.targetUser?.username || '' : f.user?.username || '',
          isFriend: f.type === 'FRIEND',
        }));
        setFriends(friendList);
        setUsers(friendList); // Only friends shown by default
        setPendingRequests(requests);
      } catch (err) {
        setSnackbar('Failed to load friends or requests');
      } finally {
        setLoading(false);
      }
    }
    fetchFriendsAndRequests();
  }, [currentUserId, token]);
  // Approve friend request
  const handleApproveRequest = async (relationshipId: string) => {
    if (!token) return;
    setLoading(true);
    try {
      await friendsAPI.acceptFriendRequest(relationshipId, token);
      setPendingRequests(requests => requests.filter(r => r.id !== relationshipId));
      // Immediately refresh friends list
      const friendsRes = await friendsAPI.getFriends(currentUserId, token);
      const friendList: UserListItem[] = friendsRes.map(f => ({
        id: f.userId === currentUserId ? f.targetUserId : f.userId,
        name: f.userId === currentUserId ? f.targetUser?.username || '' : f.user?.username || '',
        isFriend: f.type === 'FRIEND',
      }));
      setFriends(friendList);
      setUsers(friendList);
      setSnackbar('Friend request approved');
    } catch {
      setSnackbar('Failed to approve request');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users on mount (or when user/token changes), keep in memory
  useEffect(() => {
    if (!currentUserId || !token) return;
    setLoading(true);
    friendsAPI.searchUsers('', { userId: currentUserId })
      .then(results => {
        // Filter out the current user from all users
        const filtered = results.filter((u: any) => u.id !== currentUserId);
        // Map to UserListItem, isFriend determined by friends list
        const allUserList: UserListItem[] = filtered.map((u: any) => ({
          id: u.id,
          name: u.username,
          isFriend: false, // will be set in filteredUsers
        }));
        setAllUsers(allUserList);
      })
      .catch(() => setSnackbar('Failed to load users'))
      .finally(() => setLoading(false));
  }, [currentUserId, token]);

  // Enhanced filtering with custom fuzzy search
  const filteredUsers = useMemo(() => {
    if (search.trim().length === 0) {
      // Show only friends when not searching
      return friends;
    } else if (allUsers.length === 0) {
      // Wait for all users to load
      return [];
    } else {
      // Use custom fuzzy search across all users
      const searchResults = allUsers
        .map(user => ({
          user,
          score: fuzzySearch(search, user.name)
        }))
        .filter(result => result.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(result => ({
          ...result.user,
          isFriend: friends.some(f => f.id === result.user.id)
        }));
      return searchResults;
    }
  }, [search, allUsers, friends]);

  // Add friend
  const handleAdd = async (id: string) => {
    if (!currentUserId || !token) return;
    setLoading(true);
    setSentRequests(prev => [...prev, id]); // Optimistically disable button
    try {
      await friendsAPI.sendFriendRequest(currentUserId, id, token);
      // Update friends and allUsers to reflect new friend status
      const friendsRes = await friendsAPI.getFriends(currentUserId, token);
      const friendList: UserListItem[] = friendsRes.map(f => ({
        id: f.userId === currentUserId ? f.targetUserId : f.userId,
        name: f.userId === currentUserId ? f.targetUser?.username || '' : f.user?.username || '',
        isFriend: f.type === 'FRIEND',
      }));
      setFriends(friendList);
      setSnackbar('Friend request sent');
    } catch {
      setSnackbar('Failed to send friend request');
      setSentRequests(prev => prev.filter(reqId => reqId !== id)); // Re-enable if failed
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
      // Update friends and allUsers to reflect new friend status
      const friendsRes = await friendsAPI.getFriends(currentUserId, token);
      const friendList: UserListItem[] = friendsRes.map(f => ({
        id: f.userId === currentUserId ? f.targetUserId : f.userId,
        name: f.userId === currentUserId ? f.targetUser?.username || '' : f.user?.username || '',
        isFriend: f.type === 'FRIEND',
      }));
      setFriends(friendList);
      setSnackbar('Removed from friends');
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
        profileImage: profile.user.profileImage || undefined,
      });
    } catch {
      setSnackbar('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: UserListItem }) => {
    const highlightedName = highlightMatch(item.name, search);
    const isRequestSent = sentRequests.includes(item.id);
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
            style={[styles.button, (item.isFriend || isRequestSent) ? styles.buttonDisabled : styles.buttonAdd]}
            disabled={item.isFriend || isRequestSent}
            onPress={() => handleAdd(item.id)}
          >
            <Text style={styles.buttonText}>{isRequestSent ? 'Requested' : 'Add'}</Text>
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

          {pendingRequests.length > 0 && (
            <View style={styles.requestsSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Friend Requests</Text>
              <View style={styles.sectionDivider} />
              {pendingRequests.map(req => (
                <View key={req.id} style={styles.friendRow}>
                  <Text style={[styles.friendName, styles.friendNameLink, styles.friendRequestName]}> 
                    {req.user?.username || 'Unknown User'}
                  </Text>
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      style={[styles.button, styles.buttonAdd]}
                      onPress={() => handleApproveRequest(req.id)}
                    >
                      <Text style={styles.buttonText}>Approve</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
          {search.length > 0 && (
            <Text style={styles.searchResults}>
          {filteredUsers.length} result{filteredUsers.length !== 1 ? 's' : ''} found
          {filteredUsers.length === 0 && search.length > 0 && (
            <Text style={styles.searchHint}> - Try shorter terms or check spelling</Text>
          )}
            </Text>
          )}
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>My Friends</Text>
          <View style={styles.sectionDivider} />
          <FlatList
            data={filteredUsers}
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
          <View style={styles.profileModalOverlay}> 
            <View style={[styles.profileModalContent, { backgroundColor: colors.background }]}> 
              {profilePopup && profileData ? (
                <>
                  <View style={styles.profileModalAvatarContainer}>
                    <Image
                      source={{ uri: profileData.profileImage || 'https://static.vecteezy.com/system/resources/previews/000/574/512/original/vector-sign-of-user-icon.jpg' }}
                      style={styles.profileModalAvatarImage}
                    />
                  </View>
                  <Text style={[styles.profileModalUsername, { color: colors.text }]}>{profileData.username}</Text>
                  <View style={styles.profileModalRow}>
                    <Text style={[styles.profileModalLabel, { color: colors.text }]}>Level</Text>
                    <Text style={[styles.profileModalValue, { color: colors.text }]}>{profileData.level}</Text>
                  </View>
                  <View style={styles.profileModalRow}>
                    <Text style={[styles.profileModalLabel, { color: colors.text }]}>XP</Text>
                    <Text style={[styles.profileModalValue, { color: colors.text }]}>{profileData.totalExperience}</Text>
                  </View>
                </>
              ) : (
                <Text style={styles.modalText}>Loading...</Text>
              )}
              <TouchableOpacity
                style={[styles.button, styles.buttonNeutral, styles.profileModalCloseButton]}
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
