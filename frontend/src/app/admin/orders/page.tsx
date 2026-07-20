'use client';

import { useState } from 'react';
import { useOrders } from '../../../hooks/useOrders';
import { useToastStore } from '../../../store/toastStore';
import { ORDER_STATUS_TEXT, ORDER_STATUS_COLOR, PAYMENT_METHODS_TEXT } from '../../../constants';
import { Search, Eye, X, Edit, Check } from 'lucide-react';
import { Order } from '../../../types/order';

export default function AdminOrdersConsolePage() {
  const { orders, updateOrder, isLoading } = useOrders();
  const addToast = useToastStore((state) => state.addToast);

  // States
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusDraft, setStatusDraft] = useState('');

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !statusDraft) return;

    try {
      // Automatic rules
      let paymentStatus = selectedOrder.paymentStatus;
      let depositPaid = selectedOrder.depositPaid;
      let remainingPaid = selectedOrder.remainingPaid;

      if (statusDraft === 'DEPOSIT_PAID') {
        paymentStatus = 'PARTIALLY_PAID';
        depositPaid = selectedOrder.requiredDeposit > 0 ? selectedOrder.requiredDeposit : 0;
      } else if (statusDraft === 'COMPLETED') {
        paymentStatus = 'FULLY_PAID';
        depositPaid = selectedOrder.requiredDeposit;
        remainingPaid = selectedOrder.totalAmount - selectedOrder.requiredDeposit;
      }

      const updated = await updateOrder({
        id: selectedOrder.id,
        order: {
          status: statusDraft as any,
          paymentStatus: paymentStatus as any,
          depositPaid,
          remainingPaid,
        }
      });

      setSelectedOrder(updated);
      addToast(`Cập nhật trạng thái đơn ${selectedOrder.orderCode} thành ${statusDraft}!`, 'success');
    } catch (err) {
      addToast('Lỗi khi cập nhật trạng thái!', 'error');
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderCode.toLowerCase().includes(search.toLowerCase()) ||
      o.recipientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="border-b border-border/40 pb-4">
        <h1 className="text-xl font-black uppercase tracking-tight">Quản Lý Đơn Hàng & Pre-Order Timelines</h1>
        <p className="text-xs text-foreground-muted">Cập nhật trạng thái thanh toán, tiến độ nhập hàng của các đơn hàng preorder</p>
      </div>

      {/* Filter bar */}
      <div className="relative max-w-sm w-full">
        <input
          type="text"
          placeholder="Tìm mã đơn hàng, tên người nhận..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 bg-background-card border border-border text-foreground rounded-custom px-3 pr-8 text-xs font-semibold placeholder:text-foreground-muted outline-none focus:border-accent"
        />
        <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
      </div>

      {/* Table view */}
      {isLoading ? (
        <p className="text-xs text-foreground-muted py-6">Đang tải danh sách đơn hàng...</p>
      ) : (
        <div className="bg-background-card border border-border rounded-custom overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border text-foreground-muted font-bold text-[10px] uppercase tracking-wider bg-zinc-900/50">
                  <th className="p-3">Mã đơn</th>
                  <th className="p-3">Người nhận</th>
                  <th className="p-3">Tổng tiền</th>
                  <th className="p-3">Yêu cầu cọc</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3">Thanh toán</th>
                  <th className="p-3 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-foreground">{ord.orderCode}</td>
                    <td className="p-3">
                      <p className="font-semibold text-foreground">{ord.recipientName}</p>
                      <p className="text-[10px] text-foreground-muted">{ord.phoneNumber}</p>
                    </td>
                    <td className="p-3 font-bold text-foreground">{formatVND(ord.totalAmount)}</td>
                    <td className="p-3 text-accent font-semibold">{formatVND(ord.requiredDeposit)}</td>
                    <td className="p-3">
                      <span className={`text-[9px] uppercase font-black tracking-wider px-2 py-0.5 border rounded-sm ${ORDER_STATUS_COLOR[ord.status]}`}>
                        {ORDER_STATUS_TEXT[ord.status]}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm border ${
                        ord.paymentStatus === 'FULLY_PAID'
                          ? 'border-green-500 text-green-500 bg-green-500/5'
                          : ord.paymentStatus === 'PARTIALLY_PAID'
                          ? 'border-blue-500 text-blue-500 bg-blue-500/5'
                          : 'border-yellow-500 text-yellow-500 bg-yellow-500/5'
                      }`}>
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => { setSelectedOrder(ord); setStatusDraft(ord.status); }}
                        className="p-1.5 bg-zinc-900 border border-border text-foreground hover:text-accent rounded hover:border-accent transition-all cursor-pointer inline-flex"
                        title="Xem chi tiết"
                      >
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL MODAL PANEL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-background border border-border rounded-custom shadow-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto z-10 p-6 flex flex-col justify-between">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-foreground-muted hover:text-foreground"
            >
              <X size={16} />
            </button>
            
            <div className="space-y-6">
              {/* Header */}
              <div className="border-b border-border pb-3">
                <h3 className="text-sm font-black uppercase text-foreground">
                  Chi tiết đơn hàng {selectedOrder.orderCode}
                </h3>
                <p className="text-[10px] text-foreground-muted">Ngày lập: {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
              </div>

              {/* Status Update Form */}
              <div className="bg-zinc-950 p-4 border border-border rounded-custom flex flex-col sm:flex-row gap-3 items-end">
                <div className="space-y-1.5 flex-grow text-left">
                  <label className="text-[10px] uppercase font-bold text-accent">Cập nhật tiến độ Pre-order</label>
                  <select
                    value={statusDraft}
                    onChange={(e) => setStatusDraft(e.target.value)}
                    className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-2 text-xs outline-none focus:border-accent text-foreground"
                  >
                    <option value="PENDING">Chờ thanh toán cọc (PENDING)</option>
                    <option value="DEPOSIT_PAID">Đã đặt cọc 30% (DEPOSIT_PAID)</option>
                    <option value="ORDERED">Đã chốt đơn hãng (ORDERED)</option>
                    <option value="SHIPPING">Đang nhập hàng Nhật (SHIPPING)</option>
                    <option value="ARRIVED">Hàng đã về kho VN (ARRIVED)</option>
                    <option value="READY">Sẵn sàng giao hàng (READY)</option>
                    <option value="COMPLETED">Tất toán hoàn thành (COMPLETED)</option>
                    <option value="CANCELLED">Hủy đơn hàng (CANCELLED)</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  className="bg-accent hover:bg-accent-hover text-white h-9 px-4 rounded-custom text-xs font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Check size={14} /> Cập nhật
                </button>
              </div>

              {/* Recipient Details info */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <p className="font-bold text-foreground-muted">Thông tin nhận:</p>
                  <p className="font-semibold text-foreground">{selectedOrder.recipientName} ({selectedOrder.phoneNumber})</p>
                  <p className="text-foreground-muted">{selectedOrder.shippingAddress}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-foreground-muted">Thanh toán:</p>
                  <p className="text-foreground-muted">Cổng: <strong className="text-foreground font-semibold">{PAYMENT_METHODS_TEXT[selectedOrder.payments[0]?.paymentMethod || 'COD']}</strong></p>
                  <p className="text-foreground-muted">Trị giá: <strong className="text-foreground font-bold">{formatVND(selectedOrder.totalAmount)}</strong></p>
                  <p className="text-accent font-bold">Đã cọc: {formatVND(selectedOrder.depositPaid)}</p>
                  {selectedOrder.remainingPaid > 0 && (
                    <p className="text-green-500 font-bold">Đã thanh toán nốt: {formatVND(selectedOrder.remainingPaid)}</p>
                  )}
                </div>
              </div>

              {/* Items listing */}
              <div className="border-t border-border pt-4">
                <h4 className="text-[10px] uppercase font-bold text-foreground-muted mb-2">Chi tiết sản phẩm</h4>
                <div className="divide-y divide-border border border-border rounded-custom overflow-hidden max-h-[160px] overflow-y-auto bg-zinc-950/20">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-foreground">Figure ID: {item.productId}</p>
                        <p className="text-[10px] text-foreground-muted">SL: {item.quantity} • Loại: {item.type}</p>
                      </div>
                      <span className="font-bold text-foreground">{formatVND(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border mt-6">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-zinc-900 border border-border hover:bg-zinc-800 text-foreground text-xs font-bold uppercase rounded-custom transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
