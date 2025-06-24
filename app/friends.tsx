import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './friends.styles';

const mockFriends = [
  { id: '1', name: 'Sam' },
  { id: '2', name: 'Harrison' },
];

export default function FriendsScreen() {
  return (
    <LinearGradient
  colors={['#fdf6ec', '#9bd3f9']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.gradientBackground}
>

      <View style={styles.narrowContainer}>
        <Text style={styles.pageTitle}>Friends</Text>

        <View style={styles.searchBarContainer}>
          <TextInput style={styles.searchBar} placeholder="Find friends" />
        </View>

        <FlatList
          data={mockFriends}
          keyExtractor={(item) => item.id}
          style={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.friendRow}>
              <Text style={[styles.friendName, styles.friendNameLink]}>{item.name}</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity style={[styles.button, styles.buttonDisabled]} disabled>
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.buttonRemove]}>
                  <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </LinearGradient>
  );
}
