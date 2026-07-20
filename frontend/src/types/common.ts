export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  orderIndex: number;
  isActive: boolean;
  type: 'HERO' | 'PROMO' | 'COUNTDOWN';
  countdownTarget?: string; // date string for hot preorder counts
  badgeText?: string;
  buttonText?: string;
}

export interface Voucher {
  id: number;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  limitUses: number;
  usesCount: number;
  status: 'ACTIVE' | 'INACTIVE';
}
