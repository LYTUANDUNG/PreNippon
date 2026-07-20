'use client';

import { useParams } from 'next/navigation';
import { useOrder } from '../../../../../hooks/useOrders';
import EmptyState from '../../../../../components/EmptyState';
import { ShieldCheck, Truck, Clock, Coins, CheckCircle, Package, MapPin, Compass } from 'lucide-react';

export default function OrderTrackPage() {
  const { code } = useParams() as { code: string };
  const { order, isLoading, isError } = useOrder(code);

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-foreground-muted">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-wider">Đang tải thông tin theo dõi...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="py-16">
        <EmptyState
          title="Không tìm thấy đơn hàng!"
          message={`Mã đơn hàng ${code} không tồn tại trên hệ thống hoặc bạn đã gõ sai ký tự.`}
          buttonText="Về trang chủ"
          linkUrl="/"
        />
      </div>
    );
  }

  // Preorder tracking milestones logic mapped to order statuses
  const milestones = [
    {
      stage: 'DEPOSIT_PAID',
      title: 'Đã đặt cọc 30%',
      desc: 'Đã nhận khoản đặt cọc giữ chỗ suất mua mô hình chính hãng.',
      active: order.status !== 'PENDING' && order.status !== 'CANCELLED',
    },
    {
      stage: 'ORDERED_BRAND',
      title: 'Đã chốt đơn hãng',
      desc: 'Shop đã chốt danh sách số lượng sản phẩm đặt trước với nhà phân phối.',
      active: ['ORDERED', 'SHIPPING', 'ARRIVED', 'READY', 'COMPLETED'].includes(order.status),
    },
    {
      stage: 'SHIPPING_VN',
      title: 'Đang vận chuyển Quốc tế',
      desc: 'Mô hình được hãng phát hành tại Nhật Bản và đang đóng gói chuyển về Việt Nam.',
      active: ['SHIPPING', 'ARRIVED', 'READY', 'COMPLETED'].includes(order.status),
    },
    {
      stage: 'CUSTOMS',
      title: 'Đang thông quan',
      desc: 'Hàng đã cập bến cảng/sân bay Việt Nam và đang tiến hành thủ tục khai báo hải quan.',
      active: ['ARRIVED', 'READY', 'COMPLETED'].includes(order.status),
    },
    {
      stage: 'ARRIVED_VN',
      title: 'Đã về kho Việt Nam',
      desc: 'Hàng đã kiểm kho thành công tại warehouse Việt Nam. Sẵn sàng soạn đơn gửi đi.',
      active: ['READY', 'COMPLETED'].includes(order.status),
    },
    {
      stage: 'COMPLETED',
      title: 'Hoàn tất giao hàng',
      desc: 'Đã giao thành công tới địa chỉ nhận, tất toán toàn bộ hóa đơn đặt hàng.',
      active: order.status === 'COMPLETED',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-10">
      
      {/* 1. Track Header */}
      <div className="border-b border-border pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <Compass size={22} className="text-accent" /> Theo Dõi Pre-Order
          </h1>
          <p className="text-xs text-foreground-muted">Mã đơn hàng: <strong className="text-foreground font-mono">{order.orderCode}</strong></p>
        </div>
        <div className="flex gap-2">
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-zinc-900 border ${
            order.status === 'COMPLETED' ? 'border-green-500 text-green-500 bg-green-500/5' : 'border-accent text-accent bg-accent/5'
          }`}>
            Trạng thái: {order.status}
          </span>
        </div>
      </div>

      {/* 2. Order short recap */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="bg-background-card border border-border p-4 rounded-custom space-y-2">
          <p className="text-[10px] uppercase font-bold text-foreground-muted flex items-center gap-1.5">
            <MapPin size={12} className="text-accent" /> Địa chỉ giao nhận
          </p>
          <p className="text-xs font-bold text-foreground truncate">{order.recipientName}</p>
          <p className="text-[10px] text-foreground-muted line-clamp-2 leading-relaxed">{order.shippingAddress}</p>
        </div>

        <div className="bg-background-card border border-border p-4 rounded-custom space-y-2">
          <p className="text-[10px] uppercase font-bold text-foreground-muted flex items-center gap-1.5">
            <Coins size={12} className="text-accent" /> Chi tiết thanh toán
          </p>
          <p className="text-xs text-foreground-muted">Tổng hóa đơn: <strong className="text-foreground font-bold">{formatVND(order.totalAmount)}</strong></p>
          <p className="text-[10px] text-accent font-bold">Đã cọc: {formatVND(order.depositPaid)}</p>
        </div>

        <div className="bg-background-card border border-border p-4 rounded-custom space-y-2">
          <p className="text-[10px] uppercase font-bold text-foreground-muted flex items-center gap-1.5">
            <Package size={12} className="text-accent" /> Thông tin mô hình
          </p>
          <div className="space-y-1 overflow-hidden">
            {order.items.map((item, idx) => (
              <p key={idx} className="text-xs font-bold text-foreground truncate">
                • {item.quantity}x {item.product?.name || `Figure SKU ${item.productId}`}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* 3. VERTICAL TIMELINE WIDGET */}
      <div className="bg-background-card border border-border p-6 md:p-8 rounded-custom text-left">
        <h3 className="text-xs font-black uppercase text-foreground mb-8 pb-3 border-b border-border/40">
          📍 Tiến độ nhập hàng & Vận chuyển
        </h3>

        <div className="relative border-l border-border pl-6 space-y-8 ml-2">
          {milestones.map((mil, idx) => (
            <div key={idx} className="relative">
              {/* Checkpoint icon indicator */}
              <div className={`absolute -left-[35px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                mil.active 
                  ? 'bg-accent border-accent text-white shadow-glow' 
                  : 'bg-background-card border-border text-foreground-muted'
              }`}>
                {mil.active ? <CheckCircle size={12} /> : idx + 1}
              </div>

              {/* Title & Desc */}
              <div className="space-y-1">
                <h4 className={`text-sm font-extrabold ${mil.active ? 'text-accent font-black' : 'text-foreground-muted'}`}>
                  {mil.title}
                </h4>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  {mil.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Warning alert */}
      <div className="bg-zinc-950 border border-border p-4 rounded-custom flex gap-3 text-left">
        <ShieldCheck size={20} className="text-accent shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <p className="font-bold text-foreground">Bạn có biết?</p>
          <p className="text-foreground-muted leading-relaxed">
            Hàng về từ Nhật Bản thường trải qua từ 7 đến 14 ngày làm việc sau khi hãng phát hành. PreNippon Store sẽ gửi SMS và Email thông báo mã vận đơn trong nước ngay khi hàng thông quan thành công.
          </p>
        </div>
      </div>

    </div>
  );
}
