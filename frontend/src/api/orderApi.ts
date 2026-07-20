import { apiClient } from './apiClient';
import { Order } from '../types/order';
import { ApiResponse } from '../types/common';

export const orderApi = {
  getOrders(): Promise<ApiResponse<Order[]>> {
    return apiClient.get<Order[]>('/orders');
  },

  getOrderByCode(code: string): Promise<ApiResponse<Order>> {
    return apiClient.get<Order>(`/orders/track/${code}`);
  },

  createOrder(order: any): Promise<ApiResponse<Order>> {
    return apiClient.post<Order>('/orders', order);
  },

  updateOrder(id: number, order: Partial<Order>): Promise<ApiResponse<Order>> {
    return apiClient.put<Order>(`/orders/${id}`, order);
  }
};
