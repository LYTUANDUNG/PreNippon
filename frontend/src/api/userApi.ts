import { apiClient } from './apiClient';
import { User } from '../types/user';
import { ApiResponse } from '../types/common';

export const userApi = {
  login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return apiClient.post<{ user: User; token: string }>('/auth/login', { email, password });
  },

  getUsers(): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>('/users');
  },

  updateUser(id: number, user: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<User>(`/users/${id}`, user);
  }
};
