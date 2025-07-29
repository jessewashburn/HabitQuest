// Leaderboards API endpoints

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export type StreakLeaderboardEntry = {
  rank: number;
  userId: string;
  username: string;
  habitId: string;
  habitName: string;
  categoryId: string;
  categoryName: string;
  streakCount: number;
  isActive: boolean;
};

export type UserStreakLeaderboardEntry = {
  rank: number;
  userId: string;
  username: string;
  totalStreaks: number;
  activeStreaks: number;
  averageStreak: number;
};

export type CategoryLevelLeaderboardEntry = {
  rank: number;
  userId: string;
  username: string;
  categoryId: string;
  categoryName: string;
  level: number;
  experience: number;
  progressToNext: number;
};

export type UserLevelLeaderboardEntry = {
  rank: number;
  userId: string;
  username: string;
  totalLevel: number;
  totalExperience: number;
  categoriesCount: number;
};

// API Response wrapper types
export type LeaderboardResponse = {
  type: string;
  leaderboardType: string;
  categoryId?: string;
  limit: number;
  entries: StreakLeaderboardEntry[] | UserStreakLeaderboardEntry[] | CategoryLevelLeaderboardEntry[] | UserLevelLeaderboardEntry[];
  count: number;
};

async function handleResponse(response: Response, endpoint: string) {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error for ${endpoint}:`, errorText);
    throw new Error(response.statusText || 'Network error');
  }
  return await response.json();
}

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

export const leaderboardsAPI = {
  async getStreaksByCategory(categoryId: string, limit: number = 10): Promise<StreakLeaderboardEntry[]> {
    const response: LeaderboardResponse = await makeRequest(`/api/leaderboards?type=streak-by-category&categoryId=${categoryId}&limit=${limit}`);
    return response.entries as StreakLeaderboardEntry[];
  },

  async getStreaksByUser(limit: number = 10): Promise<UserStreakLeaderboardEntry[]> {
    const response: LeaderboardResponse = await makeRequest(`/api/leaderboards?type=streak-by-user&limit=${limit}`);
    return response.entries as UserStreakLeaderboardEntry[];
  },

  async getLevelsByCategory(categoryId: string, limit: number = 10): Promise<CategoryLevelLeaderboardEntry[]> {
    const response: LeaderboardResponse = await makeRequest(`/api/leaderboards?type=level-by-category&categoryId=${categoryId}&limit=${limit}`);
    return response.entries as CategoryLevelLeaderboardEntry[];
  },

  async getLevelsByUser(limit: number = 10): Promise<UserLevelLeaderboardEntry[]> {
    const response: LeaderboardResponse = await makeRequest(`/api/leaderboards?type=level-by-user&limit=${limit}`);
    return response.entries as UserLevelLeaderboardEntry[];
  }
};