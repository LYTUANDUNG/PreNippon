'use client';

import { useOrders } from '../../../hooks/useOrders';
import { useProducts } from '../../../hooks/useProducts';
import { useAuth } from '../../../hooks/useAuth';
import { ORDER_STATUS_TEXT, ORDER_STATUS_COLOR } from '../../../constants';
import { DollarSign, ShoppingCart, Calendar, Users, TrendingUp, Sparkles, Award } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { orders } = useOrders();
  const { products } = useProducts();
  const { users } = useAuth();

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  // 1. Calculations
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.depositPaid + o.remainingPaid, 0);

  const activePreorders = products.filter((p) => p.status === 'PREORDER' && p.campaign).length;
  const customersCount = users.filter((u) => u.role === 'ROLE_CUSTOMER').length;

  // 2. Recent orders
  const recentOrders = [...orders]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  // 3. Top preorder campaigns by ratio
  const activeCampaigns = products
    .filter((p) => p.status === 'PREORDER' && p.campaign)
    .map((p) => ({
      name: p.name,
      brand: p.brand.name,
      ordered: p.campaign!.orderedQuantity,
      limit: p.campaign!.limitQuantity,
      ratio: Math.round((p.campaign!.orderedQuantity / p.campaign!.limitQuantity) * 100)
    }))
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 4);

  // Mock monthly revenue for chart visualization
  const monthlyData = [
    { month: 'T12', revenue: 45000000 },
    { month: 'T01', revenue: 68000000 },
    { month: 'T02', revenue: 95000000 },
    { month: 'T03', revenue: 120000000 },
    { month: 'T04', revenue: 154000000 },
    { month: 'T05', revenue: 210000000 }
  ];
  const maxRevenueVal = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <div className="space-y-8 text-left">
      {/* Welcome info */}
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight">Bảng Quản Trị Hệ Thống</h1>
        <p className="text-xs text-foreground-muted">Tổng quan báo cáo doanh thu, tiến trình pre-order và hoạt động kinh doanh</p>
      </div>

      {/* 4 KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <div className="bg-background-card border border-border p-5 rounded-custom space-y-3 shadow-lg">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold text-foreground-muted">Doanh thu (Thực thu)</span>
            <div className="p-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="text-lg font-black text-foreground">{formatVND(totalRevenue)}</p>
          <p className="text-[9px] text-green-400 font-bold">⭐ Tăng 12.5% so với tháng trước</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-background-card border border-border p-5 rounded-custom space-y-3 shadow-lg">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold text-foreground-muted">Tổng đơn hàng</span>
            <div className="p-1.5 bg-accent/10 border border-accent/20 text-accent rounded">
              <ShoppingCart size={16} />
            </div>
          </div>
          <p className="text-lg font-black text-foreground">{orders.length} Đơn</p>
          <p className="text-[9px] text-foreground-muted font-bold">Fulfillment: 98% thành công</p>
        </div>

        {/* KPI 3 */}
        <div className="bg-background-card border border-border p-5 rounded-custom space-y-3 shadow-lg">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold text-foreground-muted">Pre-order Active</span>
            <div className="p-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded">
              <Calendar size={16} />
            </div>
          </div>
          <p className="text-lg font-black text-foreground">{activePreorders} Campaigns</p>
          <p className="text-[9px] text-blue-400 font-bold">🔥 4 campaigns sắp đạt giới hạn slots</p>
        </div>

        {/* KPI 4 */}
        <div className="bg-background-card border border-border p-5 rounded-custom space-y-3 shadow-lg">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold text-foreground-muted">Tổng khách hàng</span>
            <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded">
              <Users size={16} />
            </div>
          </div>
          <p className="text-lg font-black text-foreground">{customersCount} Accounts</p>
          <p className="text-[9px] text-foreground-muted font-bold">Tỉ lệ quay lại mua: 42%</p>
        </div>
      </div>

      {/* GRAPH CHART SECTION AND CAMPAIGNS LIMIT CHECK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Monthly revenue bar chart */}
        <div className="lg:col-span-8 bg-background-card border border-border p-5 rounded-custom space-y-4">
          <h3 className="text-xs font-black uppercase text-foreground flex items-center gap-1.5 border-b border-border/40 pb-3">
            <TrendingUp size={14} className="text-accent" /> Biểu đồ doanh thu 6 tháng gần nhất
          </h3>
          <div className="h-64 flex items-end justify-between gap-4 pt-8 px-4">
            {monthlyData.map((data, idx) => {
              const heightPct = Math.round((data.revenue / maxRevenueVal) * 100);
              return (
                <div key={idx} className="flex flex-col items-center gap-2 flex-grow h-full justify-end group relative">
                  {/* Tooltip */}
                  <span className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 border border-border text-[9px] font-bold px-2 py-0.5 rounded text-white shadow-lg pointer-events-none z-10">
                    {formatVND(data.revenue)}
                  </span>
                  
                  {/* Bar */}
                  <div
                    className="w-full bg-zinc-800 hover:bg-accent rounded-t transition-all duration-700"
                    style={{ height: `${heightPct}%` }}
                  />
                  
                  <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider mt-2">
                    {data.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hot Pre-order progress meters */}
        <div className="lg:col-span-4 bg-background-card border border-border p-5 rounded-custom space-y-4">
          <h3 className="text-xs font-black uppercase text-foreground flex items-center gap-1.5 border-b border-border/40 pb-3">
            <Sparkles size={14} className="text-accent" /> Tỉ lệ chốt pre-order
          </h3>

          <div className="space-y-4">
            {activeCampaigns.map((camp, idx) => (
              <div key={idx} className="space-y-1.5 text-xs text-left">
                <div className="flex justify-between font-bold text-foreground overflow-hidden">
                  <p className="truncate pr-4">{camp.name}</p>
                  <span className="shrink-0 text-accent font-mono">{camp.ratio}%</span>
                </div>
                <div className="w-full bg-zinc-950 border border-border/30 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-accent h-full rounded-full transition-all"
                    style={{ width: `${camp.ratio}%` }}
                  />
                </div>
                <p className="text-[10px] text-foreground-muted">{camp.brand} • Đã gom: {camp.ordered}/{camp.limit}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="bg-background-card border border-border rounded-custom p-5 space-y-4 shadow-lg text-left">
        <h3 className="text-xs font-black uppercase text-foreground border-b border-border pb-3 tracking-widest">
          Đơn đặt hàng mới nhất
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/60 text-foreground-muted font-bold text-[10px] uppercase tracking-wider">
                <th className="py-2.5">Mã đơn</th>
                <th className="py-2.5">Khách hàng</th>
                <th className="py-2.5">Loại</th>
                <th className="py-2.5">Trị giá</th>
                <th className="py-2.5">Trạng thái</th>
                <th className="py-2.5 text-right">Ngày đặt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 font-mono font-bold text-foreground">{ord.orderCode}</td>
                  <td className="py-3 text-foreground font-semibold">{ord.recipientName}</td>
                  <td className="py-3">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-zinc-950 border border-border rounded text-foreground-muted">
                      {ord.requiredDeposit > 0 ? 'Preorder' : 'Có sẵn'}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-foreground">{formatVND(ord.totalAmount)}</td>
                  <td className="py-3">
                    <span className={`text-[9px] uppercase font-black tracking-wider px-2 py-0.5 border rounded-sm ${ORDER_STATUS_COLOR[ord.status]}`}>
                      {ORDER_STATUS_TEXT[ord.status]}
                    </span>
                  </td>
                  <td className="py-3 text-right text-foreground-muted font-semibold">
                    {new Date(ord.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
