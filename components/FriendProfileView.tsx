import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type FriendProfileProps = {
  username: string;
  level: number;
  totalExperience: number;
};

export const FriendProfileView: React.FC<FriendProfileProps> = ({ username, level, totalExperience }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{username}'s Profile</Text>
      <View style={styles.statsRow}>
        <Text style={styles.label}>Level:</Text>
        <Text style={styles.value}>{level}</Text>
      </View>
      <View style={styles.statsRow}>
        <Text style={styles.label}>Points:</Text>
        <Text style={styles.value}>{totalExperience}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  label: {
    fontSize: 18,
    color: '#555',
    marginRight: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
});
