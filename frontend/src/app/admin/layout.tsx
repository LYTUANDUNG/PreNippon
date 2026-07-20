'use client';

import { useAuth } from '../../hooks/useAuth';
import Link from 'next/link';
import { ROUTES } from '../../constants';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  BookOpen,
  ArrowLeft,
  ShieldAlert,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import { useToastStore } from '../../store/toastStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, login, logout } = useAuth();
  const addToast = useToastStore((state) => state.addToast);
  
  const [email, setEmail] = useState('admin1@prenippon.com');
  const [password, setPassword] = useState('123456');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      addToast('Xác thực quản trị viên thành công!', 'success');
    } catch (err: any) {
      addToast(err.message || 'Sai thông tin đăng nhập!', 'error');
    }
  };

  // 1. Guard check: Only ROLE_ADMIN allowed
  if (!isAuthenticated || user?.role !== 'ROLE_ADMIN') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background text-foreground p-4">
        <div className="bg-background-card border border-border p-8 rounded-custom max-w-md w-full text-center space-y-6 shadow-premium">
          <div className="p-4 bg-accent/15 border border-accent/30 rounded-full text-accent w-16 h-16 flex items-center justify-center mx-auto animate-pulse">
            <ShieldAlert size={32} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-black uppercase tracking-tight">Yêu Cầu Quyền Quản Trị</h2>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Khu vực này giới hạn dành riêng cho quản trị viên PreNippon Store. Vui lòng đăng nhập bằng tài khoản Admin để truy cập.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left border-t border-border/50 pt-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-foreground-muted">Email quản trị viên</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 bg-background border border-border rounded-custom px-3 text-xs font-semibold outline-none focus:border-accent text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-foreground-muted">Mật khẩu</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 bg-background border border-border rounded-custom px-3 text-xs font-semibold outline-none focus:border-accent text-foreground"
              />
            </div>

            <button
              type="submit"
              className="w-full h-10 bg-accent hover:bg-accent-hover text-white rounded-custom text-xs font-bold uppercase tracking-wider transition-all duration-200 mt-2 cursor-pointer"
            >
              Đăng Nhập Quản Trị
            </button>
          </form>

          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-1.5 text-xs text-foreground-muted hover:text-foreground transition-colors mt-4"
          >
            <ArrowLeft size={14} /> Trở về trang cửa hàng
          </Link>
        </div>
      </div>
    );
  }

  // 2. Unlocked Sidebar View
  const menuItems = [
    { label: 'Bảng Báo Cáo', href: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
    { label: 'Quản Lý Sản Phẩm', href: ROUTES.ADMIN.PRODUCTS, icon: Package },
    { label: 'Quản Lý Đơn Hàng', href: ROUTES.ADMIN.ORDERS, icon: ShoppingBag },
    { label: 'Quản Lý Thành Viên', href: ROUTES.ADMIN.USERS, icon: Users },
    { label: 'Quản Lý Banners', href: ROUTES.ADMIN.BANNERS, icon: ImageIcon },
    { label: 'Quản Lý Blogs', href: ROUTES.ADMIN.BLOGS, icon: BookOpen },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans transition-colors">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-background-card border-r border-border flex flex-col justify-between shrink-0 h-screen sticky top-0">
        <div className="p-5 space-y-8">
          
          {/* Logo brand */}
          <Link href={ROUTES.HOME} className="flex items-center justify-between border-b border-border/40 pb-4">
            <span className="text-md font-black tracking-tighter">
              PRENIPPON <span className="text-accent">ADMIN</span>
            </span>
            <span className="text-[8px] bg-accent/20 border border-accent/40 px-1.5 py-0.5 rounded uppercase font-bold text-accent">
              Console
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 text-xs font-bold text-foreground-muted">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-custom hover:bg-background-card-hover hover:text-foreground transition-all duration-150"
                >
                  <Icon size={16} className="text-accent" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info footer and logout */}
        <div className="p-4 border-t border-border/50 space-y-3 bg-background-card-hover/20">
          <div className="flex items-center gap-2">
            <img
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`}
              alt={user.fullName}
              className="w-7 h-7 rounded-full bg-background-card"
            />
            <div className="overflow-hidden">
              <p className="text-[11px] font-bold text-foreground truncate">{user.fullName}</p>
              <p className="text-[9px] text-foreground-muted truncate">Quyền: {user.role}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); addToast('Đã đăng xuất tài khoản quản trị.', 'info'); }}
            className="w-full h-8 flex items-center justify-center gap-1.5 bg-background-card hover:bg-accent hover:text-white border border-border text-[10px] font-black uppercase rounded-custom transition-all"
          >
            <LogOut size={12} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-8 h-screen overflow-y-auto bg-background">
        {children}
      </main>

    </div>
  );
}
