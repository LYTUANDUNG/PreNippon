import { bannerApi } from '../api/bannerApi';
import { Banner } from '../types/common';

export const BannerService = {
  async getBanners(): Promise<Banner[]> {
    const res = await bannerApi.getBanners();
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(res.message || 'Lỗi khi tải banners');
  },

  async createBanner(banner: Omit<Banner, 'id'>): Promise<Banner> {
    const res = await bannerApi.createBanner(banner);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(res.message || 'Lỗi khi tạo banner');
  },

  async updateBanner(id: number, banner: Partial<Banner>): Promise<Banner> {
    const res = await bannerApi.updateBanner(id, banner);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(res.message || 'Lỗi khi cập nhật banner');
  },

  async deleteBanner(id: number): Promise<boolean> {
    const res = await bannerApi.deleteBanner(id);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(res.message || 'Lỗi khi xóa banner');
  }
};
