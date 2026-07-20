import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OrderService } from '../services/OrderService';
import { Order } from '../types/order';

const DEFAULT_ORDERS: Order[] = [];

export const useOrders = () => {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery<Order[], Error>({
    queryKey: ['orders'],
    queryFn: OrderService.getOrders,
  });

  const createOrderMutation = useMutation({
    mutationFn: OrderService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Refetches stock levels
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, order }: { id: number; order: Partial<Order> }) =>
      OrderService.updateOrder(id, order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return {
    orders: ordersQuery.data || DEFAULT_ORDERS,
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,
    error: ordersQuery.error,
    createOrder: createOrderMutation.mutateAsync,
    isCreating: createOrderMutation.isPending,
    updateOrder: updateOrderMutation.mutateAsync,
    isUpdating: updateOrderMutation.isPending,
  };
};

export const useOrder = (code: string) => {
  const orderQuery = useQuery<Order, Error>({
    queryKey: ['order', code],
    queryFn: () => OrderService.getOrderByCode(code),
    enabled: !!code,
    refetchInterval: 10000, // Sync tracking status in realtime every 10s
  });

  return {
    order: orderQuery.data,
    isLoading: orderQuery.isLoading,
    isError: orderQuery.isError,
    error: orderQuery.error,
    refetch: orderQuery.refetch,
  };
};
