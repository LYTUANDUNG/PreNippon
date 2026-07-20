'use client';

import { useOrders } from '../../../hooks/useOrders';
import { useAuth } from '../../../hooks/useAuth';
import EmptyState from '../../../components/EmptyState';
import { ORDER_STATUS_TEXT, ORDER_STATUS_COLOR, ROUTES } from '../../../constants';
import Link from 'next/link';
import { useToastStore } from '../../../store/toastStore';
import { ShoppingBag, ChevronRight, Coins, AlertCircle } from 'lucide-react';

export default function OrdersPage() {
  const { orders, updateOrder } = useOrders();
  const { user, isAuthenticated } = useAuth();
  const addToast = useToastStore((state) => state.addToast);

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  // If guest, show login prompt
  if (!isAuthenticated || !user) {
    return (
      <div className="py-16">
        <EmptyState
          title="Yêu cầu đăng nhập!"
          message="Vui lòng đăng nhập tài khoản bằng nút User ở Header để xem lịch sử mua sắm và theo dõi pre-order."
          buttonText="Về trang chủ"
          linkUrl="/"
          icon={AlertCircle}
        />
      </div>
    );
  }

  // Filter orders for active user
  const userOrders = orders.filter((o) => o.userId === user.id);

  const handlePayRemaining = async (orderId: number, orderCode: string, remainingAmt: number) => {
    try {
      await updateOrder({
        id: orderId,
        order: {
          status: 'COMPLETED',
          paymentStatus: 'FULLY_PAID',
          remainingPaid: remainingAmt
        }
      });
      addToast(`Thanh toán thành công ${formatVND(remainingAmt)} cho đơn ${orderCode}! Trạng thái cập nhật: Hoàn thành.`, 'success');
    } catch (err) {
      addToast('Thanh toán thất bại!', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-border pb-4 text-left">
        <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
          <ShoppingBag size={24} className="text-accent" /> Đơn Hàng Của Tôi
        </h1>
        <p className="text-xs text-foreground-muted">Xem lịch sử đặt cọc preorder và thanh toán nốt phần còn lại</p>
      </div>

      {/* Orders List */}
      {userOrders.length > 0 ? (
        <div className="space-y-4">
          {userOrders.map((ord) => {
            const isPreorder = ord.requiredDeposit > 0;
            const remaining = ord.totalAmount - ord.depositPaid;
            const showPayRemainingButton = ord.status === 'READY' || ord.status === 'ARRIVED';

            return (
              <div key={ord.id} className="bg-background-card border border-border rounded-custom p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-mono font-bold text-foreground bg-zinc-950 px-2.5 py-1 rounded border border-border/80 select-all">
                      {ord.orderCode}
                    </span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border rounded-sm ${ORDER_STATUS_COLOR[ord.status]}`}>
                      {ORDER_STATUS_TEXT[ord.status]}
                    </span>
                    {isPreorder && (
                      <span className="text-[10px] font-bold text-accent px-2 py-0.5 bg-accent-muted/15 border border-accent/25 rounded-sm uppercase tracking-wide">
                        Pre-order
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-foreground-muted space-y-1">
                    <p>Ngày đặt: <span className="text-foreground font-semibold">{new Date(ord.createdAt).toLocaleDateString('vi-VN')}</span></p>
                    <p>Họ tên: <span className="text-foreground font-semibold">{ord.recipientName}</span></p>
                    <p className="truncate max-w-md">Địa chỉ: {ord.shippingAddress}</p>
                  </div>
                </div>

                {/* Price and operations */}
                <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between w-full md:w-auto gap-4 shrink-0 border-t md:border-t-0 border-border/40 pt-4 md:pt-0">
                  <div className="text-left sm:text-right md:text-right">
                    <p className="text-xs text-foreground-muted">Tổng đơn hàng:</p>
                    <p className="text-sm font-extrabold text-foreground">{formatVND(ord.totalAmount)}</p>
                    {isPreorder && (
                      <p className="text-[10px] text-accent font-bold">Đã cọc: {formatVND(ord.depositPaid)}</p>
                    )}
                  </div>

                  <div className="flex gap-2.5 w-full sm:w-auto">
                    {/* Pay remaining balance button */}
                    {showPayRemainingButton && (
                      <button
                        onClick={() => handlePayRemaining(ord.id, ord.orderCode, remaining)}
                        className="flex items-center gap-1 bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-custom transition-colors duration-200 cursor-pointer"
                      >
                        <Coins size={13} /> Thanh toán nốt ({formatVND(remaining)})
                      </button>
                    )}
                    
                    {/* Track preorder button */}
                    <Link
                      href={ROUTES.ORDER_TRACK(ord.orderCode)}
                      className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-border text-foreground text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-custom transition-all duration-200"
                    >
                      <span>Theo dõi</span>
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12">
          <EmptyState
            title="Bạn chưa có đơn đặt hàng nào!"
            message="Lịch sử mua sắm đang trống. Hãy quay lại cửa hàng chọn pre-order ngay các mô hình anime bạn hâm mộ nhé."
            buttonText="Đi mua sắm mô hình"
            icon={ShoppingBag}
          />
        </div>
      )}
    </div>
  );
}
