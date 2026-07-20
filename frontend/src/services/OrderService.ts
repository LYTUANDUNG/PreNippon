import { orderApi } from '../api/orderApi';
import { Order } from '../types/order';

export const OrderService = {
  async getOrders(): Promise<Order[]> {
    const res = await orderApi.getOrders();
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(res.message || 'Lỗi khi tải danh sách đơn hàng');
  },

  async getOrderByCode(code: string): Promise<Order> {
    const res = await orderApi.getOrderByCode(code);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(res.message || 'Lỗi khi tìm kiếm đơn hàng');
  },

  async createOrder(order: any): Promise<Order> {
    const res = await orderApi.createOrder(order);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(res.message || 'Lỗi khi đặt hàng');
  },

  async updateOrder(id: number, order: Partial<Order>): Promise<Order> {
    const res = await orderApi.updateOrder(id, order);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data;
    }
    throw new Error(res.message || 'Lỗi khi cập nhật đơn hàng');
  }
};
