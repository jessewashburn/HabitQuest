
import { apiGet } from './api';

export type LeaderboardEntry = {
  userId: string;
  username: string;
  exp: number;
  streak: number;
};

export interface LeaderboardParams {
  type: string;
  limit?: number;
  categoryId?: string;
  userId?: string;
}

export const fetchLeaderboard = async (params?: LeaderboardParams): Promise<LeaderboardEntry[]> => {
  // Always require type, default to 'level-by-user' if not provided
  const safeParams: LeaderboardParams = {
    type: params?.type || 'level-by-user',
    limit: params?.limit,
    categoryId: params?.categoryId,
    userId: params?.userId,
  };
  const query = new URLSearchParams();
  query.append('type', safeParams.type);
  if (safeParams.limit) query.append('limit', safeParams.limit.toString());
  if (safeParams.categoryId) query.append('categoryId', safeParams.categoryId);
  if (safeParams.userId) query.append('userId', safeParams.userId);
  const queryString = query.toString();
  return await apiGet(`/api/leaderboards?${queryString}`);
};
