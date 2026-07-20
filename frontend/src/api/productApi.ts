import { apiClient } from './apiClient';
import { Product } from '../types/product';
import { ApiResponse } from '../types/common';

export const productApi = {
  getProducts(): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>('/products');
  },

  getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
    return apiClient.get<Product>(`/products/${slug}`);
  },

  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Product>> {
    return apiClient.post<Product>('/products', product);
  },

  updateProduct(id: number, product: Partial<Product>): Promise<ApiResponse<Product>> {
    return apiClient.put<Product>(`/products/${id}`, product);
  },

  deleteProduct(id: number): Promise<ApiResponse<boolean>> {
    return apiClient.delete<boolean>(`/products/${id}`);
  }
};
