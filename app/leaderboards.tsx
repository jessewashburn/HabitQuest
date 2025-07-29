import { useTheme } from '@/hooks/ThemeContext';
import { categoriesAPI, Category, CategoryLevelLeaderboardEntry, leaderboardsAPI, StreakLeaderboardEntry, UserLevelLeaderboardEntry, UserStreakLeaderboardEntry } from '@/services/api';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import leaderboardStyles from './leaderboard.styles';

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
      <View key={`streak-${index}`} style={leaderboardStyles.entryCard}>
        <View style={leaderboardStyles.rankBadge}>
          <Text style={leaderboardStyles.rankText}>#{item.rank}</Text>
        </View>
        <View style={leaderboardStyles.entryContent}>
          <Text style={leaderboardStyles.username}>{item.username}</Text>
          {isUserStreak ? (
            <View style={leaderboardStyles.statsRow}>
              <Text style={leaderboardStyles.statText}>
                Total: {item.totalStreaks} | Active: {item.activeStreaks} | Avg: {item.averageStreak.toFixed(1)}
              </Text>
            </View>
          ) : (
            <View style={leaderboardStyles.statsRow}>
              <Text style={leaderboardStyles.habitName}>{item.habitName}</Text>
              <Text style={leaderboardStyles.statText}>
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
      <View key={`level-${index}`} style={leaderboardStyles.entryCard}>
        <View style={leaderboardStyles.rankBadge}>
          <Text style={leaderboardStyles.rankText}>#{item.rank}</Text>
        </View>
        <View style={leaderboardStyles.entryContent}>
          <Text style={leaderboardStyles.username}>{item.username}</Text>
          {isUserLevel ? (
            <View style={leaderboardStyles.statsRow}>
              <Text style={leaderboardStyles.statText}>
                Level {item.totalLevel} | {item.totalExperience} XP | {item.categoriesCount} categories
              </Text>
            </View>
          ) : (
            <View style={leaderboardStyles.statsRow}>
              <Text style={leaderboardStyles.habitName}>{item.categoryName}</Text>
              <Text style={leaderboardStyles.statText}>
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
    <View style={leaderboardStyles.emptyState}>
      <Text style={[leaderboardStyles.emptyTitle, { color: '#2D4E85' }]}>No Data Available</Text>
      <Text style={[leaderboardStyles.emptySubtitle, { color: '#555' }]}>
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
      style={leaderboardStyles.gradientBackground}
    >
      <View style={leaderboardStyles.container}>
        <View style={leaderboardStyles.narrowContainer}>
          <Text style={leaderboardStyles.title}>Leaderboards</Text>
          {/* Tab Navigation */}
          <View style={leaderboardStyles.tabContainer}>
            <TouchableOpacity
              style={[
                leaderboardStyles.tab,
                { backgroundColor: activeTab === 'streaks' ? '#2D4E85' : 'transparent' }
              ]}
              onPress={() => setActiveTab('streaks')}
            >
              <Text style={[
                leaderboardStyles.tabText,
                { color: activeTab === 'streaks' ? 'white' : '#2D4E85' }
              ]}>
                Streaks
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                leaderboardStyles.tab,
                { backgroundColor: activeTab === 'levels' ? '#2D4E85' : 'transparent' }
              ]}
              onPress={() => setActiveTab('levels')}
            >
              <Text style={[
                leaderboardStyles.tabText,
                { color: activeTab === 'levels' ? 'white' : '#2D4E85' }
              ]}>
                Levels
              </Text>
            </TouchableOpacity>
          </View>
          <View style={leaderboardStyles.toggleContainer}>
            <TouchableOpacity
              style={[
                leaderboardStyles.toggleButton,
                { backgroundColor: viewType === 'global' ? '#4A6741' : '#e9ecef' }
              ]}
              onPress={() => setViewType('global')}
            >
              <Text style={[
                leaderboardStyles.toggleText,
                { color: viewType === 'global' ? 'white' : '#2D4E85' }
              ]}>
                Global
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                leaderboardStyles.toggleButton,
                { backgroundColor: viewType === 'category' ? '#4A6741' : '#e9ecef' }
              ]}
              onPress={() => setViewType('category')}
            >
              <Text style={[
                leaderboardStyles.toggleText,
                { color: viewType === 'category' ? 'white' : '#2D4E85' }
              ]}>
                By Category
              </Text>
            </TouchableOpacity>
          </View>
          {viewType === 'category' && (
            <View style={leaderboardStyles.pickerContainer}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value)}
                style={leaderboardStyles.picker}
              >
                {categories.map((category) => (
                  <Picker.Item key={category.id} label={category.name} value={category.id} />
                ))}
              </Picker>
            </View>
          )}
          <ScrollView style={leaderboardStyles.scrollContent} showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={leaderboardStyles.loadingContainer}>
                <ActivityIndicator size="large" color="#2D4E85" />
                <Text style={[leaderboardStyles.loadingText, { color: '#2D4E85' }]}>Loading leaderboard...</Text>
              </View>
            ) : !Array.isArray(leaderboardData) || leaderboardData.length === 0 ? (
              renderEmptyState()
            ) : (
              <View style={leaderboardStyles.listContainer}>
                {leaderboardData.map((item, index) => renderEntry({ item, index }))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
}
