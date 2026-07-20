'use client';

import { useCartStore } from '../../../store/cartStore';
import { useToastStore } from '../../../store/toastStore';
import EmptyState from '../../../components/EmptyState';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '../../../constants';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const addToast = useToastStore((state) => state.addToast);

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  // Group items
  const preorderItems = items.filter((item) => item.type === 'PREORDER');
  const availableItems = items.filter((item) => item.type === 'AVAILABLE');

  // Sum calculations
  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const requiredDeposit = preorderItems.reduce((sum, item) => {
    const depAmt = item.product.campaign?.depositAmount || item.product.price * 0.3;
    return sum + depAmt * item.quantity;
  }, 0);

  const totalRemaining = totalAmount - requiredDeposit;

  const handleRemove = (id: number, name: string) => {
    removeItem(id);
    addToast(`Đã xóa ${name} khỏi giỏ hàng.`, 'info');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <EmptyState
          title="Giỏ hàng của bạn đang trống!"
          message="Hãy quay lại cửa hàng chọn mua hoặc pre-order những mẫu mô hình độc quyền mới nhất nhé!"
          buttonText="Đi mua sắm ngay"
          icon={ShoppingCart}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
            <ShoppingCart size={24} className="text-accent" /> Giỏ Hàng
          </h1>
          <p className="text-xs text-foreground-muted">Quản lý các mô hình đã chọn, bao gồm hàng có sẵn và hàng pre-order đặt cọc</p>
        </div>
        <button
          onClick={() => { clearCart(); addToast('Giỏ hàng đã được xóa sạch!', 'info'); }}
          className="text-xs font-bold text-accent hover:underline uppercase"
        >
          Xóa sạch giỏ
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Split lists */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* GROUP 1: PRE-ORDER ITEMS */}
          {preorderItems.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-accent tracking-widest border-b border-accent/25 pb-2">
                📦 Nhóm hàng Pre-order (Cọc 30%)
              </h3>
              <div className="divide-y divide-border border border-border rounded-custom bg-background-card/40 overflow-hidden">
                {preorderItems.map((item) => {
                  const depAmt = item.product.campaign?.depositAmount || item.product.price * 0.3;
                  return (
                    <div key={item.product.id} className="p-4 flex gap-4 flex-col sm:flex-row items-center justify-between">
                      <div className="flex gap-4 items-center w-full sm:w-auto">
                        <img
                          src={item.product.images.find((img) => img.isThumbnail)?.url || item.product.images[0]?.url}
                          alt={item.product.name}
                          className="w-14 h-18 object-cover rounded border border-border bg-zinc-900 shrink-0"
                        />
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-foreground truncate max-w-sm sm:max-w-xs">{item.product.name}</p>
                          <p className="text-[10px] text-foreground-muted uppercase font-mono">SKU: {item.product.sku}</p>
                          <p className="text-[10px] text-accent font-bold mt-1">Cọc: {formatVND(depAmt)}</p>
                        </div>
                      </div>

                      {/* Quantity counters */}
                      <div className="flex items-center gap-6 justify-between w-full sm:w-auto mt-3 sm:mt-0">
                        <div className="flex items-center border border-border rounded overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-zinc-950 text-foreground-muted hover:text-foreground"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="px-3.5 text-xs font-bold text-foreground">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-zinc-950 text-foreground-muted hover:text-foreground"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-foreground">{formatVND(depAmt * item.quantity)}</p>
                          <p className="text-[10px] text-foreground-muted">Gốc: {formatVND(item.product.price * item.quantity)}</p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.product.id, item.product.name)}
                          className="p-2 text-foreground-muted hover:text-accent hover:bg-zinc-950 rounded transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* GROUP 2: AVAILABLE ITEMS */}
          {availableItems.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-foreground-muted tracking-widest border-b border-border pb-2">
                🛍️ Nhóm hàng có sẵn (Thanh toán 100%)
              </h3>
              <div className="divide-y divide-border border border-border rounded-custom bg-background-card/40 overflow-hidden">
                {availableItems.map((item) => (
                  <div key={item.product.id} className="p-4 flex gap-4 flex-col sm:flex-row items-center justify-between">
                    <div className="flex gap-4 items-center w-full sm:w-auto">
                      <img
                        src={item.product.images.find((img) => img.isThumbnail)?.url || item.product.images[0]?.url}
                        alt={item.product.name}
                        className="w-14 h-18 object-cover rounded border border-border bg-zinc-900 shrink-0"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-foreground truncate max-w-sm sm:max-w-xs">{item.product.name}</p>
                        <p className="text-[10px] text-foreground-muted uppercase font-mono">SKU: {item.product.sku}</p>
                        <p className="text-[10px] text-foreground-muted font-bold mt-1">Giá bán: {formatVND(item.product.price)}</p>
                      </div>
                    </div>

                    {/* Quantity counters */}
                    <div className="flex items-center gap-6 justify-between w-full sm:w-auto mt-3 sm:mt-0">
                      <div className="flex items-center border border-border rounded overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-zinc-950 text-foreground-muted hover:text-foreground"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="px-3.5 text-xs font-bold text-foreground">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-zinc-950 text-foreground-muted hover:text-foreground"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-foreground">{formatVND(item.product.price * item.quantity)}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.product.id, item.product.name)}
                        className="p-2 text-foreground-muted hover:text-accent hover:bg-zinc-950 rounded transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Invoice Details */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-background-card border border-border p-5 rounded-custom space-y-4">
            <h3 className="text-xs font-black uppercase text-foreground border-b border-border pb-3">Tóm tắt đơn hàng</h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Tổng trị giá sản phẩm:</span>
                <span className="font-semibold">{formatVND(totalAmount)}</span>
              </div>
              
              {requiredDeposit > 0 && (
                <>
                  <div className="flex justify-between text-accent font-bold">
                    <span>Số tiền cần đặt cọc ngay:</span>
                    <span>{formatVND(requiredDeposit)}</span>
                  </div>
                  <div className="flex justify-between text-foreground-muted border-t border-border/30 pt-2 mt-1">
                    <span>Còn lại (Thanh toán khi về):</span>
                    <span>{formatVND(totalRemaining)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-border/80 pt-4 mt-2 space-y-3">
              <Link
                href={ROUTES.CHECKOUT}
                className="w-full h-11 bg-accent hover:bg-accent-hover text-white rounded-custom text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200"
              >
                <span>Tiến hành thanh toán</span>
                <ArrowRight size={14} />
              </Link>
              
              <Link
                href={ROUTES.PRODUCTS}
                className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 border border-border text-foreground rounded-custom text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-all duration-200"
              >
                Tiếp tục mua hàng
              </Link>
            </div>
          </div>

          {/* Secure assurance */}
          <div className="bg-zinc-950/60 border border-border/50 p-4 rounded-custom space-y-2 text-[11px] leading-relaxed text-foreground-muted">
            <p className="flex items-center gap-1.5 font-bold text-foreground">
              <ShieldCheck size={14} className="text-accent" />
              Cam kết từ PreNippon Store
            </p>
            <p>
              Đối với đơn hàng Pre-order, bạn chỉ cần trả trước tiền cọc. Chúng tôi sẽ đặt chỗ suất mua sản phẩm chính hãng và liên hệ ngay khi hàng cập bến kho Việt Nam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
