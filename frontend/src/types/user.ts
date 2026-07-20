export interface Address {
  id: number;
  userId: number;
  recipientName: string;
  phoneNumber: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: 'ROLE_GUEST' | 'ROLE_CUSTOMER' | 'ROLE_ADMIN';
  status: 'ACTIVE' | 'BLOCKED';
  rewardPoints: number;
  tier: 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
  twoFaEnabled: boolean;
  addresses?: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'ORDER_STATUS' | 'PAYMENT' | 'VOUCHER' | 'PROMOTION';
  isRead: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: number;
  userId: number;
  userName?: string;
  action: string;
  description: string;
  ipAddress: string;
  createdAt: string;
}
