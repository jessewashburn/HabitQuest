import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { CreateHabitData, Habit, HabitStatus, UpdateHabitData, habitsAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface HabitsContextType {
  habits: Habit[];
  loading: boolean;
  error: string | null;
  createHabit: (habit: CreateHabitData) => Promise<void>;
  updateHabit: (id: string, updates: UpdateHabitData) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  getHabitsByStatus: (status: HabitStatus) => Habit[];
  getActiveHabits: () => Habit[];
  getDraftHabits: () => Habit[];
  getCompletedHabits: () => Habit[];
  getDueHabits: () => Habit[];
  refreshHabits: () => Promise<void>;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

interface HabitsProviderProps {
  children: ReactNode;
}

export const HabitsProvider: React.FC<HabitsProviderProps> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadHabits = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!user?.id) {
        setError('No user logged in');
        return;
      }
      const fetchedHabits = await habitsAPI.getHabitsByUser(user.id);
      setHabits(fetchedHabits);
    } catch (err) {
      console.error('Failed to load habits:', err);
      setError(err instanceof Error ? err.message : 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadHabits();
    }
  }, [user?.id]);

  const createHabit = async (habitData: CreateHabitData) => {
    try {
      setError(null);
      const result = await habitsAPI.createHabit(habitData);
      setHabits(prev => [...prev, result.habit]);
    } catch (err) {
      console.error('Failed to create habit:', err);
      setError(err instanceof Error ? err.message : 'Failed to create habit');
      throw err;
    }
  };

  const updateHabit = async (id: string, updates: UpdateHabitData) => {
    try {
      setError(null);
      await habitsAPI.updateHabit(id, updates);
      // Refetch all habits to ensure category is populated
      if (user?.id) {
        const fetchedHabits = await habitsAPI.getHabitsByUser(user.id);
        setHabits(fetchedHabits);
      }
    } catch (err) {
      console.error('Failed to update habit:', err);
      setError(err instanceof Error ? err.message : 'Failed to update habit');
      throw err;
    }
  };

  const deleteHabit = async (id: string) => {
    try {
      setError(null);
      await habitsAPI.deleteHabit(id);
      setHabits(prev => prev.filter(habit => habit.id !== id));
    } catch (err) {
      console.error('Failed to delete habit:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete habit');
      throw err;
    }
  };

  const getHabitsByStatus = (status: HabitStatus): Habit[] => {
    return habits.filter(habit => habit.status === status);
  };

  const getActiveHabits = (): Habit[] => {
    return getHabitsByStatus('Active');
  };

  const getDraftHabits = (): Habit[] => {
    return getHabitsByStatus('Draft');
  };

  const getCompletedHabits = (): Habit[] => {
    return getHabitsByStatus('Completed');
  };

  const getDueHabits = (): Habit[] => {
    // Return active habits that are not completed - these are "due"
    return getHabitsByStatus('Active');
  };

  const refreshHabits = async () => {
    await loadHabits();
  };

  const value: HabitsContextType = {
    habits,
    loading,
    error,
    createHabit,
    updateHabit,
    deleteHabit,
    getHabitsByStatus,
    getActiveHabits,
    getDraftHabits,
    getCompletedHabits,
    getDueHabits,
    refreshHabits,
  };

  return (
    <HabitsContext.Provider value={value}>
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = (): HabitsContextType => {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
};
