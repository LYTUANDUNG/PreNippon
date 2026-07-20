import { apiClient } from './apiClient';
import { Blog } from '../types/blog';
import { ApiResponse } from '../types/common';

export const blogApi = {
  getBlogs(): Promise<ApiResponse<Blog[]>> {
    return apiClient.get<Blog[]>('/blogs');
  },

  getBlogBySlug(slug: string): Promise<ApiResponse<Blog>> {
    return apiClient.get<Blog>(`/blogs/${slug}`);
  },

  createBlog(blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Blog>> {
    return apiClient.post<Blog>('/blogs', blog);
  },

  updateBlog(id: number, blog: Partial<Blog>): Promise<ApiResponse<Blog>> {
    return apiClient.put<Blog>(`/blogs/${id}`, blog);
  },

  deleteBlog(id: number): Promise<ApiResponse<boolean>> {
    return apiClient.delete<boolean>(`/blogs/${id}`);
  }
};
