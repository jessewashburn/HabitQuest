import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useHabits } from '../contexts/HabitsContext';
import { categoriesAPI, Category, Habit, UpdateHabitData } from '../services/api';
import styles from './habits.styles';

export default function HabitsPage() {
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
  
  const { user } = useAuth();
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

  const activeHabits = habits.filter(h => h.status === 'Active');
  const draftHabits = habits.filter(h => h.status === 'Draft');
  const completedHabits = habits.filter(h => h.status === 'Completed');

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

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
      
      // Find the habit to get current data
      const habit = habits.find(h => h.id === habitId);
      if (!habit) return;
      
      // Prepare update data
      const updateData: UpdateHabitData = { status: newStatus };
      
      // Both Active and Completed require a start date according to backend validation
      if (!habit.startDate) {
        updateData.startDate = new Date().toISOString().split('T')[0];
      }
      // If the habit already has a start date, include it to maintain consistency
      else {
        updateData.startDate = habit.startDate;
      }
      
      await updateHabit(habitId, updateData);
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
        colors={['#F5EDD8', '#6BA8D6']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.gradientBackground}
      >
        <View style={styles.container}>
          <View style={styles.narrowContainer}>
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Text style={styles.title}>Your Habits</Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: '#4A6741',
                paddingVertical: 10,
                paddingHorizontal: 24,
                borderRadius: 8,
                alignSelf: 'center',
                marginBottom: 16
              }}
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>New Habit</Text>
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
                      backgroundColor: snackbar.type === 'success' ? '#4A6741' : '#d32f2f',
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
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{snackbar.message}</Text>
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
            <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 12, alignItems: 'center', minWidth: 260 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Delete Habit</Text>
              <Text style={{ fontSize: 16, marginBottom: 24 }}>Are you sure you want to delete "{deleteConfirm.name}"?</Text>
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
                  <Text style={styles.sectionTitle}>Active Habits</Text>
                  {activeHabits.map((habit: Habit) => (
                    <TouchableOpacity 
                      key={habit.id} 
                      style={[styles.card]}
                      onPress={() => handleStatusToggle(habit.id, habit.status)}
                      activeOpacity={0.7}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.habitName}>{habit.name}</Text>
                        <Text style={styles.category}>
                          {habit.category && habit.category.name ? habit.category.name : 'No category'}
                        </Text>
                        <Text style={styles.meta}>🚀 Started: {new Date(habit.createdDate).toLocaleDateString()}</Text>
                        <Text style={styles.meta}>📊 Status: {habit.status}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <TouchableOpacity 
                          style={[styles.checkbox, { backgroundColor: '#2D4E85' }]}
                          onPress={() => handleEditHabit(habit)}
                        >
                          <Text style={styles.checkmark}>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.checkbox, { backgroundColor: '#d32f2f' }]}
                          onPress={() => setDeleteConfirm({ id: habit.id, name: habit.name })}
                        >
                          <Text style={styles.checkmark}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              )}
              {/* Completed Habits */}
              {completedHabits.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Completed Habits</Text>
                  {completedHabits.map((habit: Habit) => (
                    <TouchableOpacity 
                      key={habit.id} 
                      style={[styles.card, styles.completedCard]}
                      onPress={() => handleStatusToggle(habit.id, habit.status)}
                      activeOpacity={0.7}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.habitName, styles.completedText]}>{habit.name}</Text>
                        <Text style={styles.category}>
                          {habit.category && habit.category.name ? habit.category.name : 'No category'}
                        </Text>
                        <Text style={styles.meta}>🚀 Started: {new Date(habit.createdDate).toLocaleDateString()}</Text>
                        <Text style={styles.meta}>📊 Status: {habit.status}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <TouchableOpacity 
                          style={[styles.checkbox, { backgroundColor: '#2D4E85' }]}
                          onPress={() => handleEditHabit(habit)}
                        >
                          <Text style={styles.checkmark}>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.checkbox, { backgroundColor: '#d32f2f' }]}
                          onPress={() => setDeleteConfirm({ id: habit.id, name: habit.name })}
                        >
                          <Text style={styles.checkmark}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              )}
              {/* Draft Habits */}
              {draftHabits.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Draft Habits</Text>
                  {draftHabits.map((habit: Habit) => (
                    <TouchableOpacity 
                      key={habit.id} 
                      style={[styles.card, styles.draftCard]}
                      activeOpacity={0.7}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.habitName}>{habit.name}</Text>
                        <Text style={styles.category}>
                          {habit.category && habit.category.name ? habit.category.name : 'No category'}
                        </Text>
                        <Text style={styles.meta}>🚀 Started: {new Date(habit.createdDate).toLocaleDateString()}</Text>
                        <Text style={styles.meta}>📊 Status: {habit.status}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <TouchableOpacity 
                          style={[styles.checkbox, { backgroundColor: '#2D4E85' }]}
                          onPress={() => handleEditHabit(habit)}
                        >
                          <Text style={styles.checkmark}>✏️</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              )}
              {habits.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>No habits yet!</Text>
                  <Text style={styles.emptySubtitle}>Start building better habits today.</Text>
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
          colors={['#F5EDD8', '#6BA8D6']}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.gradientBackground}
        >
          <View style={styles.container}>
            <View style={styles.narrowContainer}>
              <Text style={styles.title}>
                {editingHabit ? 'Edit Habit' : 'Create New Habit'}
              </Text>
              <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Habit Name (editable for both create and edit) */}
                <Text style={styles.sectionTitle}>Habit Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text: string) => setFormData(prev => ({ ...prev, name: text }))}
                  placeholder="Enter habit name"
                  maxLength={100}
                  editable={true}
                />
                {/* Show category, status, and start date fields for both create and edit */}
                <>
                  {/* Category */}
                  <Text style={styles.sectionTitle}>Category</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.categoryButton,
                          formData.categoryId === category.id && styles.selectedCategory
                        ]}
                        onPress={() => setFormData(prev => ({ ...prev, categoryId: category.id }))}
                      >
                        <Text style={[
                          styles.categoryButtonText,
                          formData.categoryId === category.id && styles.selectedCategoryText
                        ]}>
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  {/* Status */}
                  <Text style={styles.sectionTitle}>Status</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                    {(['Draft', 'Active', 'Completed'] as const).map((status) => (
                      <TouchableOpacity
                        key={status}
                        style={[
                          styles.categoryButton,
                          formData.status === status && styles.selectedCategory
                        ]}
                        onPress={() => {
                          const newFormData = { ...formData, status };
                          // Auto-populate start date for non-Draft status
                          if (status !== 'Draft' && !formData.startDate) {
                            newFormData.startDate = new Date().toISOString().split('T')[0];
                          }
                          setFormData(newFormData);
                        }}
                      >
                        <Text style={[
                          styles.categoryButtonText,
                          formData.status === status && styles.selectedCategoryText
                        ]}>
                          {status}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  {/* Start Date */}
                  <Text style={styles.sectionTitle}>
                    Start Date {formData.status !== 'Draft' ? '(Required for Active/Completed)' : '(Optional)'}
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={formData.startDate}
                    onChangeText={(text: string) => setFormData(prev => ({ ...prev, startDate: text }))}
                    placeholder={formData.status !== 'Draft' ? 'YYYY-MM-DD (Required)' : 'YYYY-MM-DD (Optional)'}
                    maxLength={10}
                  />
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
                    <Text style={[styles.habitName, { color: 'white' }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.card, { flex: 1, alignItems: 'center', backgroundColor: '#4A6741' }]}
                    onPress={editingHabit ? handleUpdateHabit : handleCreateHabit}
                  >
                    <Text style={[styles.habitName, { color: 'white' }]}>
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
