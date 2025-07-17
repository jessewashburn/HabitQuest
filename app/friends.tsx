import { useTheme } from '@/hooks/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './friends.styles';

// Test user data
const TEST_USERS = [
  { id: '1', name: 'Sam', isFriend: true },
  { id: '2', name: 'Jesse', isFriend: false },
  { id: '3', name: 'Harrison', isFriend: true },
  { id: '4', name: 'Mo', isFriend: false },
  { id: '5', name: 'Jeffrey', isFriend: false },
  { id: '6', name: 'Alexandra', isFriend: false },
  { id: '7', name: 'Michael', isFriend: true },
  { id: '8', name: 'Catherine', isFriend: false },
  { id: '9', name: 'Christopher', isFriend: false },
  { id: '10', name: 'Stephanie', isFriend: true },
];

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
  const [users, setUsers] = useState(TEST_USERS);
  const [confirmUnfriend, setConfirmUnfriend] = useState<{ id: string; name: string } | null>(null);
  const [profilePopup, setProfilePopup] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<string | null>(null);

  // Enhanced filtering with custom fuzzy search
  const filteredUsers = useMemo(() => {
    if (search.trim().length === 0) {
      // Show only friends when not searching
      return users.filter(u => u.isFriend);
    } else {
      // Use custom fuzzy search across all users
      const searchResults = users
        .map(user => ({
          user,
          score: fuzzySearch(search, user.name)
        }))
        .filter(result => result.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(result => result.user);
      
      return searchResults;
    }
  }, [search, users]);

  // Handlers for add/remove
  const handleAdd = (id: string) => {
    setUsers(users =>
      users.map(u => (u.id === id ? { ...u, isFriend: true } : u))
    );
    const user = users.find(u => u.id === id);
    setSnackbar(`Added ${user?.name} as a friend`);
  };
  const handleRemove = (id: string) => {
    setUsers(users =>
      users.map(u => (u.id === id ? { ...u, isFriend: false } : u))
    );
    const user = users.find(u => u.id === id);
    setSnackbar(`Removed ${user?.name} from friends`);
    setConfirmUnfriend(null);
  };

  const renderItem = ({ item }: { item: typeof TEST_USERS[0] }) => {
    const highlightedName = highlightMatch(item.name, search);
    
    return (
      <View style={styles.friendRow}>
        <TouchableOpacity onPress={() => setProfilePopup(item.name)}>
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
            style={[
              styles.button,
              item.isFriend ? styles.buttonDisabled : styles.buttonAdd,
            ]}
            disabled={item.isFriend}
            onPress={() => handleAdd(item.id)}
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              !item.isFriend ? styles.buttonDisabled : styles.buttonRemove,
            ]}
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
      <View style={[styles.container, { backgroundColor: colors.background }]}> 
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
              {filteredUsers.length} result{filteredUsers.length !== 1 ? 's' : ''} found
              {filteredUsers.length === 0 && search.length > 0 && (
                <Text style={styles.searchHint}> - Try shorter terms or check spelling</Text>
              )}
            </Text>
          )}
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
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {profilePopup && (
                <>
                  <Text style={styles.modalText}>
                    You clicked {profilePopup}. This will take you to their profile
                  </Text>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonNeutral]}
                    onPress={() => setProfilePopup(null)}
                  >
                    <Text style={styles.buttonText}>OK</Text>
                  </TouchableOpacity>
                </>
              )}
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
