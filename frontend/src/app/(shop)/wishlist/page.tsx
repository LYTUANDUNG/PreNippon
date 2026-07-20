'use client';

import { useWishlistStore } from '../../../store/wishlistStore';
import ProductCard from '../../../components/ProductCard';
import EmptyState from '../../../components/EmptyState';
import { Heart, Trash2 } from 'lucide-react';
import { useToastStore } from '../../../store/toastStore';

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();
  const addToast = useToastStore((state) => state.addToast);

  const handleClearAll = () => {
    clearWishlist();
    addToast('Đã xóa sạch danh sách yêu thích!', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
            <Heart size={24} className="text-accent fill-accent" /> Danh Sách Yêu Thích
          </h1>
          <p className="text-xs text-foreground-muted">Lưu trữ các mô hình bạn quan tâm để dễ dàng theo dõi và mua sắm</p>
        </div>
        {items.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1 bg-zinc-900 hover:bg-accent hover:text-white border border-border text-foreground-muted hover:border-accent text-xs font-bold uppercase px-3.5 py-2 rounded-custom transition-all duration-200"
          >
            <Trash2 size={13} /> Xóa tất cả
          </button>
        )}
      </div>

      {/* Grid List */}
      {items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="py-12">
          <EmptyState
            title="Danh sách yêu thích trống!"
            message="Bạn chưa lưu sản phẩm nào vào danh sách yêu thích. Hãy quay lại xem sản phẩm và nhấn trái tim nhé!"
            buttonText="Tìm kiếm sản phẩm ngay"
            icon={Heart}
          />
        </div>
      )}
    </div>
  );
}
