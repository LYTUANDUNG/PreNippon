import { Product } from './product';

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  product?: Product;
  quantity: number;
  price: number;
  depositAmount: number; // calculated at order time (e.g. price * deposit% * quantity)
  type: 'PREORDER' | 'AVAILABLE';
}

export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  paymentMethod: 'VNPAY' | 'MOMO' | 'ZALOPAY' | 'COD';
  paymentType: 'DEPOSIT' | 'REMAINING' | 'FULL_PAYMENT';
  transactionId?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  createdAt: string;
}

export interface Order {
  id: number;
  userId: number;
  orderCode: string; // e.g. PRE-2026-XXXX
  totalAmount: number;
  requiredDeposit: number; // accumulated required deposit amount
  depositPaid: number;
  remainingPaid: number;
  status: 'PENDING' | 'DEPOSIT_PAID' | 'ORDERED' | 'SHIPPING' | 'ARRIVED' | 'READY' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'FULLY_PAID';
  recipientName: string;
  phoneNumber: string;
  shippingAddress: string;
  notes?: string;
  voucherId?: number;
  voucherCode?: string;
  rewardPointsUsed: number;
  rewardPointsEarned: number;
  items: OrderItem[];
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}
