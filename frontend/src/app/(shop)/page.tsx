'use client';

import { useState, useEffect } from 'react';
import { useBanners } from '../../hooks/useBanner';
import { useProducts } from '../../hooks/useProducts';
import { useBlogs } from '../../hooks/useBlogs';
import BannerSlider from '../../components/BannerSlider';
import ProductCard from '../../components/ProductCard';
import { GridSkeleton, BannerSkeleton } from '../../components/SkeletonLoading';
import Link from 'next/link';
import { ROUTES } from '../../constants';
import { ChevronRight, Percent, Calendar, Sparkles, MessageSquare, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [siteLoaded, setSiteLoaded] = useState(false);
  const { banners, isLoading: loadingBanners } = useBanners();
  const { products, isLoading: loadingProducts } = useProducts();
  const { blogs } = useBlogs();

  // Trigger loading screen
  useEffect(() => {
    const timer = setTimeout(() => setSiteLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  if (!siteLoaded) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white">
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 360, 360] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full mb-4"
        />
        <h2 className="text-sm font-black uppercase tracking-widest text-accent animate-pulse">
          PreNippon Figure Store
        </h2>
      </div>
    );
  }

  // Filter Data
  const heroBanners = banners.filter((b) => b.type === 'HERO');
  
  // 4 items for flash sale (price < 1.5M, status AVAILABLE)
  const flashSaleProducts = products.filter(
    (p) => p.status === 'AVAILABLE' && p.price < 2000000
  ).slice(0, 4);

  // 4 items for hot preorders
  const preorderProducts = products.filter(
    (p) => p.status === 'PREORDER' && p.campaign
  ).slice(0, 4);

  // 8 items for new arrivals sorted by id desc
  const newProducts = [...products]
    .sort((a, b) => b.id - a.id)
    .slice(0, 8);

  // Categories list with custom Unsplash images matching figure styles
  const categoryCards = [
    { name: "Scale Figure", slug: "scale-figure", img: "https://images.unsplash.com/photo-1608889174633-8a3d3c8b4042?w=500" },
    { name: "Nendoroid", slug: "nendoroid", img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500" },
    { name: "POP UP PARADE", slug: "pop-up-parade", img: "https://images.unsplash.com/photo-1559893088-c0787ebfc084?w=500" },
    { name: "Model Kit", slug: "model-kit", img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500" }
  ];

  const mockReviews = [
    { name: "Nguyễn Minh T.", role: "Collector", rating: 5, comment: "Dịch vụ pre-order cực kỳ uy tín, hàng về đúng hẹn và đóng gói siêu kỹ 3 lớp xốp khí chống móp méo hộp." },
    { name: "Hoàng Gia B.", role: "Gundam Builder", rating: 5, comment: "Giá đặt cọc hợp lý chỉ 30%, cập nhật timeline hải quan liên tục giúp mình an tâm theo dõi." },
    { name: "Phan Quỳnh A.", role: "Nendo Fan", rating: 5, comment: "Figure xinh lung linh chính hãng Nhật Bản phát hiện fake đền gấp 10 lần nên rất tin tưởng." }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SLIDER */}
      <section>
        {loadingBanners ? <BannerSkeleton /> : <BannerSlider banners={heroBanners} />}
      </section>

      {/* 2. FLASH SALE CONTAINER */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-accent/15 border border-accent/20 rounded text-accent">
              <Percent size={18} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">Flash Sale Trong Tuần</h2>
              <p className="text-[11px] text-foreground-muted">Các mô hình có sẵn thanh lý xả kho số lượng cực giới hạn</p>
            </div>
          </div>
          {/* Mock Countdown Clock */}
          <div className="flex items-center gap-1.5 bg-zinc-950 border border-border px-3.5 py-1.5 rounded-custom text-xs font-bold text-accent">
            <span>Mở đến:</span>
            <span className="font-mono">Chủ Nhật tuần này</span>
          </div>
        </div>

        {loadingProducts ? (
          <GridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {flashSaleProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* 3. HOT PRE-ORDER */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded text-blue-400">
              <Calendar size={18} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">Pre-order Hot Nhất</h2>
              <p className="text-[11px] text-foreground-muted">Theo dõi tiến độ, số lượng suất và thời gian đóng link gom order</p>
            </div>
          </div>
          <Link
            href={`${ROUTES.PRODUCTS}?status=PREORDER`}
            className="text-xs font-bold text-foreground-muted hover:text-accent flex items-center gap-0.5 transition-colors uppercase tracking-wider"
          >
            <span>Tất cả preorder</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {loadingProducts ? (
          <GridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {preorderProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* 4. CATEGORY COLLECTIONS CARD GRID */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-xl font-black uppercase tracking-tight">Danh Mục Sưu Tầm</h2>
          <p className="text-xs text-foreground-muted">Khám phá vũ trụ mô hình theo thể loại ưa thích</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryCards.map((cat, idx) => (
            <Link
              key={idx}
              href={`${ROUTES.PRODUCTS}?category=${cat.slug}`}
              className="group relative aspect-[4/3] rounded-custom overflow-hidden border border-border flex items-end p-4 transition-all hover:border-accent/40 shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10 transition-opacity group-hover:opacity-90" />
              <img
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="relative z-20 flex items-center justify-between w-full">
                <span className="text-sm font-extrabold uppercase text-white tracking-wide">
                  {cat.name}
                </span>
                <ArrowUpRight size={16} className="text-white opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded text-amber-400">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">Hàng Mới Cập Bến</h2>
              <p className="text-[11px] text-foreground-muted">Cập nhật liên tục các mẫu figure mới phát hành chính hãng</p>
            </div>
          </div>
          <Link
            href={ROUTES.PRODUCTS}
            className="text-xs font-bold text-foreground-muted hover:text-accent flex items-center gap-0.5 transition-colors uppercase tracking-wider"
          >
            <span>Xem tất cả</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {loadingProducts ? (
          <GridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* 6. CLIENT REVIEWS PANEL */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-background-card border border-border p-8 rounded-custom text-center space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-accent">
            <MessageSquare size={22} className="animate-pulse" />
            <h3 className="text-lg font-black uppercase tracking-tight">Cộng Đồng Đánh Giá</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {mockReviews.map((rev, idx) => (
              <div key={idx} className="bg-zinc-950/60 border border-border/50 p-4 rounded-custom space-y-2 flex flex-col justify-between">
                <p className="text-xs text-foreground-muted italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
                <div className="border-t border-border/40 pt-2 flex items-center justify-between mt-4">
                  <span className="text-[10px] font-bold text-foreground truncate">{rev.name}</span>
                  <span className="text-[9px] font-bold text-accent bg-accent-muted/10 border border-accent/20 px-2 py-0.5 rounded-sm">
                    ⭐ 5.0
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. LATEST BLOG NEWS FEED */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-6">
          <h2 className="text-xl font-black uppercase tracking-tight">Tin Tức Figure & Anime</h2>
          <Link
            href={ROUTES.BLOGS}
            className="text-xs font-bold text-foreground-muted hover:text-accent flex items-center gap-0.5 transition-colors uppercase tracking-wider"
          >
            <span>Tất cả tin tức</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.slice(0, 3).map((blog) => (
            <Link
              key={blog.id}
              href={ROUTES.BLOG_DETAIL(blog.slug)}
              className="group bg-background-card border border-border hover:border-accent/40 rounded-custom overflow-hidden transition-all duration-300 flex flex-col h-full hover:shadow-lg"
            >
              <div className="aspect-[16/9] w-full overflow-hidden bg-zinc-900 border-b border-border relative">
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2 left-2 z-10 text-[9px] font-extrabold uppercase px-2 py-0.5 bg-zinc-950 text-foreground border border-border rounded-sm">
                  {blog.tags[0]}
                </span>
              </div>
              <div className="p-4 flex-grow flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground line-clamp-2 group-hover:text-accent transition-colors leading-snug">
                    {blog.title}
                  </h3>
                  <p className="text-[11px] text-foreground-muted line-clamp-2 leading-relaxed">
                    {blog.summary}
                  </p>
                </div>
                <div className="border-t border-border/40 pt-2 flex justify-between items-center text-[10px] text-foreground-muted">
                  <span>Bởi: {blog.authorName}</span>
                  <span>{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
