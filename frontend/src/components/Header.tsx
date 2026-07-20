'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useThemeStore } from '../store/themeStore';
import { useAuth } from '../hooks/useAuth';
import { useToastStore } from '../store/toastStore';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types/product';
import { ROUTES } from '../constants';
import {
  Search,
  Heart,
  ShoppingCart,
  User as UserIcon,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Coins
} from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Stores & Hooks
  const cartCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const { theme, toggleTheme } = useThemeStore();
  const { user, login, register, logout, isAuthenticated, isLoggingIn, isRegistering } = useAuth();
  const { products } = useProducts();
  const addToast = useToastStore((state) => state.addToast);

  // UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Authentication Fields
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('123456'); // Pre-fill default demo pwd
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');

  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle live search filtering
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.name.toLowerCase().includes(query) ||
          p.series.name.toLowerCase().includes(query)
      ).slice(0, 5); // Limit 5 suggestions
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, products]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      router.push(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleDemoLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email: loginEmail, password: loginPassword });
      addToast('Đăng nhập thành công!', 'success');
      setLoginModalOpen(false);
    } catch (err: any) {
      addToast(err.message || 'Lỗi đăng nhập!', 'error');
    }
  };

  const handleDemoRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ name: registerName, email: registerEmail });
      addToast('Đăng ký tài khoản thành công! Đã tự động đăng nhập.', 'success');
      setLoginModalOpen(false);
    } catch (err: any) {
      addToast(err.message || 'Lỗi đăng ký!', 'error');
    }
  };

  const handleLogoutClick = () => {
    logout();
    addToast('Đã đăng xuất tài khoản.', 'info');
    setUserDropdownOpen(false);
    router.push('/');
  };

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-background/85 backdrop-blur-md border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        {/* LOGO */}
        <Link href={ROUTES.HOME} className="flex items-center gap-1.5 shrink-0">
          <span className="text-xl font-black text-foreground tracking-tighter">
            PRE<span className="text-accent">NIPPON</span>
          </span>
          <span className="hidden sm:inline-block text-[9px] font-bold text-accent px-1.5 py-0.5 border border-accent/30 rounded uppercase tracking-widest">
            AUTHENTIC
          </span>
        </Link>

        {/* MEGA MENU / NAVIGATION (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-extrabold uppercase tracking-wider text-foreground-muted">
          <Link href={ROUTES.PRODUCTS} className={`hover:text-accent transition-colors ${pathname === ROUTES.PRODUCTS ? 'text-accent' : 'text-foreground'}`}>
            Tất cả
          </Link>
          <Link href={`${ROUTES.PRODUCTS}?status=PREORDER`} className="hover:text-accent transition-colors">
            Pre-order
          </Link>
          <Link href={`${ROUTES.PRODUCTS}?status=AVAILABLE`} className="hover:text-accent transition-colors">
            Có sẵn
          </Link>
          <Link href={`${ROUTES.PRODUCTS}?category=sale`} className="hover:text-accent transition-colors">
            Sale Hot
          </Link>
          <Link href={ROUTES.BLOGS} className={`hover:text-accent transition-colors ${pathname.startsWith(ROUTES.BLOGS) ? 'text-accent' : 'text-foreground'}`}>
            Blog
          </Link>
          <Link href={ROUTES.ABOUT} className={`hover:text-accent transition-colors ${pathname === ROUTES.ABOUT ? 'text-accent' : 'text-foreground'}`}>
            Giới Thiệu
          </Link>
        </nav>

        {/* SEARCH & SYSTEM ACTIONS */}
        <div className="flex items-center gap-3 flex-grow md:flex-grow-0 max-w-md w-full justify-end">
          {/* Search bar */}
          <div ref={searchRef} className="relative hidden md:block max-w-[240px] w-full">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Tìm mỹ phẩm, thương hiệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full h-9 bg-background-card border border-border text-foreground rounded-custom px-3 pr-8 text-xs font-semibold placeholder:text-foreground-muted outline-none focus:border-accent transition-all"
              />
              <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-accent transition-colors">
                <Search size={14} />
              </button>
            </form>

            {/* Live Search Suggestions Dropdown */}
            {isSearchFocused && searchQuery.trim().length >= 2 && (
              <div className="absolute top-11 right-0 w-[300px] bg-background-card border border-border rounded-custom shadow-2xl overflow-hidden p-2 text-left z-50">
                <h4 className="text-[10px] uppercase font-bold text-foreground-muted px-2 py-1 border-b border-border/50 mb-1">
                  Gợi ý kết quả ({suggestions.length})
                </h4>
                {suggestions.length > 0 ? (
                  <div className="flex flex-col">
                    {suggestions.map((p) => (
                      <Link
                        key={p.id}
                        href={ROUTES.PRODUCT_DETAIL(p.slug)}
                        onClick={() => setIsSearchFocused(false)}
                        className="flex items-center gap-2.5 p-2 rounded-custom hover:bg-background-card-hover transition-colors"
                      >
                        <img
                          src={p.images.find((img) => img.isThumbnail)?.url || p.images[0]?.url}
                          alt={p.name}
                          className="w-10 h-12 object-cover rounded-sm border border-border"
                        />
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-foreground truncate">{p.name}</p>
                          <p className="text-[10px] text-accent font-semibold">
                            {formatVND(p.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                    <button
                      onClick={handleSearchSubmit}
                      className="text-center text-[10px] text-accent font-bold uppercase tracking-wider py-1.5 border-t border-border/40 mt-1 hover:underline w-full"
                    >
                      Xem tất cả kết quả
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-foreground-muted p-3 text-center">Không tìm thấy sản phẩm</p>
                )}
              </div>
            )}
          </div>

          {/* Quick Icons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-foreground-muted hover:text-foreground rounded-full hover:bg-background-card-hover transition-colors"
              title="Đổi giao diện"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Wishlist */}
            <Link
              href={ROUTES.WISHLIST}
              className="p-2 text-foreground-muted hover:text-accent rounded-full hover:bg-background-card-hover transition-colors relative"
              title="Yêu thích"
            >
              <Heart size={17} />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white leading-none scale-90">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href={ROUTES.CART}
              className="p-2 text-foreground-muted hover:text-accent rounded-full hover:bg-background-card-hover transition-colors relative"
              title="Giỏ hàng"
            >
              <ShoppingCart size={17} />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white leading-none scale-90">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Login Popup or Dropdown */}
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1 p-1 bg-background-card border border-border hover:border-accent rounded-full text-foreground transition-all cursor-pointer"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`}
                    alt={user.fullName}
                    className="w-7 h-7 rounded-full bg-background-card-hover"
                  />
                  <ChevronDown size={12} className="text-foreground-muted mr-1" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-10 w-[240px] bg-background-card border border-border rounded-custom shadow-2xl p-3 z-50 text-left">
                    <div className="border-b border-border/50 pb-2.5 mb-2.5">
                      <p className="text-xs font-extrabold text-foreground truncate">{user.fullName}</p>
                      <p className="text-[10px] text-foreground-muted truncate">{user.email}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-sm bg-accent text-white uppercase tracking-wider">
                          {user.tier}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-500">
                          <Coins size={10} />
                          {user.rewardPoints} Pts
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {user.role === 'ROLE_ADMIN' && (
                        <Link
                          href={ROUTES.ADMIN.DASHBOARD}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 p-1.5 text-xs text-foreground-muted hover:text-foreground hover:bg-background-card-hover rounded transition-all"
                        >
                          <LayoutDashboard size={14} className="text-accent" />
                          <span>Bảng quản trị</span>
                        </Link>
                      )}
                      <Link
                        href={ROUTES.ORDERS}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 p-1.5 text-xs text-foreground-muted hover:text-foreground hover:bg-background-card-hover rounded transition-all"
                      >
                        <ShoppingCart size={14} />
                        <span>Đơn hàng của tôi</span>
                      </Link>
                      <button
                        onClick={handleLogoutClick}
                        className="flex items-center gap-2 p-1.5 text-xs text-accent hover:bg-accent/10 rounded transition-all w-full text-left"
                      >
                        <LogOut size={14} />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="p-2 text-foreground-muted hover:text-foreground rounded-full hover:bg-background-card-hover transition-colors"
                title="Đăng nhập tài khoản"
              >
                <UserIcon size={17} />
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-foreground-muted hover:text-foreground rounded-full hover:bg-background-card-hover transition-colors"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN NAVIGATION */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background px-4 py-4 flex flex-col gap-4 text-sm font-extrabold uppercase tracking-wider text-foreground-muted animate-fade-in z-30">
          <Link
            href={ROUTES.PRODUCTS}
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 border-b border-border/30 hover:text-accent transition-colors"
          >
            Tất cả sản phẩm
          </Link>
          <Link
            href={`${ROUTES.PRODUCTS}?status=PREORDER`}
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 border-b border-border/30 hover:text-accent transition-colors"
          >
            Pre-order
          </Link>
          <Link
            href={`${ROUTES.PRODUCTS}?status=AVAILABLE`}
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 border-b border-border/30 hover:text-accent transition-colors"
          >
            Hàng có sẵn
          </Link>
          <Link
            href={`${ROUTES.PRODUCTS}?category=sale`}
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 border-b border-border/30 hover:text-accent transition-colors"
          >
            Chương trình Sale
          </Link>
          <Link
            href={ROUTES.BLOGS}
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 border-b border-border/30 hover:text-accent transition-colors"
          >
            Tin tức & Blog
          </Link>
          <Link
            href={ROUTES.ABOUT}
            onClick={() => setMobileMenuOpen(false)}
            className="py-1 border-b border-border/30 hover:text-accent transition-colors"
          >
            Về chúng tôi
          </Link>
        </div>
      )}

      {/* INLINE DEMO LOGIN POPUP MODAL */}
      </header>

      {loginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setLoginModalOpen(false)} />
          <div className="relative bg-background border border-border p-6 rounded-custom shadow-2xl max-w-sm w-full z-10 space-y-4 text-left">
            <button
              onClick={() => setLoginModalOpen(false)}
              className="absolute top-4 right-4 text-foreground-muted hover:text-foreground cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Tab Selector */}
            <div className="flex border-b border-border">
              <button
                type="button"
                onClick={() => setIsRegisterMode(false)}
                className={`flex-1 pb-2.5 text-xs font-black uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                  !isRegisterMode
                    ? 'border-accent text-accent'
                    : 'border-transparent text-foreground-muted hover:text-foreground'
                }`}
              >
                Đăng Nhập
              </button>
              <button
                type="button"
                onClick={() => setIsRegisterMode(true)}
                className={`flex-1 pb-2.5 text-xs font-black uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                  isRegisterMode
                    ? 'border-accent text-accent'
                    : 'border-transparent text-foreground-muted hover:text-foreground'
                }`}
              >
                Đăng Ký
              </button>
            </div>

            {!isRegisterMode ? (
              <>
                <p className="text-[11px] text-foreground-muted leading-relaxed">
                  Nhập email demo để test phân quyền. Mật khẩu mặc định là <span className="font-bold text-foreground">123456</span>.
                </p>

                <div className="space-y-1 bg-background-card-hover p-2.5 rounded-custom border border-border">
                  <p className="text-[9px] uppercase font-extrabold text-foreground-muted">Tài khoản mẫu:</p>
                  <p className="text-[10px] text-foreground-muted">
                    Admin: <span className="text-foreground font-mono select-all">admin1@prenippon.com</span>
                  </p>
                  <p className="text-[10px] text-foreground-muted">
                    Khách hàng: <span className="text-foreground font-mono select-all">customer1@gmail.com</span>
                  </p>
                </div>

                <form onSubmit={handleDemoLogin} className="space-y-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-foreground-muted">Email của bạn</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full h-10 bg-background-card border border-border rounded-custom px-3 text-xs font-semibold outline-none focus:border-accent text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-foreground-muted">Mật khẩu</label>
                    <input
                      type="password"
                      required
                      placeholder="Mật khẩu"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full h-10 bg-background-card border border-border rounded-custom px-3 text-xs font-semibold outline-none focus:border-accent text-foreground"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full h-10 bg-accent hover:bg-accent-hover disabled:bg-zinc-800 disabled:text-foreground-muted text-white rounded-custom text-xs font-bold uppercase tracking-wider transition-all duration-200 mt-4 cursor-pointer"
                  >
                    {isLoggingIn ? 'Đang xác thực...' : 'Đăng Nhập'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <p className="text-[11px] text-foreground-muted leading-relaxed">
                  Tạo tài khoản Demo mới. Hệ thống sẽ tự động gán phân quyền khách hàng (Customer).
                </p>

                <form onSubmit={handleDemoRegister} className="space-y-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-foreground-muted">Tên hiển thị</label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="w-full h-10 bg-background-card border border-border rounded-custom px-3 text-xs font-semibold outline-none focus:border-accent text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-foreground-muted">Email của bạn</label>
                    <input
                      type="email"
                      required
                      placeholder="newuser@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="w-full h-10 bg-background-card border border-border rounded-custom px-3 text-xs font-semibold outline-none focus:border-accent text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-foreground-muted">Mật khẩu khởi tạo</label>
                    <input
                      type="text"
                      disabled
                      value="123456 (Mặc định Demo)"
                      className="w-full h-10 bg-background-card-hover border border-border rounded-custom px-3 text-xs font-bold text-foreground-muted cursor-not-allowed"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full h-10 bg-accent hover:bg-accent-hover disabled:bg-zinc-800 disabled:text-foreground-muted text-white rounded-custom text-xs font-bold uppercase tracking-wider transition-all duration-200 mt-4 cursor-pointer"
                  >
                    {isRegistering ? 'Đang đăng ký...' : 'Đăng Ký Tài Khoản'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
