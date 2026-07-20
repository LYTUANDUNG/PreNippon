'use client';

import { useQuickViewStore } from '../store/quickViewStore';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import { X, ShoppingCart, Info, Award, Tag } from 'lucide-react';
import { ROUTES } from '../constants';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function QuickViewModal() {
  const { selectedProduct, isOpen, closeQuickView } = useQuickViewStore();
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);
  
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (selectedProduct) {
      const thumb = selectedProduct.images.find((img) => img.isThumbnail)?.url || selectedProduct.images[0]?.url;
      setActiveImage(thumb || '');
    }
  }, [selectedProduct]);

  if (!isOpen || !selectedProduct) return null;

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const handleAddToCart = () => {
    addItem(selectedProduct, 1);
    addToast(`Đã thêm ${selectedProduct.name} vào giỏ hàng!`, 'success');
    closeQuickView();
  };

  const campaign = selectedProduct.campaign;
  const isPreorder = selectedProduct.status === 'PREORDER';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          onClick={closeQuickView}
          className="absolute inset-0 bg-black"
        />

        {/* Modal content body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="relative bg-background border border-border rounded-custom w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10 shadow-2xl grid grid-cols-1 md:grid-cols-12"
        >
          {/* Close button */}
          <button
            onClick={closeQuickView}
            className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-zinc-900 border border-border text-foreground hover:text-accent hover:border-accent transition-colors"
          >
            <X size={18} />
          </button>

          {/* Left panel: Product Gallery */}
          <div className="md:col-span-6 p-6 flex flex-col gap-4 bg-zinc-950/40 border-r border-border/50">
            <div className="relative aspect-square rounded-custom overflow-hidden border border-border bg-zinc-900 flex items-center justify-center">
              <img
                src={activeImage}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Gallery Selector */}
            <div className="grid grid-cols-3 gap-3">
              {selectedProduct.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.url)}
                  className={`aspect-square rounded-custom overflow-hidden border transition-all ${
                    activeImage === img.url
                      ? 'border-accent ring-1 ring-accent'
                      : 'border-border hover:border-foreground-muted'
                  }`}
                >
                  <img src={img.url} alt="Gallery item" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right panel: Details */}
          <div className="md:col-span-6 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Category, Brand, Series tags */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-zinc-900 border border-border text-foreground-muted rounded">
                  <Tag size={10} />
                  {selectedProduct.category.name}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-zinc-900 border border-border text-foreground-muted rounded">
                  <Award size={10} />
                  {selectedProduct.brand.name}
                </span>
              </div>

              {/* Product Title */}
              <h2 className="text-xl font-extrabold text-foreground tracking-tight leading-snug">
                {selectedProduct.name}
              </h2>

              <p className="text-xs text-foreground-muted uppercase tracking-wider">
                SKU: <span className="text-foreground font-mono">{selectedProduct.sku}</span>
              </p>

              {/* Price Details */}
              <div className="p-4 bg-zinc-950/60 border border-border/50 rounded-custom space-y-2">
                {isPreorder && campaign ? (
                  <>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-foreground-muted">Giá bán chính thức:</span>
                      <span className="text-sm line-through text-foreground-muted font-bold">
                        {formatVND(selectedProduct.price)}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-accent font-bold">Tiền cọc yêu cầu (30%):</span>
                      <span className="text-lg text-accent font-extrabold">
                        {formatVND(campaign.depositAmount)}
                      </span>
                    </div>
                    <div className="text-[10px] text-foreground-muted border-t border-border/30 pt-1.5 mt-1.5 flex justify-between">
                      <span>Dự kiến phát hành:</span>
                      <span className="font-semibold text-foreground">{campaign.releaseDate}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-foreground-muted font-medium">Giá bán:</span>
                    <span className="text-xl text-foreground font-extrabold">
                      {formatVND(selectedProduct.price)}
                    </span>
                  </div>
                )}
              </div>

              {/* Short Description */}
              <div>
                <h4 className="text-xs font-bold text-foreground-muted uppercase mb-1">Mô tả ngắn:</h4>
                <p className="text-xs text-foreground-muted line-clamp-4 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Specs Table snippet */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] border-t border-border/40 pt-3">
                <p className="text-foreground-muted">Series: <span className="text-foreground font-medium">{selectedProduct.series.name}</span></p>
                {selectedProduct.character && (
                  <p className="text-foreground-muted">Nhân vật: <span className="text-foreground font-medium">{selectedProduct.character}</span></p>
                )}
                {selectedProduct.scale && (
                  <p className="text-foreground-muted">Tỷ lệ: <span className="text-foreground font-medium">{selectedProduct.scale}</span></p>
                )}
                {selectedProduct.height && (
                  <p className="text-foreground-muted">Chiều cao: <span className="text-foreground font-medium">{selectedProduct.height}</span></p>
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-2 gap-3 mt-6 border-t border-border pt-4">
              <button
                onClick={handleAddToCart}
                disabled={selectedProduct.status === 'OUT_OF_STOCK'}
                className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white py-2.5 rounded-custom text-xs font-bold uppercase transition-all duration-200"
              >
                <ShoppingCart size={15} />
                {isPreorder ? 'Pre-order ngay' : 'Thêm vào giỏ'}
              </button>
              
              <Link
                href={ROUTES.PRODUCT_DETAIL(selectedProduct.slug)}
                onClick={closeQuickView}
                className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-border text-foreground py-2.5 rounded-custom text-xs font-bold uppercase transition-all duration-200"
              >
                <Info size={15} />
                Chi tiết sản phẩm
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
