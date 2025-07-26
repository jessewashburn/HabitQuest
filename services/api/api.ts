// API base config and helper for HabitQuest

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

async function handleResponse(response: Response, endpoint: string) {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error for ${endpoint}:`, errorText);
    throw new Error(response.statusText || 'Network error');
  }
  return await response.json();
}

export async function apiGet(endpoint: string, token?: string) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY || '',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(url, { headers });
  return await handleResponse(response, endpoint);
}

export async function apiPost(endpoint: string, body: any, token?: string) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY || '',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  return await handleResponse(response, endpoint);
}
