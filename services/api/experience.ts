
import { apiGet } from './api';

// Get total and category experience for a user from leaderboard endpoint
export const getUserExperience = async (userId: string) => {
  // Try leaderboard endpoint for user experience
  return await apiGet(`/api/leaderboards?type=level-by-user&userId=${userId}`);
};

// Get all streaks for a user from leaderboard endpoint
export const getUserStreaks = async (userId: string) => {
  // Try leaderboard endpoint for user streaks
  return await apiGet(`/api/leaderboards?type=streak-by-user&userId=${userId}`);
};
