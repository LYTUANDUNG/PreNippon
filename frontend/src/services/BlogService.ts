import { blogApi } from '../api/blogApi';
import { Blog } from '../types/blog';

export const BlogService = {
  async getBlogs(): Promise<Blog[]> {
    const res = await blogApi.getBlogs();
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(res.message || 'Lỗi khi tải danh sách bài viết');
  },

  async getBlogBySlug(slug: string): Promise<Blog> {
    const res = await blogApi.getBlogBySlug(slug);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(res.message || 'Lỗi khi tải bài viết');
  },

  async createBlog(blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>): Promise<Blog> {
    const res = await blogApi.createBlog(blog);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(res.message || 'Lỗi khi viết bài');
  },

  async updateBlog(id: number, blog: Partial<Blog>): Promise<Blog> {
    const res = await blogApi.updateBlog(id, blog);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(res.message || 'Lỗi khi cập nhật bài viết');
  },

  async deleteBlog(id: number): Promise<boolean> {
    const res = await blogApi.deleteBlog(id);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(res.message || 'Lỗi khi xóa bài viết');
  }
};
