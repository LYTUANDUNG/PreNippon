'use client';

import { Product } from '../types/product';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useToastStore } from '../store/toastStore';
import { useQuickViewStore } from '../store/quickViewStore';
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Countdown from './Countdown';
import { ROUTES } from '../constants';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const addToast = useToastStore((state) => state.addToast);
  const openQuickView = useQuickViewStore((state) => state.openQuickView);

  const favorited = isInWishlist(product.id);

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    addToast(`Đã thêm ${product.name} vào giỏ hàng!`, 'success');
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    addToast(
      favorited ? 'Đã xóa khỏi danh sách yêu thích!' : 'Đã thêm vào danh sách yêu thích!',
      'info'
    );
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  // Determine badge
  const isPreorder = product.status === 'PREORDER';
  const isOutOfStock = product.status === 'OUT_OF_STOCK';
  const isSale = product.category.slug === 'sale';
  const isNew = new Date(product.createdAt).getTime() > Date.now() - 1000 * 60 * 60 * 24 * 30; // 30 days old

  // Calculate preorder campaign metrics
  const campaign = product.campaign;
  const orderedRatio = campaign
    ? Math.min(100, Math.round((campaign.orderedQuantity / campaign.limitQuantity) * 100))
    : 0;

  // Images mapping
  const thumbUrl = product.images.find((img) => img.isThumbnail)?.url || product.images[0]?.url;
  const secondUrl = product.images.find((img) => !img.isThumbnail)?.url || thumbUrl;

  return (
    <div className="group bg-background-card hover:bg-background-card-hover border border-border hover:border-accent/40 rounded-custom p-3 flex flex-col justify-between transition-all duration-300 hover:shadow-glow relative h-full">
      {/* Product Image Wrapper */}
      <Link href={ROUTES.PRODUCT_DETAIL(product.slug)} className="block relative aspect-[3/4] rounded-custom overflow-hidden bg-zinc-900 mb-3">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {isPreorder && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-accent text-white rounded-sm">
              Pre-order
            </span>
          )}
          {isNew && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-600 text-white rounded-sm">
              NEW
            </span>
          )}
          {isSale && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-yellow-500 text-black rounded-sm">
              SALE
            </span>
          )}
          {campaign && orderedRatio >= 80 && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-orange-600 text-white rounded-sm">
              HOT
            </span>
          )}
        </div>

        {/* Thumbnail Image */}
        <img
          src={thumbUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
          loading="lazy"
        />

        {/* Secondary Hover Image */}
        <img
          src={secondUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
          loading="lazy"
        />

        {/* Floating Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={handleQuickViewClick}
            className="p-2.5 bg-zinc-900 border border-border text-foreground hover:bg-accent hover:border-accent hover:text-white rounded-full transition-all duration-200 transform translate-y-4 group-hover:translate-y-0"
            title="Xem nhanh"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={handleWishlistClick}
            className={`p-2.5 bg-zinc-900 border border-border rounded-full transition-all duration-200 transform translate-y-4 group-hover:translate-y-0 ${
              favorited
                ? 'text-accent border-accent bg-accent/10'
                : 'text-foreground hover:bg-accent hover:border-accent hover:text-white'
            }`}
            title="Yêu thích"
          >
            <Heart size={18} fill={favorited ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        {/* Pre-order countdown overlay */}
        {isPreorder && campaign && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/75 px-2 py-1 text-center border-t border-border">
            <Countdown targetDate={campaign.closeDate} />
          </div>
        )}
      </Link>

      {/* Info Section */}
      <div className="flex flex-col gap-1 flex-grow">
        {/* Brand & Series */}
        <span className="text-[10px] text-foreground-muted tracking-wide uppercase font-semibold">
          {product.brand.name} • {product.series.name}
        </span>

        {/* Product Name */}
        <Link href={ROUTES.PRODUCT_DETAIL(product.slug)}>
          <h3 className="text-sm font-bold line-clamp-2 text-foreground group-hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Pre-order Progress bar */}
        {isPreorder && campaign && (
          <div className="mt-1 space-y-1">
            <div className="flex justify-between text-[10px] text-foreground-muted">
              <span>Đã đặt: {campaign.orderedQuantity}/{campaign.limitQuantity}</span>
              <span>{orderedRatio}%</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-accent h-full transition-all duration-500 rounded-full"
                style={{ width: `${orderedRatio}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Details: Price and CTA */}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/50 pt-2.5">
        <div className="flex flex-col">
          {isPreorder && campaign ? (
            <>
              <span className="text-xs text-accent font-bold">
                Cọc: {formatVND(campaign.depositAmount)}
              </span>
              <span className="text-[10px] text-foreground-muted line-through">
                {formatVND(product.price)}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-foreground">
              {formatVND(product.price)}
            </span>
          )}
        </div>

        <button
          onClick={handleCartClick}
          disabled={isOutOfStock}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-custom font-bold text-xs uppercase transition-all duration-200 ${
            isOutOfStock
              ? 'bg-zinc-800 border border-border text-foreground-muted cursor-not-allowed'
              : 'bg-zinc-900 border border-border hover:border-accent hover:bg-accent text-foreground hover:text-white cursor-pointer'
          }`}
        >
          <ShoppingCart size={13} />
          {isPreorder ? 'Preorder' : isOutOfStock ? 'Hết hàng' : 'Mua'}
        </button>
      </div>
    </div>
  );
}
