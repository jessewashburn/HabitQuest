import React, { useState } from 'react';
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './friends.styles';

// Test user data
const TEST_USERS = [
  { id: '1', name: 'Sam', isFriend: true },
  { id: '2', name: 'Jesse', isFriend: false },
  { id: '3', name: 'Harrison', isFriend: true },
  { id: '4', name: 'Mo', isFriend: false },
  { id: '5', name: 'Jeffrey', isFriend: false },
];

export default function FriendsScreen() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState(TEST_USERS);
  const [confirmUnfriend, setConfirmUnfriend] = useState<{ id: string; name: string } | null>(null);
  const [profilePopup, setProfilePopup] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<string | null>(null);

  // Only show friends unless searching
  const filteredUsers =
    search.trim().length === 0
      ? users.filter(u => u.isFriend)
      : users.filter(u =>
          u.name.toLowerCase().includes(search.toLowerCase())
        );

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

  const renderItem = ({ item }: { item: typeof TEST_USERS[0] }) => (
    <View style={styles.friendRow}>
      <TouchableOpacity onPress={() => setProfilePopup(item.name)}>
        <Text style={[styles.friendName, styles.friendNameLink]}>
          {item.name}
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

  return (
    <View style={styles.container}>
      <View style={styles.narrowContainer}>
        <Text style={styles.pageTitle}>Friends</Text>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Find friends"
            value={search}
            onChangeText={setSearch}
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
  );
}
