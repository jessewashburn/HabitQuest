// Habits API endpoints

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export type Habit = {
  id: string;
  name: string;
  description?: string;
  frequency: string;
  completed: boolean;
  streak: number;
  points: number;
  category: 'Health' | 'Productivity' | 'Spiritual';
  lastCompletedDate?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateHabitData = {
  name: string;
  description?: string;
  category: 'Health' | 'Productivity' | 'Spiritual';
  frequency: string;
};

// Helper function to handle API responses
async function handleResponse(response: Response, endpoint: string) {
  if (!response.ok) {
    const errorText = await response.text();
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

// Token utilities
const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const habitsAPI = {
  async getHabits(): Promise<Habit[]> {
    const token = getToken();
    return await makeRequest('/api/habits', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  async createHabit(habitData: CreateHabitData): Promise<Habit> {
    const token = getToken();
    return await makeRequest('/api/habits/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(habitData)
    });
  },

  async updateHabit(habitId: string, habitData: Partial<CreateHabitData>): Promise<Habit> {
    const token = getToken();
    return await makeRequest(`/api/habits/${habitId}/update`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(habitData)
    });
  },

  async deleteHabit(habitId: string): Promise<void> {
    const token = getToken();
    await makeRequest(`/api/habits/${habitId}/delete`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  async completeHabit(habitId: string): Promise<Habit> {
    const token = getToken();
    return await makeRequest(`/api/habits/${habitId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};
