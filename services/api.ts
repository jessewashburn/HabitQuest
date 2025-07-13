// API configuration and utility functions

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

console.log('🔧 API Configuration:', {
  API_BASE_URL,
  API_KEY: API_KEY ? `${API_KEY.substring(0, 10)}...` : 'Not set'
});

export type User = {
  id: string;
  username: string;
  email: string;
};

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

export type LoginResponse = {
  token: string;
  user: User;
};

export type RegisterData = {
  username: string;
  email: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type CreateHabitData = {
  name: string;
  description?: string;
  category: 'Health' | 'Productivity' | 'Spiritual';
  frequency: string;
};

// Helper function to handle API responses
async function handleResponse(response: Response, endpoint: string) {
  console.log(`📡 API Response from ${endpoint}:`, {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    headers: Object.fromEntries(response.headers.entries())
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log(`❌ API Error from ${endpoint}:`, {
      status: response.status,
      statusText: response.statusText,
      errorText
    });

    // Check if this looks like a CORS error
    const isCorsLikely = !response.headers.get('access-control-allow-origin') && 
                        response.status === 0;
    
    if (isCorsLikely) {
      console.log(`🔥 Network/CORS Error for ${endpoint}:`, {
        error: 'Possible CORS issue',
        type: 'Network Error',
        isCorsLikely: true
      });
    } else {
      console.log(`🔥 Network/CORS Error for ${endpoint}:`, {
        error: response.statusText || 'Unknown error',
        type: 'Error',
        isCorsLikely: false
      });
    }

    throw new Error(response.statusText || 'Network error');
  }

  const data = await response.json();
  console.log(`✅ API Success from ${endpoint}:`, data);
  return data;
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

  console.log(`🚀 Making API request to ${endpoint}:`, {
    url,
    method: config.method || 'GET',
    headers: config.headers,
    body: config.body
  });

  try {
    const response = await fetch(url, config);
    return await handleResponse(response, endpoint);
  } catch (error) {
    console.error(`💥 API Request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Token utilities
export const tokenUtils = {
  getToken(): string | null {
    return localStorage.getItem('authToken');
  },
  
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
    console.log('🔐 Auth token stored');
  },
  
  removeToken(): void {
    localStorage.removeItem('authToken');
    console.log('🚪 Auth token removed');
  }
};

// Auth API endpoints
export const authAPI = {
  async register(userData: RegisterData): Promise<User> {
    console.log('📝 Attempting to register user:', { username: userData.username, email: userData.email });
    
    console.log('🔍 Using correct endpoint: /api/users/signup');
    return await makeRequest('/api/users/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async login(loginData: LoginData): Promise<LoginResponse> {
    console.log('🔑 Attempting to login user:', { email: loginData.email });
    
    console.log('🔍 Using correct endpoint: /api/users/signin');
    const result = await makeRequest('/api/users/signin', {
      method: 'POST',
      body: JSON.stringify(loginData)
    });
    
    // Store the token
    if (result.token) {
      tokenUtils.setToken(result.token);
    }
    
    return result;
  }
};

// Habits API endpoints
export const habitsAPI = {
  async getHabits(): Promise<Habit[]> {
    const token = tokenUtils.getToken();
    return await makeRequest('/habits', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  async createHabit(habitData: CreateHabitData): Promise<Habit> {
    const token = tokenUtils.getToken();
    return await makeRequest('/habits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(habitData)
    });
  },

  async updateHabit(habitId: string, habitData: Partial<CreateHabitData>): Promise<Habit> {
    const token = tokenUtils.getToken();
    return await makeRequest(`/habits/${habitId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(habitData)
    });
  },

  async deleteHabit(habitId: string): Promise<void> {
    const token = tokenUtils.getToken();
    await makeRequest(`/habits/${habitId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  async completeHabit(habitId: string): Promise<Habit> {
    const token = tokenUtils.getToken();
    return await makeRequest(`/habits/${habitId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};
