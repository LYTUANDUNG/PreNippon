import { productApi } from '../api/productApi';
import { Product } from '../types/product';

export const ProductService = {
  async getProducts(): Promise<Product[]> {
    const res = await productApi.getProducts();
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(res.message || 'Lỗi khi tải danh sách sản phẩm');
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const res = await productApi.getProductBySlug(slug);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(res.message || 'Lỗi khi tải thông tin sản phẩm');
  },

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const res = await productApi.createProduct(product);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(res.message || 'Lỗi khi thêm sản phẩm');
  },

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const res = await productApi.updateProduct(id, product);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(res.message || 'Lỗi khi cập nhật sản phẩm');
  },

  async deleteProduct(id: number): Promise<boolean> {
    const res = await productApi.deleteProduct(id);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(res.message || 'Lỗi khi xóa sản phẩm');
  }
};
