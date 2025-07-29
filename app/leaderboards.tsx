import { useTheme } from '@/hooks/ThemeContext';
import { categoriesAPI, Category, CategoryLevelLeaderboardEntry, leaderboardsAPI, StreakLeaderboardEntry, UserLevelLeaderboardEntry, UserStreakLeaderboardEntry } from '@/services/api';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TabType = 'streaks' | 'levels';
type ViewType = 'global' | 'category';

type LeaderboardData = StreakLeaderboardEntry[] | UserStreakLeaderboardEntry[] | CategoryLevelLeaderboardEntry[] | UserLevelLeaderboardEntry[];

export default function LeaderboardsScreen() {
  const { theme, colors } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('streaks');
  const [viewType, setViewType] = useState<ViewType>('global');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData>([]);
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoriesAPI.getCategories();
      setCategories(categoriesData.filter(cat => cat.active));
      if (categoriesData.length > 0) {
        setSelectedCategory(categoriesData[0].id);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      Alert.alert('Error', 'Failed to load categories');
    }
  };

  const loadLeaderboardData = useCallback(async () => {
    setLoading(true);
    try {
      let data: LeaderboardData = [];
      
      console.log('🔥 Loading leaderboard data:', { activeTab, viewType, selectedCategory });
      
      if (activeTab === 'streaks') {
        if (viewType === 'global') {
          console.log('📊 Fetching global streaks...');
          data = await leaderboardsAPI.getStreaksByUser(20);
        } else {
          if (selectedCategory) {
            console.log('📊 Fetching category streaks for:', selectedCategory);
            data = await leaderboardsAPI.getStreaksByCategory(selectedCategory, 20);
          }
        }
      } else {
        if (viewType === 'global') {
          console.log('📊 Fetching global levels...');
          data = await leaderboardsAPI.getLevelsByUser(20);
        } else {
          if (selectedCategory) {
            console.log('📊 Fetching category levels for:', selectedCategory);
            data = await leaderboardsAPI.getLevelsByCategory(selectedCategory, 20);
          }
        }
      }
      
      console.log('✅ Leaderboard data loaded:', data);
      console.log('🔍 Data type:', typeof data, 'Is array:', Array.isArray(data));
      
      // Ensure we always set an array
      if (Array.isArray(data)) {
        setLeaderboardData(data);
      } else {
        console.warn('⚠️ API returned non-array data:', data);
        setLeaderboardData([]);
      }
    } catch (error) {
      console.error('❌ Error loading leaderboard data:', error);
      Alert.alert('Error', `Failed to load leaderboard data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, viewType, selectedCategory]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadLeaderboardData();
  }, [loadLeaderboardData]);

  const renderStreakEntry = (item: StreakLeaderboardEntry | UserStreakLeaderboardEntry, index: number) => {
    const isUserStreak = 'totalStreaks' in item;
    
    return (
      <View key={`streak-${index}`} style={styles.entryCard}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>#{item.rank}</Text>
        </View>
        <View style={styles.entryContent}>
          <Text style={styles.username}>{item.username}</Text>
          {isUserStreak ? (
            <View style={styles.statsRow}>
              <Text style={styles.statText}>
                Total: {item.totalStreaks} | Active: {item.activeStreaks} | Avg: {item.averageStreak.toFixed(1)}
              </Text>
            </View>
          ) : (
            <View style={styles.statsRow}>
              <Text style={styles.habitName}>{item.habitName}</Text>
              <Text style={styles.statText}>
                Streak: {item.streakCount} | {item.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderLevelEntry = (item: CategoryLevelLeaderboardEntry | UserLevelLeaderboardEntry, index: number) => {
    const isUserLevel = 'totalLevel' in item;
    
    return (
      <View key={`level-${index}`} style={styles.entryCard}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>#{item.rank}</Text>
        </View>
        <View style={styles.entryContent}>
          <Text style={styles.username}>{item.username}</Text>
          {isUserLevel ? (
            <View style={styles.statsRow}>
              <Text style={styles.statText}>
                Level {item.totalLevel} | {item.totalExperience} XP | {item.categoriesCount} categories
              </Text>
            </View>
          ) : (
            <View style={styles.statsRow}>
              <Text style={styles.habitName}>{item.categoryName}</Text>
              <Text style={styles.statText}>
                Level {item.level} | {item.experience} XP
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderEntry = ({ item, index }: { item: any; index: number }) => {
    if (activeTab === 'streaks') {
      return renderStreakEntry(item, index);
    } else {
      return renderLevelEntry(item, index);
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { color: '#2D4E85' }]}>No Data Available</Text>
      <Text style={[styles.emptySubtitle, { color: '#555' }]}>
        {viewType === 'global' 
          ? `No ${activeTab} data found for all users.`
          : `No ${activeTab} data found for this category.`
        }
      </Text>
    </View>
  );

  return (
    <LinearGradient
      colors={colors.gradient as [string, string]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <View style={styles.narrowContainer}>
          <Text style={styles.title}>Leaderboards</Text>
          
          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'streaks' && styles.activeTab,
                { backgroundColor: activeTab === 'streaks' ? '#2D4E85' : 'transparent' }
              ]}
              onPress={() => setActiveTab('streaks')}
            >
              <Text style={[
                styles.tabText,
                { color: activeTab === 'streaks' ? 'white' : '#2D4E85' }
              ]}>
                Streaks
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'levels' && styles.activeTab,
                { backgroundColor: activeTab === 'levels' ? '#2D4E85' : 'transparent' }
              ]}
              onPress={() => setActiveTab('levels')}
            >
              <Text style={[
                styles.tabText,
                { color: activeTab === 'levels' ? 'white' : '#2D4E85' }
              ]}>
                Levels
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                viewType === 'global' && styles.activeToggle,
                { backgroundColor: viewType === 'global' ? '#4A6741' : '#e9ecef' }
              ]}
              onPress={() => setViewType('global')}
            >
              <Text style={[
                styles.toggleText,
                { color: viewType === 'global' ? 'white' : '#2D4E85' }
              ]}>
                Global
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                viewType === 'category' && styles.activeToggle,
                { backgroundColor: viewType === 'category' ? '#4A6741' : '#e9ecef' }
              ]}
              onPress={() => setViewType('category')}
            >
              <Text style={[
                styles.toggleText,
                { color: viewType === 'category' ? 'white' : '#2D4E85' }
              ]}>
                By Category
              </Text>
            </TouchableOpacity>
          </View>
          {viewType === 'category' && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value)}
                style={styles.picker}
              >
                {categories.map((category) => (
                  <Picker.Item key={category.id} label={category.name} value={category.id} />
                ))}
              </Picker>
            </View>
          )}
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2D4E85" />
                <Text style={[styles.loadingText, { color: '#2D4E85' }]}>Loading leaderboard...</Text>
              </View>
            ) : !Array.isArray(leaderboardData) || leaderboardData.length === 0 ? (
              renderEmptyState()
            ) : (
              <View style={styles.listContainer}>
                {leaderboardData.map((item, index) => renderEntry({ item, index }))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 40,
  },
  narrowContainer: {
    width: '80%',
    alignSelf: 'center',
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 8,
    color: '#2D4E85',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  pickerContainer: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#2D4E85',
  },
  scrollContent: {
    marginTop: 16,
    flexGrow: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  loadingText: {
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  entryCard: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
    marginBottom: 16,
    alignItems: 'center',
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#2D4E85',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  entryContent: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#2D4E85',
  },
  statsRow: {
    flexDirection: 'column',
  },
  habitName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
    color: '#2D4E85',
  },
  statText: {
    fontSize: 12,
    color: '#555',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});