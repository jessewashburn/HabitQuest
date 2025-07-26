
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/ThemeContext';
import { getUserExperience, getUserStreaks } from '../services/api/experience';
import { fetchLeaderboard, LeaderboardEntry } from '../services/api/leaderboard';

const LeaderboardScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expData, setExpData] = useState<any>(null);
  const [streakLength, setStreakLength] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      console.log('LeaderboardScreen: user', user);
      if (!user) return;
      try {
        const [leaderboardRes, expRes, streakRes] = await Promise.all([
          fetchLeaderboard({ type: 'level-by-user', limit: 10 }),
          getUserExperience(user.id),
          getUserStreaks(user.id)
        ]);
        console.log('LeaderboardScreen: leaderboardRes', leaderboardRes);
        console.log('LeaderboardScreen: expRes', expRes);
        console.log('LeaderboardScreen: streakRes', streakRes);
        setEntries(Array.isArray(leaderboardRes) ? leaderboardRes : []);
        // For expData, use expRes.totalExperience and expRes.categoryExperience if available
        setExpData({
          totalExperience: expRes.totalExperience ?? 0,
          categoryExperience: expRes.categoryExperience ?? [],
        });
        // For streaks, use streakRes.entries or streakRes if array
        const streakArray = Array.isArray(streakRes.entries) ? streakRes.entries : Array.isArray(streakRes) ? streakRes : [];
        const maxStreak = streakArray.reduce((max: number, s: any) => Math.max(max, s.streakCount || s.count || 0), 0);
        setStreakLength(maxStreak);
        setLoading(false);
      } catch (err: any) {
        console.error('LeaderboardScreen: fetchData error', err);
        setError(err.message);
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <Text style={styles.subtitle}>Your EXP & Streaks</Text>

      {/* Debug Info Section */}
      <View style={[styles.card, { backgroundColor: '#fff', borderColor: '#f00', borderWidth: 1, marginBottom: 10 }]}> 
        <Text style={{ color: '#f00', fontWeight: 'bold', marginBottom: 4 }}>Debug Info:</Text>
        <Text style={{ color: '#333', fontSize: 12 }}>User: {JSON.stringify(user)}</Text>
        <Text style={{ color: '#333', fontSize: 12 }}>EXP Data: {JSON.stringify(expData)}</Text>
        <Text style={{ color: '#333', fontSize: 12 }}>Entries: {JSON.stringify(entries)}</Text>
        <Text style={{ color: '#333', fontSize: 12 }}>Streak Length: {streakLength}</Text>
        <Text style={{ color: '#333', fontSize: 12 }}>Error: {error}</Text>
      </View>

      {!expData ? (
        <ActivityIndicator size="large" color={colors.text} />
      ) : (
        <>
          <View style={[styles.card, { backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff' }]}> 
            <Text style={[styles.cardTitle, { color: colors.text }]}>Total EXP</Text>
            <Text style={[styles.value, { color: '#0066cc' }]}>{expData.totalExperience}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff' }]}> 
            <Text style={[styles.cardTitle, { color: colors.text }]}>Category EXP</Text>
            {expData.categoryExperience && Object.entries(expData.categoryExperience).map(([category, value]: [string, any]) => (
              <Text key={category} style={[styles.categoryLine, { color: '#333' }]}> 
                {category}: {value.totalExperience} (Level {value.level})
              </Text>
            ))}
          </View>
          <View style={[styles.card, { backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff' }]}> 
            <Text style={[styles.cardTitle, { color: colors.text }]}>Longest Active Streak 🔥</Text>
            <Text style={[styles.value, { color: '#f4b400' }]}>{streakLength} Days</Text>
          </View>
        </>
      )}

      <Text style={styles.subtitle}>Top 10 Users</Text>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.userId?.toString() || item.username}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.exp}>{item.exp ?? 0}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No leaderboard data found.</Text>}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  categoryLine: {
    fontSize: 16,
    marginBottom: 4,
  },
  error: {
    color: 'red',
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
  },
  rank: {
    fontSize: 20,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'center',
  },
  username: {
    fontSize: 18,
    flex: 1,
    marginLeft: 8,
  },
  exp: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default LeaderboardScreen;
