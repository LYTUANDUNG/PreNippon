'use client';

import { useParams, useRouter } from 'next/navigation';
import { useProduct, useProducts } from '../../../../hooks/useProducts';
import { useCartStore } from '../../../../store/cartStore';
import { useWishlistStore } from '../../../../store/wishlistStore';
import { useToastStore } from '../../../../store/toastStore';
import ProductCard from '../../../../components/ProductCard';
import { DetailSkeleton } from '../../../../components/SkeletonLoading';
import Countdown from '../../../../components/Countdown';
import EmptyState from '../../../../components/EmptyState';
import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, ShieldAlert, Award, Info, RefreshCcw, Send, Star } from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();

  const { product, isLoading, isError } = useProduct(slug);
  const { products } = useProducts();
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const addToast = useToastStore((state) => state.addToast);

  // States
  const [activeImage, setActiveImage] = useState('');
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'faq'>('desc');
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  
  // Review inputs
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [localReviews, setLocalReviews] = useState<any[]>([]);

  // Sync active image
  useEffect(() => {
    if (product) {
      const thumb = product.images.find((img) => img.isThumbnail)?.url || product.images[0]?.url;
      setActiveImage(thumb || '');
      setLocalReviews(product.reviews || []);

      // Cache product to Recently Viewed (limit 5)
      const currentList = JSON.parse(localStorage.getItem('prenippon_recently_viewed') || '[]');
      const updatedList = [
        product.id,
        ...currentList.filter((id: number) => id !== product.id),
      ].slice(0, 5);
      localStorage.setItem('prenippon_recently_viewed', JSON.stringify(updatedList));
    }
  }, [product]);

  // Load recently viewed products
  useEffect(() => {
    const listIds = JSON.parse(localStorage.getItem('prenippon_recently_viewed') || '[]');
    if (listIds.length > 0 && products.length > 0) {
      const filtered = products.filter((p) => listIds.includes(p.id) && p.slug !== slug);
      setRecentlyViewed(filtered);
    }
  }, [products, slug]);

  if (isLoading) return <div className="max-w-7xl mx-auto px-4 md:px-6 py-8"><DetailSkeleton /></div>;
  if (isError || !product) {
    return (
      <div className="py-16">
        <EmptyState
          title="Không tìm thấy sản phẩm!"
          message="Sản phẩm này không tồn tại hoặc đã bị ngừng phân phối tại PreNippon Store."
          buttonText="Về trang danh sách"
          linkUrl="/products"
        />
      </div>
    );
  }

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const handleAddToCart = () => {
    addItem(product, 1);
    addToast(`Đã thêm ${product.name} vào giỏ hàng!`, 'success');
  };

  const handleToggleWishlist = () => {
    const favorited = isInWishlist(product.id);
    toggleWishlist(product);
    addToast(
      favorited ? 'Đã xóa khỏi danh sách yêu thích!' : 'Đã thêm vào danh sách yêu thích!',
      'info'
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newReview = {
      id: Date.now(),
      userName: 'Khách hàng Demo',
      userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=demo',
      rating: reviewRating,
      comment: reviewComment,
      createdAt: new Date().toISOString(),
    };

    setLocalReviews([newReview, ...localReviews]);
    setReviewComment('');
    addToast('Đã gửi đánh giá thành công! Đang chờ duyệt.', 'success');
  };

  // Preorder campaign details
  const isPreorder = product.status === 'PREORDER';
  const campaign = product.campaign;
  const orderedRatio = campaign
    ? Math.min(100, Math.round((campaign.orderedQuantity / campaign.limitQuantity) * 100))
    : 0;

  // Recommendations: share brand or series
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.brand.id === product.brand.id || p.series.id === product.series.id))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-16">
      
      {/* 1. TOP MAIN INFO BLOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Side: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-custom overflow-hidden border border-border bg-zinc-950 flex items-center justify-center">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover transition-all hover:scale-105 cursor-zoom-in"
            />
          </div>
          {/* Thumbnails grid */}
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((img) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(img.url)}
                className={`aspect-square rounded-custom overflow-hidden border transition-all ${
                  activeImage === img.url ? 'border-accent ring-1 ring-accent' : 'border-border hover:border-accent'
                }`}
              >
                <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Specs & Operations */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="flex gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-accent text-white rounded-sm">
                {product.status === 'AVAILABLE' ? 'Có sẵn' : product.status}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-zinc-900 border border-border text-foreground-muted rounded-sm">
                {product.brand.name}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight leading-snug">
              {product.name}
            </h1>
            <p className="text-xs text-foreground-muted uppercase tracking-wider">
              Mã SKU: <span className="font-mono text-foreground font-semibold">{product.sku}</span>
            </p>
          </div>

          {/* Special Campaign Preorder box */}
          {isPreorder && campaign ? (
            <div className="p-5 bg-gradient-to-br from-zinc-950 to-zinc-900 border border-accent/25 rounded-custom space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-3">
                <span className="text-xs font-black uppercase text-accent tracking-wider">
                  🔥 Thời hạn đặt trước
                </span>
                <Countdown targetDate={campaign.closeDate} />
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <p className="text-foreground-muted">Tiền đặt cọc (30%):</p>
                  <p className="text-xl font-extrabold text-accent">{formatVND(campaign.depositAmount)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-foreground-muted">Giá gốc sản phẩm:</p>
                  <p className="text-sm line-through text-foreground-muted font-bold">{formatVND(product.price)}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs text-foreground-muted">
                  <span>Số lượng pre-order đặt cọc: {campaign.orderedQuantity}/{campaign.limitQuantity}</span>
                  <span>{orderedRatio}%</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-accent h-full rounded-full" style={{ width: `${orderedRatio}%` }} />
                </div>
              </div>

              {/* Preorder rules note */}
              <div className="text-[11px] text-foreground-muted leading-relaxed border-t border-border/40 pt-3 flex gap-2">
                <ShieldAlert size={16} className="text-accent shrink-0 mt-0.5" />
                <span>
                  Bạn chỉ cần thanh toán tiền cọc ngay lúc đặt hàng. Số tiền còn lại sẽ thanh toán khi hàng về kho VN dự kiến vào <strong className="text-foreground">{campaign.releaseDate}</strong>.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-zinc-950/80 border border-border rounded-custom">
              <p className="text-xs text-foreground-muted mb-1">Giá bán có sẵn:</p>
              <p className="text-2xl font-black text-foreground">{formatVND(product.price)}</p>
            </div>
          )}

          {/* CTA triggers */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={product.status === 'OUT_OF_STOCK'}
              className="flex-grow flex items-center justify-center gap-2 h-12 bg-accent hover:bg-accent-hover disabled:bg-zinc-800 disabled:text-foreground-muted text-white rounded-custom font-extrabold text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer"
            >
              <ShoppingCart size={17} />
              {isPreorder ? 'Đặt preorder ngay' : 'Thêm vào giỏ hàng'}
            </button>
            <button
              onClick={handleToggleWishlist}
              className={`px-4 bg-background-card border border-border hover:border-accent hover:text-accent rounded-custom transition-all flex items-center justify-center ${
                isInWishlist(product.id) ? 'text-accent border-accent' : 'text-foreground-muted'
              }`}
            >
              <Heart size={20} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Delivery Policy assurances */}
          <div className="grid grid-cols-3 gap-3 text-center border-t border-border pt-6">
            <div className="space-y-1">
              <Award size={18} className="text-accent mx-auto" />
              <p className="text-[10px] font-bold text-foreground">100% Chính Hãng</p>
              <p className="text-[9px] text-foreground-muted">Đền bù x10 nếu fake</p>
            </div>
            <div className="space-y-1">
              <Info size={18} className="text-accent mx-auto" />
              <p className="text-[10px] font-bold text-foreground">Đóng Gói 3 Lớp</p>
              <p className="text-[9px] text-foreground-muted">Bảo hiểm hộp đẹp</p>
            </div>
            <div className="space-y-1">
              <RefreshCcw size={18} className="text-accent mx-auto" />
              <p className="text-[10px] font-bold text-foreground">Tất Toán COD</p>
              <p className="text-[9px] text-foreground-muted">Thanh toán khi nhận</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ACCORDION DETAILED SPECIFICATIONS TABS */}
      <section className="border-t border-border pt-12">
        <div className="flex border-b border-border mb-6 text-sm font-extrabold uppercase tracking-wider">
          {[
            { id: 'desc', label: 'Mô tả chi tiết' },
            { id: 'specs', label: 'Thông số kỹ thuật' },
            { id: 'faq', label: 'Quy trình đặt trước' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-4 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-foreground-muted hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[140px] leading-relaxed text-xs text-foreground-muted space-y-4">
          {activeTab === 'desc' && <p>{product.description}</p>}

          {activeTab === 'specs' && (
            <div className="max-w-md border border-border rounded-custom overflow-hidden text-xs bg-background-card">
              {[
                { label: 'Tên sản phẩm', val: product.name },
                { label: 'Thương hiệu', val: product.manufacturer || product.brand.name },
                { label: 'Bộ sưu tập', val: product.series.name },
                { label: 'Công dụng chính', val: product.character || 'N/A' },
                { label: 'Dung tích', val: product.scale || 'N/A' },
                { label: 'Thành phần chính', val: product.material || 'N/A' },
                { label: 'Loại da phù hợp', val: product.height || 'Mọi loại da' },
              ].map((spec, idx) => (
                <div key={idx} className="grid grid-cols-4 p-3 border-b border-border/50 last:border-b-0 bg-background-card-hover/20">
                  <span className="font-bold text-foreground col-span-1">{spec.label}</span>
                  <span className="col-span-3 text-foreground-muted">{spec.val}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="bg-background-card p-4 border border-border rounded-custom">
                <p className="font-bold text-foreground mb-1">Q: Khi nào thì tôi cần thanh toán phần tiền còn lại?</p>
                <p>A: Khi hàng về đến kho Việt Nam, hệ thống sẽ gửi thông báo (email + SMS + tài khoản). Bạn truy cập đơn hàng chọn &ldquo;Thanh toán nốt&rdquo; để hoàn tất trước khi giao hàng.</p>
              </div>
              <div className="bg-background-card p-4 border border-border rounded-custom">
                <p className="font-bold text-foreground mb-1">Q: Tôi có thể hủy preorder và nhận lại tiền cọc không?</p>
                <p>A: Khoản tiền đặt cọc 30% được dùng để thanh toán giữ chỗ và đặt mua các dòng sản phẩm giới hạn trực tiếp từ hãng sản xuất ở nước ngoài nên sẽ KHÔNG được hoàn trả nếu quý khách tự ý hủy đơn vì lý do cá nhân.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. REVIEWS & RATINGS LIST PANEL */}
      <section className="border-t border-border pt-12 space-y-8">
        <div className="border-b border-border/80 pb-4 flex justify-between items-center">
          <h2 className="text-lg font-black uppercase tracking-tight">Đánh Giá Từ Khách Hàng ({localReviews.length})</h2>
          <div className="flex items-center gap-1">
            <Star size={16} className="text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold">4.8 / 5.0</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Write review form */}
          <form onSubmit={handleReviewSubmit} className="lg:col-span-4 p-5 bg-background-card border border-border rounded-custom space-y-4 text-left">
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Để lại nhận xét của bạn</h3>
            
            {/* Stars selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-foreground-muted">Xếp hạng sao:</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="text-amber-500 hover:scale-110 transition-transform"
                  >
                    <Star size={20} fill={star <= reviewRating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment field */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-foreground-muted">Ý kiến phản hồi</label>
              <textarea
                required
                rows={3}
                placeholder="Ý kiến của bạn về chất lượng sản phẩm..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full bg-zinc-900 border border-border rounded-custom p-3 text-xs font-semibold outline-none focus:border-accent text-foreground resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full h-9 bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider rounded-custom transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send size={13} /> Gửi đánh giá
            </button>
          </form>

          {/* Review list */}
          <div className="lg:col-span-8 space-y-4">
            {localReviews.length > 0 ? (
              localReviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-zinc-950 border border-border/80 rounded-custom space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.userAvatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${rev.userName}`}
                        alt={rev.userName}
                        className="w-7 h-7 rounded-full bg-zinc-900"
                      />
                      <div>
                        <p className="text-xs font-bold text-foreground leading-none">{rev.userName}</p>
                        <span className="text-[9px] text-foreground-muted">{new Date(rev.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                    {/* Stars display */}
                    <div className="flex text-amber-500 gap-0.5">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} size={11} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-foreground-muted leading-relaxed">{rev.comment}</p>
                  {rev.imageUrl && (
                    <img src={rev.imageUrl} alt="Customer upload" className="w-24 h-24 object-cover border border-border rounded" />
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-foreground-muted py-6 text-center">Chưa có lượt đánh giá nào cho sản phẩm này.</p>
            )}
          </div>
        </div>
      </section>

      {/* 4. RELATED PRODUCTS GRID */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-border pt-12">
          <h2 className="text-lg font-black uppercase tracking-tight mb-6">Có Thể Bạn Sẽ Thích</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 5. RECENTLY VIEWED ROW */}
      {recentlyViewed.length > 0 && (
        <section className="border-t border-border pt-12">
          <h2 className="text-lg font-black uppercase tracking-tight mb-6">Sản Phẩm Đã Xem Gần Đây</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewed.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
