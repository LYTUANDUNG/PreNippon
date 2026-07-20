import { apiClient } from './apiClient';
import { Banner } from '../types/common';
import { ApiResponse } from '../types/common';

export const bannerApi = {
  getBanners(): Promise<ApiResponse<Banner[]>> {
    return apiClient.get<Banner[]>('/banners');
  },

  createBanner(banner: Omit<Banner, 'id'>): Promise<ApiResponse<Banner>> {
    return apiClient.post<Banner>('/banners', banner);
  },

  updateBanner(id: number, banner: Partial<Banner>): Promise<ApiResponse<Banner>> {
    return apiClient.put<Banner>(`/banners/${id}`, banner);
  },

  deleteBanner(id: number): Promise<ApiResponse<boolean>> {
    return apiClient.delete<boolean>(`/banners/${id}`);
  }
};
