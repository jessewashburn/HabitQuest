// Friends API endpoints

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

// Types
export type Friend = {
  id: string;
  userId: string;
  targetUserId: string;
  type: 'FRIEND' | 'PENDING' | 'BLOCKED';
  user?: {
    id: string;
    username: string;
    email: string;
  };
  targetUser?: {
    id: string;
    username: string;
    email: string;
  };
};

export type FriendRequest = {
  id: string;
  userId: string;
  targetUserId: string;
  type: 'PENDING';
  user?: {
    id: string;
    username: string;
    email: string;
  };
  targetUser?: {
    id: string;
    username: string;
    email: string;
  };
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

// No localStorage. All API calls require userId and token to be passed explicitly.

/**
 * All API functions require explicit userId and token arguments (and targetUserId where needed).
 * Example usage:
 *   friendsAPI.getFriends(userId, token)
 *   friendsAPI.searchUsers(query, token)
 *   friendsAPI.sendFriendRequest(userId, targetUserId, token)
 *   friendsAPI.acceptFriendRequest(userRelationshipId, token)
 *   friendsAPI.removeFriend(userRelationshipId, token)
 *   friendsAPI.getPendingRequests(userId, token)
 *   friendsAPI.getSentRequests(userId, token)
 *   friendsAPI.blockUser(userId, targetUserId, token)
 *   friendsAPI.getUserProfile(userId, token)
 */
export const friendsAPI = {
  async getFriends(userId: string, token: string): Promise<Friend[]> {
    if (!userId) throw new Error('userId is required');
    if (!token) throw new Error('token is required');
    return await makeRequest(`/api/friends/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  async searchUsers(query: string, token: string): Promise<any[]> {
    if (!token) throw new Error('token is required');
    const endpoint = `/api/users?search=${encodeURIComponent(query)}`;
    console.log('[FriendsAPI] searchUsers:', { endpoint, token });
    return await makeRequest(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  async sendFriendRequest(userId: string, targetUserId: string, token: string): Promise<FriendRequest> {
    if (!userId || !targetUserId) throw new Error('userId and targetUserId are required');
    if (!token) throw new Error('token is required');
    return await makeRequest('/api/friends/request', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId, targetUserId })
    });
  },

  async acceptFriendRequest(userRelationshipId: string, token: string): Promise<Friend> {
    if (!userRelationshipId) throw new Error('userRelationshipId is required');
    if (!token) throw new Error('token is required');
    return await makeRequest(`/api/friends/${userRelationshipId}/accept`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  async removeFriend(userRelationshipId: string, token: string): Promise<{ message: string }> {
    if (!userRelationshipId) throw new Error('userRelationshipId is required');
    if (!token) throw new Error('token is required');
    return await makeRequest(`/api/friends/${userRelationshipId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  async getPendingRequests(userId: string, token: string): Promise<FriendRequest[]> {
    if (!userId) throw new Error('userId is required');
    if (!token) throw new Error('token is required');
    return await makeRequest(`/api/friends/${userId}/requests/pending`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  async getSentRequests(userId: string, token: string): Promise<FriendRequest[]> {
    if (!userId) throw new Error('userId is required');
    if (!token) throw new Error('token is required');
    return await makeRequest(`/api/friends/${userId}/requests/sent`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  async blockUser(userId: string, targetUserId: string, token: string): Promise<Friend> {
    if (!userId || !targetUserId) throw new Error('userId and targetUserId are required');
    if (!token) throw new Error('token is required');
    return await makeRequest('/api/friends/block', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId, targetUserId })
    });
  },

  async getUserProfile(userId: string, token: string): Promise<{ user: any; levels: any; experience: any }> {
    if (!userId) throw new Error('userId is required');
    if (!token) throw new Error('token is required');
    return await makeRequest(`/api/users/${userId}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};
