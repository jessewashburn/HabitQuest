import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useHabits } from '../contexts/HabitsContext';
import { categoriesAPI, Category, Habit, UpdateHabitData } from '../services/api';
import { habitsAPI } from '../services/api/habits';
import { getLevelAndExp } from '../services/api/users';
import styles from './habits.styles';

export default function HabitsPage() {
  const { user } = useAuth();
  const { 
    habits, 
    loading, 
    error, 
    createHabit,
    updateHabit, 
    deleteHabit,
    getActiveHabits, 
    getDraftHabits 
  } = useHabits();

  // Ensure habits are only for the current user and starter habits are loaded after registration
  useEffect(() => {
    // Load habits for the new user (starter habits seeded by backend)
    if (user?.id && typeof getActiveHabits === 'function') {
      getActiveHabits();
    }
    if (user?.id && typeof getDraftHabits === 'function') {
      getDraftHabits();
    }
  }, [user?.id]);
  const { theme, colors } = require('@/hooks/ThemeContext').useTheme();
  // Snackbar modal state
  const [snackbar, setSnackbar] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  // Auto-dismiss snackbar after 2s
  React.useEffect(() => {
    if (snackbar) {
      const timer = setTimeout(() => setSnackbar(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [snackbar]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    status: 'Draft' as 'Active' | 'Draft' | 'Completed',
    startDate: ''
  });

  // Sorting: alphabetically, completed at bottom, then by points descending (if present)
  function sortHabitsForDisplay(arr: Habit[]) {
    return [...arr].sort((a, b) => {
      // 1. Alphabetical by name
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      // 2. Completed at bottom (if status exists)
      if (a.status === 'Completed' && b.status !== 'Completed') return 1;
      if (a.status !== 'Completed' && b.status === 'Completed') return -1;
      return 0;
    });
  }

  const activeHabits = sortHabitsForDisplay(habits.filter((h: Habit) => h.status === 'Active'));
  const draftHabits = sortHabitsForDisplay(habits.filter((h: Habit) => h.status === 'Draft'));
  const completedHabits = sortHabitsForDisplay(habits.filter((h: Habit) => h.status === 'Completed'));

  // Reset completed habits daily if their startDate is before today
  useEffect(() => {
    const resetCompletedHabitsDaily = async () => {
      const today = new Date().toISOString().split('T')[0];
      const habitsToReset = habits.filter(habit => {
        if (habit.status === 'Completed' && habit.startDate) {
          // Only reset if startDate is before today
          return habit.startDate < today;
        }
        return false;
      });
      for (const habit of habitsToReset) {
        try {
          await updateHabit(habit.id, { status: 'Active', startDate: today });
        } catch (e) {
          // Optionally handle error
        }
      }
    };
    resetCompletedHabitsDaily();
    loadCategories();
  }, [habits]);

  const loadCategories = async () => {
    try {
      const fetchedCategories = await categoriesAPI.getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      categoryId: '',
      status: 'Draft',
      startDate: ''
    });
    setEditingHabit(null);
  };

  const handleCreateHabit = async () => {
    if (!formData.name.trim() || !formData.categoryId || !user?.id) {
      setSnackbar({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    // Validate start date for non-Draft habits
    let startDate = formData.startDate;
    if (formData.status !== 'Draft') {
      if (!startDate) {
        // Auto-set to today's date if not provided for non-Draft habits
        startDate = new Date().toISOString().split('T')[0];
      }
    }

    try {
      await createHabit({
        name: formData.name.trim(),
        categoryId: formData.categoryId,
        userId: user.id,
        status: formData.status,
        startDate: startDate || undefined
      });
      setShowCreateModal(false);
      resetForm();
      setSnackbar({ type: 'success', message: 'Habit created successfully!' });
    } catch (error) {
      console.error('Failed to create habit:', error);
      setSnackbar({ type: 'error', message: 'Failed to create habit' });
    }
  };

  const handleUpdateHabit = async () => {
    if (!editingHabit || !formData.name.trim()) {
      setSnackbar({ type: 'error', message: 'Please enter a habit name.' });
      return;
    }

    try {
      // Update name, status, and startDate
      const updateData: UpdateHabitData = {
        name: formData.name.trim(),
        status: formData.status,
        startDate: formData.startDate || undefined
      };
      await updateHabit(editingHabit.id, updateData);
      setEditingHabit(null);
      resetForm();
      setSnackbar({ type: 'success', message: 'Habit updated successfully!' });
    } catch (error) {
      console.error('Failed to update habit:', error);
      setSnackbar({ type: 'error', message: 'Failed to update habit' });
    }
  };

  const handleDeleteHabit = async (habitId: string, habitName: string) => {
    // Use Alert for confirmation, then show snackbar for result
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habitName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHabit(habitId);
              setSnackbar({ type: 'success', message: 'Habit deleted successfully!' });
            } catch (error) {
              setSnackbar({ type: 'error', message: 'Failed to delete habit' });
            }
          }
        }
      ]
    );
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setFormData({
      name: habit.name || '',
      categoryId: habit.category?.id || '',
      status: habit.status as 'Active' | 'Draft' | 'Completed',
      startDate: habit.startDate || ''
    });
  };

  const handleStatusToggle = async (habitId: string, currentStatus: string) => {
    try {
      // Toggle between Active and Completed
      const newStatus = currentStatus === 'Active' ? 'Completed' : 'Active';
      const habit = habits.find((h: Habit) => h.id === habitId);
      if (!habit) return;

      if (newStatus === 'Completed') {
        // Find today's habit task for this habit
        const today = new Date().toISOString().split('T')[0];
        const habitTask = habit.tasks?.find((t: any) => t.date === today);
        if (habitTask) {
          await habitsAPI.completeHabitTask(habitTask.id);
        } else {
          // fallback: update habit status if no task found
          await updateHabit(habitId, { status: 'Completed' });
        }
        // Fetch updated exp/level and trigger profile refresh
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('refresh-profile-exp'));
        }
        if (user?.id) {
          const expInfo = await getLevelAndExp(user.id);
          console.log('🎮 Updated User Level/EXP:', expInfo);
        }
      } else {
        // Toggle back to Active
        await updateHabit(habitId, { status: 'Active' });
      }
    } catch (error) {
      console.error('Failed to update habit status:', error);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#F5EDD8', '#6BA8D6']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.gradientBackground}
      >
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#4A6741" />
          <Text style={styles.loadingText}>Loading your habits...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={['#F5EDD8', '#6BA8D6']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.gradientBackground}
      >
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <>
      <LinearGradient
        colors={colors.gradient}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.gradientBackground}
      >
        <View style={styles.container}> 
          <View style={styles.narrowContainer}>
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Text style={[styles.title, { color: colors.text }]}>Your Habits</Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: colors.buttonBackground,
                paddingVertical: 10,
                paddingHorizontal: 24,
                borderRadius: 8,
                alignSelf: 'center',
                marginBottom: 16
              }}
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={{ color: colors.buttonText, fontSize: 16, fontWeight: 'bold' }}>New Habit</Text>
            </TouchableOpacity>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              style={{ flex: 1 }}
            >
              {/* Snackbar Modal */}
              {snackbar && (
                <Modal
                  transparent
                  visible={!!snackbar}
                  animationType="fade"
                  onRequestClose={() => setSnackbar(null)}
                >
                  <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                    <View style={{
                      backgroundColor: snackbar.type === 'success' ? colors.buttonBackground : '#d32f2f',
                      padding: 14,
                      borderRadius: 8,
                      marginBottom: 40,
                      minWidth: 200,
                      alignItems: 'center',
                      shadowColor: '#000',
                      shadowOpacity: 0.2,
                      shadowRadius: 8,
                      elevation: 4
                    }}>
                      <Text style={{ color: colors.buttonText, fontWeight: 'bold', fontSize: 16 }}>{snackbar.message}</Text>
                    </View>
                  </View>
                </Modal>
              )}
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <Modal
          transparent
          visible={!!deleteConfirm}
          animationType="fade"
          onRequestClose={() => setDeleteConfirm(null)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <View style={{ backgroundColor: colors.background, padding: 24, borderRadius: 12, alignItems: 'center', minWidth: 260 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: colors.text }}>Delete Habit</Text>
              <Text style={{ fontSize: 16, marginBottom: 24, color: colors.text }}>Are you sure you want to delete "{deleteConfirm.name}"?</Text>
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <TouchableOpacity
                  style={{ backgroundColor: '#d32f2f', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8, marginRight: 8 }}
                  onPress={async () => {
                    try {
                      await deleteHabit(deleteConfirm.id);
                      setSnackbar({ type: 'success', message: 'Habit deleted successfully!' });
                    } catch (error) {
                      setSnackbar({ type: 'error', message: 'Failed to delete habit' });
                    }
                    setDeleteConfirm(null);
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ backgroundColor: '#aaa', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 }}
                  onPress={() => setDeleteConfirm(null)}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
              {/* Active Habits */}
              {activeHabits.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Habits</Text>
                  {activeHabits.map((habit: Habit) => {
                    let cardBg = colors.background;
                    if (colors.background === '#23272A') cardBg = '#393E46';
                    return (
                      <TouchableOpacity 
                        key={habit.id} 
                        style={[styles.card, { backgroundColor: cardBg }]}
                        onPress={() => handleStatusToggle(habit.id, habit.status)}
                        activeOpacity={0.7}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.habitName, { color: colors.text }]}>{habit.name}</Text>
                          <Text style={[styles.category, { color: colors.text }]}>
                            {habit.category && habit.category.name ? habit.category.name : 'No category'}
                          </Text>
                          <Text style={[styles.meta, { color: colors.text }]}>🚀 Started: {new Date(habit.createdDate).toLocaleDateString()}</Text>
                          <Text style={[styles.meta, { color: colors.text }]}>📊 Status: {habit.status}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <TouchableOpacity 
                            style={[styles.checkbox, { backgroundColor: colors.buttonBackground }]}
                            onPress={() => handleEditHabit(habit)}
                          >
                            <Text style={[styles.checkmark, { color: colors.buttonText }]}>✏️</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={[styles.checkbox, { backgroundColor: '#d32f2f' }]}
                            onPress={() => setDeleteConfirm({ id: habit.id, name: habit.name })}
                          >
                            <Text style={styles.checkmark}>🗑️</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </>
              )}
              {/* Completed Habits */}
              {completedHabits.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Completed Habits</Text>
                  {completedHabits.map((habit: Habit) => {
                    let cardBg = colors.background;
                    if (colors.background === '#23272A') cardBg = '#393E46';
                    else cardBg = '#b6f5c9';
                    return (
                      <TouchableOpacity 
                        key={habit.id} 
                        style={[styles.card, styles.completedCard, { backgroundColor: cardBg }]}
                        onPress={() => handleStatusToggle(habit.id, habit.status)}
                        activeOpacity={0.7}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.habitName, styles.completedText, { color: colors.text }]}>{habit.name}</Text>
                          <Text style={[styles.category, { color: colors.text }]}>
                            {habit.category && habit.category.name ? habit.category.name : 'No category'}
                          </Text>
                          <Text style={[styles.meta, { color: colors.text }]}>🚀 Started: {new Date(habit.createdDate).toLocaleDateString()}</Text>
                          <Text style={[styles.meta, { color: colors.text }]}>📊 Status: {habit.status}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <TouchableOpacity 
                            style={[styles.checkbox, { backgroundColor: colors.buttonBackground }]}
                            onPress={() => handleEditHabit(habit)}
                          >
                            <Text style={[styles.checkmark, { color: colors.buttonText }]}>✏️</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={[styles.checkbox, { backgroundColor: '#d32f2f' }]}
                            onPress={() => setDeleteConfirm({ id: habit.id, name: habit.name })}
                          >
                            <Text style={styles.checkmark}>🗑️</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </>
              )}
              {/* Draft Habits */}
              {draftHabits.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Draft Habits</Text>
                  {draftHabits.map((habit: Habit) => {
                    let cardBg = colors.background;
                    if (colors.background === '#23272A') cardBg = '#393E46';
                    else cardBg = '#f2f2f2';
                    return (
                      <TouchableOpacity 
                        key={habit.id} 
                        style={[styles.card, styles.draftCard, { backgroundColor: cardBg }]}
                        activeOpacity={0.7}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.habitName, { color: colors.text }]}>{habit.name}</Text>
                          <Text style={[styles.category, { color: colors.text }]}>
                            {habit.category && habit.category.name ? habit.category.name : 'No category'}
                          </Text>
                          <Text style={[styles.meta, { color: colors.text }]}>🚀 Started: {new Date(habit.createdDate).toLocaleDateString()}</Text>
                          <Text style={[styles.meta, { color: colors.text }]}>📊 Status: {habit.status}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <TouchableOpacity 
                            style={[styles.checkbox, { backgroundColor: colors.buttonBackground }]}
                            onPress={() => handleEditHabit(habit)}
                          >
                            <Text style={[styles.checkmark, { color: colors.buttonText }]}>✏️</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={[styles.checkbox, { backgroundColor: '#d32f2f' }]}
                            onPress={() => setDeleteConfirm({ id: habit.id, name: habit.name })}
                          >
                            <Text style={styles.checkmark}>🗑️</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </>
              )}
              {habits.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>No habits yet!</Text>
                  <Text style={[styles.emptySubtitle, { color: colors.text }]}>Start building better habits today.</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </LinearGradient>
      {/* Create/Edit Habit Modal */}
      <Modal
        visible={showCreateModal || editingHabit !== null}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <LinearGradient
          colors={colors.gradient}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.gradientBackground}
        >
          <View style={styles.container}>
            <View style={styles.narrowContainer}>
              <Text style={[styles.title, { color: colors.text }]}>
                {editingHabit ? 'Edit Habit' : 'Create New Habit'}
              </Text>
              <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Habit Name (editable for both create and edit) */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Habit Name</Text>
                <TextInput
                  style={[styles.input, { color: theme === 'dark' ? '#fff' : colors.text, backgroundColor: theme === 'dark' ? '#23272A' : colors.inputBackground, borderColor: colors.border }]}
                  value={formData.name}
                  onChangeText={(text: string) => setFormData(prev => ({ ...prev, name: text }))}
                  placeholder="Enter habit name"
                  placeholderTextColor={theme === 'dark' ? '#aaa' : colors.placeholder}
                  maxLength={100}
                  editable={true}
                />
                {/* Show category and status fields for both create and edit. Show start date only for create. */}
                <>
                  {/* Category */}
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Category</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={[styles.categoryButton, formData.categoryId === category.id && styles.selectedCategory, {
                          backgroundColor: formData.categoryId === category.id
                            ? colors.buttonBackground
                            : (theme === 'dark' ? '#e0e0e0' : colors.inputBackground),
                          borderColor: colors.border
                        }]}
                        onPress={() => setFormData(prev => ({ ...prev, categoryId: category.id }))}
                      >
                        <Text style={[styles.categoryButtonText, formData.categoryId === category.id && styles.selectedCategoryText, {
                          color: formData.categoryId === category.id
                            ? colors.buttonText
                            : (theme === 'dark' ? '#23272A' : '#000')
                        }]}> 
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  {/* Status */}
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Status</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                    {(editingHabit ? ['Draft', 'Active'] : ['Draft', 'Active', 'Completed']).map((status) => (
                      <TouchableOpacity
                        key={status}
                        style={[styles.categoryButton, formData.status === status && styles.selectedCategory, {
                          backgroundColor: formData.status === status
                            ? colors.buttonBackground
                            : (theme === 'dark' ? '#e0e0e0' : colors.inputBackground),
                          borderColor: colors.border
                        }]}
                        onPress={() => {
                          const newFormData = { ...formData, status: status as 'Active' | 'Draft' | 'Completed' };
                          setFormData(newFormData);
                        }}
                      >
                        <Text style={[styles.categoryButtonText, formData.status === status && styles.selectedCategoryText, {
                          color: formData.status === status
                            ? colors.buttonText
                            : (theme === 'dark' ? '#23272A' : '#000')
                        }]}> 
                          {status}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  {/* Start Date (only for create) */}
                  {!editingHabit && (
                    <>
                      <Text style={[styles.sectionTitle, { color: colors.text }]}>Start Date</Text>
                      <TextInput
                        style={[styles.input, { color: theme === 'dark' ? '#fff' : colors.text, backgroundColor: theme === 'dark' ? '#23272A' : colors.inputBackground, borderColor: colors.border }]}
                        value={formData.startDate}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, startDate: text }))}
                        placeholder={'YYYY-MM-DD'}
                        placeholderTextColor={theme === 'dark' ? '#aaa' : colors.placeholder}
                        maxLength={10}
                        editable={true}
                      />
                    </>
                  )}
                </>
                {/* Action Buttons */}
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
                  <TouchableOpacity 
                    style={[styles.card, { flex: 1, alignItems: 'center', backgroundColor: '#d32f2f' }]}
                    onPress={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                  >
                    <Text style={[styles.habitName, { color: '#fff' }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.card, { flex: 1, alignItems: 'center', backgroundColor: colors.buttonBackground }]}
                    onPress={editingHabit ? handleUpdateHabit : handleCreateHabit}
                  >
                    <Text style={[styles.habitName, { color: colors.buttonText }]}> 
                      {editingHabit ? 'Update' : 'Create'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </LinearGradient>
      </Modal>
    </>
  )};
