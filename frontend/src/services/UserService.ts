import { userApi } from '../api/userApi';
import { User } from '../types/user';

export const UserService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await userApi.login(email, password);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(res.message || 'Email hoặc mật khẩu không chính xác!');
  },

  async register(name: string, email: string): Promise<{ user: User; token: string }> {
    const res = await userApi.register(name, email);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(res.message || 'Lỗi đăng ký tài khoản!');
  },

  async getUsers(): Promise<User[]> {
    const res = await userApi.getUsers();
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(res.message || 'Lỗi khi tải danh sách người dùng');
  },

  async updateUser(id: number, user: Partial<User>): Promise<User> {
    const res = await userApi.updateUser(id, user);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(res.message || 'Lỗi khi cập nhật người dùng');
  }
};
