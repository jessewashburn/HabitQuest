import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type Habit = {
  id: string;
  name: string;
  category: 'Health' | 'Productivity' | 'Spiritual';
  note?: string;
  isCompleted: boolean;
  streak: number;
  points: number;
  lastCompletedDate?: string;
};

type HabitsContextType = {
  habits: Habit[];
  toggleHabit: (id: string) => void;
  getCompletedHabits: () => Habit[];
  getDueHabits: () => Habit[];
};

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

// Utility function to check if it's a new day
const isNewDay = (lastDate?: string): boolean => {
  if (!lastDate) return true;
  const today = new Date().toDateString();
  return lastDate !== today;
};

// Utility function to reset habits for a new day
const resetHabitsForNewDay = (habits: Habit[]): Habit[] => {
  const today = new Date().toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toDateString();
  
  return habits.map(habit => {
    // If habit was completed but it's a new day, reset it
    if (habit.isCompleted && isNewDay(habit.lastCompletedDate)) {
      const wasCompletedYesterday = habit.lastCompletedDate === yesterdayString;
      
      return {
        ...habit,
        isCompleted: false,
        lastCompletedDate: undefined,
        // Only maintain streak if completed yesterday, otherwise reset to 0
        streak: wasCompletedYesterday ? habit.streak : 0
      };
    }
    // If habit wasn't completed and we missed yesterday, reset streak to 0
    else if (!habit.isCompleted) {
      const wasCompletedYesterday = habit.lastCompletedDate === yesterdayString;
      
      // If we have a lastCompletedDate but it wasn't yesterday, reset streak
      if (habit.lastCompletedDate && !wasCompletedYesterday) {
        return {
          ...habit,
          streak: 0
        };
      }
    }
    return habit;
  });
};

const initialHabits: Habit[] = [
  { id: '1', name: 'Drink 8 glasses of water', category: 'Health', note: 'Stay hydrated!', isCompleted: false, streak: 5, points: 10 },
  { id: '2', name: 'Study 2 hours', category: 'Productivity', isCompleted: false, streak: 3, points: 20 },
  { id: '3', name: 'Morning meditation', category: 'Spiritual', isCompleted: false, streak: 10, points: 15 },
  { id: '4', name: 'Exercise 30 minutes', category: 'Health', isCompleted: false, streak: 2, points: 12 },
  { id: '5', name: 'Plan daily goals', category: 'Productivity', isCompleted: false, streak: 6, points: 9 },
  { id: '6', name: 'Read 10 pages', category: 'Productivity', isCompleted: false, streak: 4, points: 11 },
  { id: '7', name: 'Practice gratitude', category: 'Spiritual', isCompleted: false, streak: 7, points: 13 },
  { id: '8', name: 'Stretch in the morning', category: 'Health', isCompleted: false, streak: 1, points: 6 },
  { id: '9', name: 'Journal before bed', category: 'Spiritual', isCompleted: false, streak: 5, points: 14 },
  { id: '10', name: 'No social media after 9pm', category: 'Productivity', isCompleted: false, streak: 2, points: 8 },
  { id: '11', name: 'Call a friend', category: 'Spiritual', isCompleted: false, streak: 1, points: 7 },
  { id: '12', name: 'Cook a healthy meal', category: 'Health', isCompleted: false, streak: 3, points: 10 },
  { id: '13', name: 'Review class notes', category: 'Productivity', isCompleted: false, streak: 6, points: 16 },
  { id: '14', name: 'Affirmations', category: 'Spiritual', isCompleted: false, streak: 5, points: 9 },
  { id: '15', name: 'Sleep 8 hours', category: 'Health', isCompleted: false, streak: 2, points: 10 },
  { id: '16', name: 'Inbox Zero', category: 'Productivity', isCompleted: false, streak: 4, points: 7 },
  { id: '17', name: 'Donate or help someone', category: 'Spiritual', isCompleted: false, streak: 1, points: 12 },
  { id: '18', name: 'Meal prep for tomorrow', category: 'Health', isCompleted: false, streak: 2, points: 11 },
  { id: '19', name: 'Watch a TED Talk', category: 'Productivity', isCompleted: false, streak: 3, points: 9 },
  { id: '20', name: 'Reflect on goals', category: 'Spiritual', isCompleted: false, streak: 2, points: 8 },
];

type HabitsProviderProps = {
  children: ReactNode;
};

export function HabitsProvider({ children }: HabitsProviderProps) {
  const [habits, setHabits] = useState<Habit[]>(() => {
    // Apply daily reset on initial load
    return resetHabitsForNewDay(initialHabits);
  });

  // Check for daily reset when component mounts and periodically
  useEffect(() => {
    const checkAndResetHabits = () => {
      setHabits(currentHabits => {
        const resetHabits = resetHabitsForNewDay(currentHabits);
        return resetHabits;
      });
    };

    // Check immediately
    checkAndResetHabits();
    
    // Check every minute for daily reset (in case app is open overnight)
    const interval = setInterval(checkAndResetHabits, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleHabit = (id: string) => {
    const today = new Date().toDateString();
    setHabits(currentHabits => {
      return currentHabits.map(habit =>
        habit.id === id 
          ? { 
              ...habit, 
              isCompleted: !habit.isCompleted,
              lastCompletedDate: !habit.isCompleted ? today : undefined,
              streak: !habit.isCompleted ? habit.streak + 1 : habit.streak
            } 
          : habit
      );
    });
  };

  const getCompletedHabits = () => {
    return habits.filter(habit => habit.isCompleted);
  };

  const getDueHabits = () => {
    return habits.filter(habit => !habit.isCompleted);
  };

  return (
    <HabitsContext.Provider value={{ 
      habits, 
      toggleHabit, 
      getCompletedHabits, 
      getDueHabits 
    }}>
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
}
