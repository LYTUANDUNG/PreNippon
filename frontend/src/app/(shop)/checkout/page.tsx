'use client';

import { useState } from 'react';
import { useCartStore } from '../../../store/cartStore';
import { useOrders } from '../../../hooks/useOrders';
import { useAuth } from '../../../hooks/useAuth';
import { useToastStore } from '../../../store/toastStore';
import EmptyState from '../../../components/EmptyState';
import { ShoppingCart, CheckCircle, Ticket, MapPin, CreditCard, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '../../../constants';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const { createOrder, isCreating } = useOrders();
  const { user } = useAuth();
  const addToast = useToastStore((state) => state.addToast);

  // States
  const [recipientName, setRecipientName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState('');
  const [ward, setWard] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'VNPAY' | 'MOMO' | 'COD'>('COD');
  
  // Voucher state
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  
  // Checkout progress success state
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  if (items.length === 0 && !placedOrder) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <EmptyState
          title="Không có gì để thanh toán!"
          message="Giỏ hàng trống. Vui lòng quay lại tìm kiếm mô hình và thêm vào giỏ hàng trước khi đặt."
          buttonText="Đi mua sắm ngay"
          icon={ShoppingCart}
        />
      </div>
    );
  }

  // Calculate pricing
  const preorderItems = items.filter((item) => item.type === 'PREORDER');
  const availableItems = items.filter((item) => item.type === 'AVAILABLE');
  
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const requiredDeposit = preorderItems.reduce((sum, item) => {
    const depAmt = item.product.campaign?.depositAmount || item.product.price * 0.3;
    return sum + depAmt * item.quantity;
  }, 0);

  // Voucher Calculations
  const discountAmount = appliedVoucher
    ? appliedVoucher.type === 'PERCENT'
      ? (subtotal * appliedVoucher.val) / 100
      : appliedVoucher.val
    : 0;

  const finalTotal = Math.max(0, subtotal - discountAmount);
  // If pre-orders exist, deposit required. If not, pay 100% price.
  const payToday = requiredDeposit > 0 ? requiredDeposit : finalTotal;
  const payRemaining = requiredDeposit > 0 ? finalTotal - requiredDeposit : 0;

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const code = voucherCode.toUpperCase().trim();
    if (code === 'NIPPON10') {
      setAppliedVoucher({ code: 'NIPPON10', val: 10, type: 'PERCENT' });
      addToast('Áp dụng mã giảm giá 10% thành công!', 'success');
    } else if (code === 'DISCOUNT500K') {
      setAppliedVoucher({ code: 'DISCOUNT500K', val: 500000, type: 'FIXED' });
      addToast('Áp dụng mã giảm giá 500K thành công!', 'success');
    } else {
      addToast('Mã giảm giá không hợp lệ hoặc đã hết hạn!', 'error');
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !phone || !street || !ward || !district || !city) {
      addToast('Vui lòng điền đầy đủ thông tin giao hàng!', 'error');
      return;
    }

    const orderBody = {
      userId: user?.id || 999, // default guest user id
      totalAmount: finalTotal,
      requiredDeposit: requiredDeposit,
      depositPaid: paymentMethod === 'COD' ? 0 : requiredDeposit,
      remainingPaid: 0,
      paymentStatus: 'UNPAID',
      recipientName,
      phoneNumber: phone,
      shippingAddress: `${street}, Phường ${ward}, Quận ${district}, ${city}`,
      notes: notes || undefined,
      paymentMethod,
      voucherCode: appliedVoucher?.code || undefined,
      rewardPointsUsed: 0,
      rewardPointsEarned: Math.floor(finalTotal / 100000),
      items: items.map((item, idx) => ({
        id: idx + 1,
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        depositAmount: item.type === 'PREORDER' ? (item.product.campaign?.depositAmount || item.product.price * 0.3) : 0,
        type: item.type
      })),
      payments: []
    };

    try {
      const response = await createOrder(orderBody);
      setPlacedOrder(response);
      clearCart();
      addToast('Đặt hàng thành công!', 'success');
    } catch (err: any) {
      addToast('Đặt hàng thất bại. Vui lòng thử lại!', 'error');
    }
  };

  // RENDER PLACED SUCCESS CONTAINER
  if (placedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 w-16 h-16 flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle size={32} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black uppercase text-foreground">Đặt Hàng Thành Công!</h1>
          <p className="text-xs text-foreground-muted">Cảm ơn bạn đã tin tưởng dịch vụ pre-order của PreNippon.</p>
        </div>

        <div className="p-5 bg-background-card border border-border rounded-custom text-left space-y-3">
          <div className="flex justify-between border-b border-border/50 pb-2 text-xs">
            <span className="text-foreground-muted">Mã đơn hàng:</span>
            <span className="font-mono text-accent font-bold select-all">{placedOrder.orderCode}</span>
          </div>
          <div className="flex justify-between border-b border-border/50 pb-2 text-xs">
            <span className="text-foreground-muted">Số điện thoại nhận:</span>
            <span className="font-bold text-foreground">{placedOrder.phoneNumber}</span>
          </div>
          <div className="flex justify-between border-b border-border/50 pb-2 text-xs">
            <span className="text-foreground-muted">Tổng trị giá hóa đơn:</span>
            <span className="font-bold text-foreground">{formatVND(placedOrder.totalAmount)}</span>
          </div>
          {placedOrder.requiredDeposit > 0 ? (
            <div className="flex justify-between text-xs text-accent font-bold pt-1">
              <span>Khoản cọc ({paymentMethod}):</span>
              <span>{formatVND(placedOrder.requiredDeposit)}</span>
            </div>
          ) : (
            <div className="flex justify-between text-xs text-green-500 font-bold pt-1">
              <span>Đã thanh toán (Thanh toán có sẵn):</span>
              <span>{paymentMethod === 'COD' ? 'Trả khi nhận (COD)' : formatVND(placedOrder.totalAmount)}</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Link
            href={ROUTES.ORDER_TRACK(placedOrder.orderCode)}
            className="w-full h-11 bg-accent hover:bg-accent-hover text-white rounded-custom text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-all duration-200"
          >
            Theo dõi tiến độ preorder
          </Link>
          <Link
            href="/"
            className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 border border-border text-foreground rounded-custom text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-all duration-200"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="text-left space-y-2 mb-8 border-b border-border pb-4">
        <h1 className="text-2xl font-black uppercase tracking-tight">Thanh Toán</h1>
        <p className="text-xs text-foreground-muted">Hoàn tất đặt hàng mô hình, kiểm tra thông tin giao nhận</p>
      </div>

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Forms */}
        <div className="lg:col-span-8 space-y-6 text-left">
          
          {/* Address Details */}
          <div className="bg-background-card border border-border p-5 rounded-custom space-y-4">
            <h3 className="text-xs font-black uppercase text-foreground flex items-center gap-1.5 border-b border-border/60 pb-3">
              <MapPin size={15} className="text-accent" /> Thông tin nhận hàng
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-foreground-muted">Họ tên người nhận</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full h-10 bg-zinc-900 border border-border rounded-custom px-3 text-xs outline-none focus:border-accent text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-foreground-muted">Số điện thoại</label>
                <input
                  type="tel"
                  required
                  placeholder="0901234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 bg-zinc-900 border border-border rounded-custom px-3 text-xs outline-none focus:border-accent text-foreground"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] uppercase font-bold text-foreground-muted">Địa chỉ số nhà, tên đường</label>
                <input
                  type="text"
                  required
                  placeholder="123 Đường Láng"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full h-10 bg-zinc-900 border border-border rounded-custom px-3 text-xs outline-none focus:border-accent text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-foreground-muted">Phường / Xã</label>
                <input
                  type="text"
                  required
                  placeholder="Phường Láng Hạ"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full h-10 bg-zinc-900 border border-border rounded-custom px-3 text-xs outline-none focus:border-accent text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-foreground-muted">Quận / Huyện</label>
                <input
                  type="text"
                  required
                  placeholder="Quận Đống Đa"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full h-10 bg-zinc-900 border border-border rounded-custom px-3 text-xs outline-none focus:border-accent text-foreground"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] uppercase font-bold text-foreground-muted">Tỉnh / Thành phố</label>
                <input
                  type="text"
                  required
                  placeholder="Hà Nội"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-10 bg-zinc-900 border border-border rounded-custom px-3 text-xs outline-none focus:border-accent text-foreground"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] uppercase font-bold text-foreground-muted">Ghi chú giao hàng (Không bắt buộc)</label>
                <textarea
                  placeholder="Giao hàng ngoài giờ hành chính..."
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-zinc-900 border border-border rounded-custom p-3 text-xs outline-none focus:border-accent text-foreground resize-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Option Selector */}
          <div className="bg-background-card border border-border p-5 rounded-custom space-y-4">
            <h3 className="text-xs font-black uppercase text-foreground flex items-center gap-1.5 border-b border-border/60 pb-3">
              <CreditCard size={15} className="text-accent" /> Phương thức thanh toán cọc / Đơn hàng
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'COD', label: 'Thanh toán COD', desc: 'Thanh toán tiền mặt/COD phần còn lại khi giao hàng.' },
                { id: 'VNPAY', label: 'Cổng VNPay (Demo)', desc: 'Mô phỏng thanh toán trực tuyến qua cổng VNPay.' },
                { id: 'MOMO', label: 'Ví MoMo (Demo)', desc: 'Mô phỏng quét mã QR ví điện tử MoMo.' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setPaymentMethod(item.id as any)}
                  className={`p-4 border rounded-custom text-left space-y-1 transition-all ${
                    paymentMethod === item.id
                      ? 'border-accent bg-accent/5'
                      : 'border-border bg-zinc-950/20 hover:border-foreground-muted'
                  }`}
                >
                  <p className={`text-xs font-bold ${paymentMethod === item.id ? 'text-accent' : 'text-foreground'}`}>
                    {item.label}
                  </p>
                  <p className="text-[10px] text-foreground-muted leading-relaxed">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Order Summary Checkout */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-background-card border border-border p-5 rounded-custom space-y-4">
            <h3 className="text-xs font-black uppercase text-foreground border-b border-border pb-3">Đơn đặt hàng</h3>
            
            {/* List products snippet */}
            <div className="divide-y divide-border/40 max-h-[220px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <img
                      src={item.product.images.find((img) => img.isThumbnail)?.url || item.product.images[0]?.url}
                      alt={item.product.name}
                      className="w-8 h-10 object-cover rounded border border-border/80 bg-zinc-900 shrink-0"
                    />
                    <div className="overflow-hidden">
                      <p className="font-bold text-foreground truncate">{item.product.name}</p>
                      <p className="text-[9px] text-foreground-muted">SL: {item.quantity} • {item.type}</p>
                    </div>
                  </div>
                  <span className="font-bold shrink-0">{formatVND(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Voucher input form */}
            <div className="border-t border-border/40 pt-4 mt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="MÃ GIẢM GIÁ (NIPPON10)"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="w-full h-8 bg-zinc-900 border border-border text-xs rounded-custom px-2.5 uppercase font-bold outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={handleApplyVoucher}
                  className="bg-zinc-900 hover:bg-accent border border-border text-foreground hover:text-white px-3.5 h-8 rounded-custom text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <Ticket size={11} /> Áp dụng
                </button>
              </div>
              {appliedVoucher && (
                <p className="text-[10px] text-green-500 font-bold mt-1.5 flex items-center gap-1">
                  <CheckCircle size={10} /> Đã áp dụng mã {appliedVoucher.code} (-{appliedVoucher.type === 'PERCENT' ? `${appliedVoucher.val}%` : formatVND(appliedVoucher.val)})
                </p>
              )}
            </div>

            {/* Invoicing summary details */}
            <div className="border-t border-border/40 pt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Tổng phụ:</span>
                <span>{formatVND(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>Mã giảm giá:</span>
                  <span>-{formatVND(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-border/30 pb-2">
                <span className="text-foreground-muted">Phí vận chuyển:</span>
                <span className="text-green-500">Miễn phí</span>
              </div>

              {requiredDeposit > 0 ? (
                <>
                  <div className="flex justify-between font-bold text-foreground pt-1">
                    <span>Tổng cộng hóa đơn:</span>
                    <span>{formatVND(finalTotal)}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-accent border-t border-border/60 pt-2.5 mt-1.5">
                    <span>Tiền cọc cần trả:</span>
                    <span>{formatVND(payToday)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-foreground-muted border-t border-dashed border-border/30 pt-1.5 mt-1">
                    <span>Còn lại (Trả khi hàng về):</span>
                    <span className="font-semibold text-foreground">{formatVND(payRemaining)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-base font-black text-foreground border-t border-border/60 pt-2.5 mt-1.5">
                  <span>Tổng tiền thanh toán:</span>
                  <span>{formatVND(payToday)}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="w-full h-11 bg-accent hover:bg-accent-hover disabled:bg-zinc-800 disabled:text-foreground-muted text-white rounded-custom text-xs font-bold uppercase tracking-wider mt-4 cursor-pointer"
            >
              {isCreating ? 'Đang đặt hàng...' : requiredDeposit > 0 ? 'Xác nhận đặt preorder' : 'Xác nhận mua hàng'}
            </button>
          </div>

          {/* Alert split deposit info */}
          {requiredDeposit > 0 && (
            <div className="bg-zinc-950/60 border border-accent/20 p-4 rounded-custom space-y-1 text-[11px] leading-relaxed text-foreground-muted text-left">
              <p className="flex items-center gap-1.5 font-bold text-accent">
                <ShieldCheck size={14} className="text-accent" />
                Lưu ý quan trọng Pre-order
              </p>
              <p>
                Đơn hàng chứa mô hình Pre-order, bạn chỉ cần trả tiền cọc lúc này. Số dư còn lại thanh toán khi hàng về kho VN và sẵn sàng gửi đi.
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
