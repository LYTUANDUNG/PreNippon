export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
}

export interface Series {
  id: number;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: number;
  productId: number;
  url: string;
  isThumbnail: boolean;
}

export interface PreorderTimeline {
  id: number;
  campaignId: number;
  stage: 'OPENED' | 'CLOSED' | 'ORDERED_BRAND' | 'SHIPPING' | 'CUSTOMS' | 'ARRIVED' | 'DELIVERING' | 'COMPLETED';
  notes: string;
  updatedAt: string;
}

export interface PreorderCampaign {
  id: number;
  productId: number;
  openDate: string;
  closeDate: string;
  releaseDate: string; // e.g. "December 2026"
  depositPercentage: number; // e.g. 30
  depositAmount: number; // e.g. 900000
  limitQuantity: number;
  orderedQuantity: number;
  status: 'UPCOMING' | 'ACTIVE' | 'CLOSED' | 'COMPLETED';
  timelines: PreorderTimeline[];
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  productId: number;
  rating: number; // 1-5
  comment: string;
  imageUrl?: string;
  videoUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  barcode?: string;
  category: Category;
  brand: Brand;
  series: Series;
  price: number; // Base price
  status: 'AVAILABLE' | 'PREORDER' | 'OUT_OF_STOCK' | 'DISABLED';
  quantity: number; // Stock for AVAILABLE, max preorder slots for PREORDER
  description: string;
  images: ProductImage[];
  campaign?: PreorderCampaign | null;
  reviews?: Review[];
  character?: string;
  manufacturer?: string;
  releaseDateText?: string;
  scale?: string;
  material?: string;
  height?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}
