// Categories API endpoints

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export type Category = {
  id: string;
  name: string;
  active: boolean;
};

export type CreateCategoryData = {
  name: string;
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

export const categoriesAPI = {
  async getCategories(): Promise<Category[]> {
    const token = getToken();
    return await makeRequest('/api/categories/get', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  async createCategory(categoryData: CreateCategoryData): Promise<Category> {
    const token = getToken();
    return await makeRequest('/api/categories/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(categoryData)
    });
  },

  async toggleCategoryActive(categoryId: string): Promise<Category> {
    const token = getToken();
    return await makeRequest(`/api/categories/${categoryId}/toggleActive`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

};
