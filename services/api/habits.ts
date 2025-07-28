// Habits API endpoints
import type { Category } from './categories';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export type HabitStatus = 'Active' | 'Draft' | 'Completed' | 'Cancelled' | 'Deleted';

export type HabitTask = {
  id: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Skipped';
  expAwarded?: number;
  streak?: number;
};

export type Habit = {
  id: string;
  name: string;
  createdDate: string;
  startDate: string | null;
  status: HabitStatus;
  user: {
    id: string;
    email: string;
    username: string;
  };
  category: Category;
  tasks?: HabitTask[];
};

export type CreateHabitData = {
  name: string;
  startDate?: string;
  userId: string;
  categoryId: string;
  status?: HabitStatus;
};

export type UpdateHabitData = {
  name?: string;
  status?: string;
  startDate?: string;
  categoryId?: string; // allow categoryId for backend
  category?: string; // allow category for backend update
};

// Helper function to handle API responses
async function handleResponse(response: Response, endpoint: string) {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error for ${endpoint}:`, errorText);
    throw new Error(response.statusText || 'Network error');
  }
  return await response.json();
}

// Main API request function
async function makeRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY || '',
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  return await handleResponse(response, endpoint);
}

// Token utilities - Use localStorage like the users API
const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const habitsAPI = {
  // Get habits for a specific user (based on the backend route structure)
  async getHabitsByUser(userId: string): Promise<Habit[]> {
    const token = getToken();
    return await makeRequest(`/api/habits/${userId}/get`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  async createHabit(habitData: CreateHabitData): Promise<{ message: string; habit: Habit }> {
    const token = getToken();
    return await makeRequest('/api/habits/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(habitData)
    });
  },

  async updateHabit(habitId: string, habitData: UpdateHabitData): Promise<{ message: string; habit: Habit }> {
    const token = getToken();
    return await makeRequest(`/api/habits/${habitId}/update`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(habitData)
    });
  },

  async deleteHabit(habitId: string): Promise<{ message: string }> {
    const token = getToken();
    return await makeRequest(`/api/habits/${habitId}/delete`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
  ,
  async completeHabitTask(taskId: string): Promise<{ message: string; expAwarded?: number; streak?: number; [key: string]: any }> {
    const token = getToken();
    const response = await makeRequest(`/api/habits/task/${taskId}/complete`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    // Extract expAwarded from experienceGained.totalExperience if present
    let expAwarded;
    if (response.experienceGained && typeof response.experienceGained.totalExperience === 'number') {
      expAwarded = response.experienceGained.totalExperience;
    }
    return { ...response, expAwarded };
  },
};
