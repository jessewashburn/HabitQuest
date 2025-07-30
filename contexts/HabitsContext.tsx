import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { CreateHabitData, Habit, HabitStatus, UpdateHabitData, habitsAPI } from '../services/api';
import { getUserProfile } from '../services/api/users';
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
      // Use /me endpoint to get habits with streaks
      const profile = await getUserProfile(user.id);
      // Map backend habits to Habit[]
      const fetchedHabits: Habit[] = (profile.habits || []).map((h: any) => {
        const details = h.habitDetails || {};
        return {
          id: details.id,
          name: details.name,
          createdDate: details.createdDate,
          startDate: details.startDate,
          status: details.status,
          user: { id: details.userId, email: '', username: '' },
          category: details.category,
          tasks: [], // Optionally map tasks if needed
          streak: h.currentStreak && typeof h.currentStreak.count === 'number' ? h.currentStreak.count : 0,
        };
      });
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
      await habitsAPI.createHabit(habitData);
      if (user?.id) {
        // Use /me endpoint to get habits with streaks
        const profile = await getUserProfile(user.id);
        const fetchedHabits: Habit[] = (profile.habits || []).map((h: any) => {
          const details = h.habitDetails || {};
          return {
            id: details.id,
            name: details.name,
            createdDate: details.createdDate,
            startDate: details.startDate,
            status: details.status,
            user: { id: details.userId, email: '', username: '' },
            category: details.category,
            tasks: [],
            streak: h.currentStreak && typeof h.currentStreak.count === 'number' ? h.currentStreak.count : 0,
          };
        });
        setHabits(fetchedHabits);
      }
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
      // Use /me endpoint to get habits with streaks
      const profile = await getUserProfile(user.id);
      // Map backend habits to Habit[]
      const fetchedHabits: Habit[] = (profile.habits || []).map((h: any) => {
        const details = h.habitDetails || {};
        return {
          id: details.id,
          name: details.name,
          createdDate: details.createdDate,
          startDate: details.startDate,
          status: details.status,
          user: { id: details.userId, email: '', username: '' },
          category: details.category,
          tasks: [],
          streak: h.currentStreak && typeof h.currentStreak.count === 'number' ? h.currentStreak.count : 0,
        };
      });
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
      if (user?.id) {
        // Use /me endpoint to get habits with streaks
        const profile = await getUserProfile(user.id);
        const fetchedHabits: Habit[] = (profile.habits || []).map((h: any) => {
          const details = h.habitDetails || {};
          return {
            id: details.id,
            name: details.name,
            createdDate: details.createdDate,
            startDate: details.startDate,
            status: details.status,
            user: { id: details.userId, email: '', username: '' },
            category: details.category,
            tasks: [],
            streak: h.currentStreak && typeof h.currentStreak.count === 'number' ? h.currentStreak.count : 0,
          };
        });
        setHabits(fetchedHabits);
      }
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
