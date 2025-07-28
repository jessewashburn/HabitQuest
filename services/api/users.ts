// User/Auth API endpoints

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

console.log('🔧 Users API Configuration:', {
  API_BASE_URL,
  API_KEY: API_KEY ? `${API_KEY.substring(0, 10)}...` : 'Not set'
});

export type User = {
  id: string;
  username: string;
  email: string;
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

// Helper function to handle API responses
async function handleResponse(response: Response, endpoint: string) {
  console.log(`📡 API Response from ${endpoint}:`, {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok
  });

  if (!response.ok) {
    let errorText = '';
    try {
      // Try to get JSON error first
      const errorData = await response.json();
      errorText = errorData.error || errorData.message || JSON.stringify(errorData);
    } catch {
      // If JSON parsing fails, get text
      errorText = await response.text();
    }
    
    console.log(`❌ API Error from ${endpoint}:`, {
      status: response.status,
      statusText: response.statusText,
      errorText
    });
    
    // Convert server errors to user-friendly messages
    const userFriendlyError = getUserFriendlyErrorMessage(errorText, response.status, endpoint);
    throw new Error(userFriendlyError);
  }
  
  const data = await response.json();
  console.log(`✅ API Success from ${endpoint}:`, data);
  return data;
}

// Convert technical error messages to user-friendly ones
function getUserFriendlyErrorMessage(errorText: string, status: number, endpoint: string): string {
  const lowerError = errorText.toLowerCase();
  
  console.log('🔍 Converting error:', { errorText, status, endpoint, lowerError });
  
  // Registration errors
  if (endpoint.includes('/signup')) {
    if (lowerError.includes('email') && lowerError.includes('already')) {
      return 'An account with this email already exists. Please use a different email or try logging in.';
    }
    if (lowerError.includes('username') && lowerError.includes('already')) {
      return 'This username is already taken. Please choose a different username.';
    }
    if (lowerError.includes('email') && lowerError.includes('invalid')) {
      return 'Please enter a valid email address.';
    }
    if (lowerError.includes('password') && lowerError.includes('6')) {
      return 'Password must be at least 6 characters long.';
    }
    if (lowerError.includes('username') && lowerError.includes('3')) {
      return 'Username must be at least 3 characters long.';
    }
  }
  
  // Login errors
  if (endpoint.includes('/signin')) {
    if (lowerError.includes('invalid credentials') || 
        lowerError.includes('unauthorized') || 
        lowerError.includes('invalid') ||
        lowerError.includes('password') ||
        lowerError.includes('wrong') ||
        status === 401) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    if (lowerError.includes('user not found') || lowerError.includes('not found')) {
      return 'No account found with this email. Please check your email or create a new account.';
    }
  }
  
  // Generic errors
  if (status === 400) {
    return 'Invalid request. Please check your information and try again.';
  }
  if (status === 500) {
    return 'Server error. Please try again later.';
  }
  if (status === 403) {
    return 'Access denied. Please check your credentials.';
  }
  
  // Return original error if no specific mapping found
  console.log('⚠️ No specific mapping found, returning original error');
  return errorText || 'An unexpected error occurred. Please try again.';
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
  },
  
  removeToken(): void {
    localStorage.removeItem('authToken');
  }
};

export const usersAPI = {
  async register(userData: RegisterData): Promise<User> {
    console.log('📝 Registration request data:', userData);
    
    return await makeRequest('/api/users/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async login(loginData: LoginData): Promise<LoginResponse> {
    console.log('🔑 Login request data:', { email: loginData.email });
    
    const result = await makeRequest('/api/users/signin', {
      method: 'POST',
      body: JSON.stringify(loginData)
    });
    
    if (result.token) {
      tokenUtils.setToken(result.token);
    }
    
    return result;
  }
};

// User profile types based on the /me endpoint response
export type UserProfile = {
  user: {
    id: string;
    email: string;
    username: string;
    theme: string;
  };
  habits: Array<{
    habitId: string;
    habitName: string;
    habitDetails: {
      id: string;
      name: string;
      createdDate: string;
      startDate: string;
      userId: string;
      categoryId: string;
      status: string;
      category: {
        id: string;
        name: string;
        active: boolean;
      };
    };
    message: string;
    habitTask: {
      id: string;
      taskDate: string;
      isCompleted: boolean;
      completedAt: string | null;
      createdAt: string;
      updatedAt: string;
    };
    currentStreak: any;
    allStreaks: any[];
    created: boolean;
  }>;
  levels: {
    totalLevel: number;
    totalExperience: number;
    categoryLevels: any[];
  };
  friends: {
    friends: any[];
    pendingRequests: any[];
    sentRequests: any[];
  };
  experience: {
    totalExperience: number;
    todayExperience: number;
    categoryBreakdown: any[];
  };
};

// Fetch full user profile from /me endpoint
export async function getUserProfile(userId?: string): Promise<UserProfile> {
  const token = tokenUtils.getToken();
  if (!token) throw new Error('No auth token found');
  
  // If no userId provided, try to extract from token
  let userIdToUse = userId;
  if (!userIdToUse) {
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      userIdToUse = tokenPayload.id;
    } catch (error) {
      throw new Error('Could not extract user ID from token');
    }
  }
  
  if (!userIdToUse) {
    throw new Error('No user ID available for profile request');
  }
  
  return await makeRequest(`/api/users/${userIdToUse}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

// For backward compatibility
export const authAPI = usersAPI;

// Fetch level and exp for a user
export async function getLevelAndExp(userId: string): Promise<{ level: number; exp: number }> {
  const token = tokenUtils.getToken();
  if (!token) throw new Error('No auth token found');
  // Use main API config and request helper
  const result = await makeRequest(`/api/users/${userId}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  // Support both { levels, experience } and { level, exp }
  if (result.level !== undefined && result.exp !== undefined) {
    return { level: result.level, exp: result.exp };
  }
  if (result.levels && result.experience) {
    // friendsAPI.getUserProfile returns levels.totalLevel and experience.totalExperience
    return {
      level: result.levels.totalLevel ?? 0,
      exp: result.experience.totalExperience ?? 0
    };
  }
  throw new Error('Level/exp data not found in backend response');
}
