'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useProducts } from '../../../hooks/useProducts';
import ProductCard from '../../../components/ProductCard';
import { GridSkeleton } from '../../../components/SkeletonLoading';
import EmptyState from '../../../components/EmptyState';
import { Filter, SlidersHorizontal, Search, X } from 'lucide-react';
import { getMockTable } from '../../../api/apiClient';
import { Category, Brand, Series } from '../../../types/product';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { products, isLoading } = useProducts();

  // Load static catalog lists
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [seriesList, setSeriesList] = useState<Series[]>([]);

  useEffect(() => {
    setCategories(getMockTable<Category>('categories'));
    setBrands(getMockTable<Brand>('brands'));
    setSeriesList(getMockTable<Series>('series'));
  }, []);

  // Filter States (synchronized from URL params if present)
  const [searchFilter, setSearchFilter] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const [brandFilter, setBrandFilter] = useState(searchParams.get('brand') || '');
  const [seriesFilter, setSeriesFilter] = useState(searchParams.get('series') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [priceFilter, setPriceFilter] = useState(searchParams.get('price') || ''); // e.g. "under-1m", "1m-3m", "over-3m"
  const [sortOption, setSortOption] = useState('newest');
  
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    setSearchFilter(searchParams.get('search') || '');
    setCategoryFilter(searchParams.get('category') || '');
    setBrandFilter(searchParams.get('brand') || '');
    setSeriesFilter(searchParams.get('series') || '');
    setStatusFilter(searchParams.get('status') || '');
  }, [searchParams]);

  // Update query params helper
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSearchFilter('');
    setCategoryFilter('');
    setBrandFilter('');
    setSeriesFilter('');
    setStatusFilter('');
    setPriceFilter('');
    router.push('/products');
  };

  // Filter products locally
  const filteredProducts = products.filter((p) => {
    // Search filter
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      const matchSearch =
        p.name.toLowerCase().includes(q) ||
        p.brand.name.toLowerCase().includes(q) ||
        p.series.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);
      if (!matchSearch) return false;
    }

    // Category filter
    if (categoryFilter && p.category.slug !== categoryFilter) {
      return false;
    }

    // Brand filter
    if (brandFilter && p.brand.slug !== brandFilter) {
      return false;
    }

    // Series filter
    if (seriesFilter && p.series.slug !== seriesFilter) {
      return false;
    }

    // Status filter
    if (statusFilter && p.status !== statusFilter) {
      return false;
    }

    // Price filter
    if (priceFilter) {
      if (priceFilter === 'under-1m' && p.price >= 1000000) return false;
      if (priceFilter === '1m-3m' && (p.price < 1000000 || p.price > 3000000)) return false;
      if (priceFilter === '3m-5m' && (p.price < 3000000 || p.price > 5000000)) return false;
      if (priceFilter === 'over-5m' && p.price <= 5000000) return false;
    }

    return true;
  });

  // Sort products locally
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    // newest: sort by id desc
    return b.id - a.id;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* 1. Page Header & Live search bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Danh Sách Sản Phẩm</h1>
          <p className="text-xs text-foreground-muted">Khám phá và đặt trước các figure chính hãng Nhật Bản mới nhất</p>
        </div>
        <div className="flex items-center gap-3 w-full md:max-w-xs">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Gõ tìm nhanh..."
              value={searchFilter}
              onChange={(e) => {
                setSearchFilter(e.target.value);
                updateFilter('search', e.target.value);
              }}
              className="w-full h-10 bg-background-card border border-border text-foreground rounded-custom px-3 pr-8 text-xs font-semibold outline-none focus:border-accent"
            />
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
          </div>
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden p-2.5 bg-background-card border border-border rounded-custom hover:border-accent text-foreground-muted"
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 2. SIDEBAR FILTER (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-20 bg-background-card border border-border p-5 rounded-custom max-h-[85vh] overflow-y-auto">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1 text-foreground">
              <Filter size={14} className="text-accent" /> Bộ lọc sản phẩm
            </span>
            <button onClick={clearAllFilters} className="text-[10px] text-accent hover:underline font-bold uppercase">
              Xóa lọc
            </button>
          </div>

          {/* Availability filter */}
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase font-bold text-foreground-muted">Tình trạng</h4>
            <div className="flex flex-col gap-1.5 text-xs">
              {[
                { label: 'Tất cả', val: '' },
                { label: 'Có sẵn tại kho', val: 'AVAILABLE' },
                { label: 'Đang mở Pre-order', val: 'PREORDER' },
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => { setStatusFilter(item.val); updateFilter('status', item.val); }}
                  className={`text-left py-1 hover:text-accent transition-colors ${
                    statusFilter === item.val ? 'text-accent font-bold' : 'text-foreground-muted'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories filter */}
          <div className="space-y-2 border-t border-border pt-4">
            <h4 className="text-[10px] uppercase font-bold text-foreground-muted">Danh mục</h4>
            <div className="flex flex-col gap-1.5 text-xs max-h-[160px] overflow-y-auto">
              <button
                onClick={() => { setCategoryFilter(''); updateFilter('category', ''); }}
                className={`text-left py-1 hover:text-accent transition-colors ${
                  !categoryFilter ? 'text-accent font-bold' : 'text-foreground-muted'
                }`}
              >
                Tất cả danh mục
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setCategoryFilter(cat.slug); updateFilter('category', cat.slug); }}
                  className={`text-left py-1 hover:text-accent transition-colors ${
                    categoryFilter === cat.slug ? 'text-accent font-bold' : 'text-foreground-muted'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Brands filter */}
          <div className="space-y-2 border-t border-border pt-4">
            <h4 className="text-[10px] uppercase font-bold text-foreground-muted">Nhà sản xuất</h4>
            <div className="flex flex-col gap-1.5 text-xs max-h-[160px] overflow-y-auto">
              <button
                onClick={() => { setBrandFilter(''); updateFilter('brand', ''); }}
                className={`text-left py-1 hover:text-accent transition-colors ${
                  !brandFilter ? 'text-accent font-bold' : 'text-foreground-muted'
                }`}
              >
                Tất cả hãng
              </button>
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => { setBrandFilter(brand.slug); updateFilter('brand', brand.slug); }}
                  className={`text-left py-1 hover:text-accent transition-colors ${
                    brandFilter === brand.slug ? 'text-accent font-bold' : 'text-foreground-muted'
                  }`}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          </div>

          {/* Series filter */}
          <div className="space-y-2 border-t border-border pt-4">
            <h4 className="text-[10px] uppercase font-bold text-foreground-muted">Anime / IP Series</h4>
            <div className="flex flex-col gap-1.5 text-xs max-h-[160px] overflow-y-auto">
              <button
                onClick={() => { setSeriesFilter(''); updateFilter('series', ''); }}
                className={`text-left py-1 hover:text-accent transition-colors ${
                  !seriesFilter ? 'text-accent font-bold' : 'text-foreground-muted'
                }`}
              >
                Tất cả series
              </button>
              {seriesList.map((ser) => (
                <button
                  key={ser.id}
                  onClick={() => { setSeriesFilter(ser.slug); updateFilter('series', ser.slug); }}
                  className={`text-left py-1 hover:text-accent transition-colors ${
                    seriesFilter === ser.slug ? 'text-accent font-bold' : 'text-foreground-muted'
                  }`}
                >
                  {ser.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price filter */}
          <div className="space-y-2 border-t border-border pt-4">
            <h4 className="text-[10px] uppercase font-bold text-foreground-muted">Khoảng giá</h4>
            <div className="flex flex-col gap-1.5 text-xs">
              {[
                { label: 'Tất cả giá', val: '' },
                { label: 'Dưới 1,000,000đ', val: 'under-1m' },
                { label: '1,000,000đ - 3,000,000đ', val: '1m-3m' },
                { label: '3,000,000đ - 5,000,000đ', val: '3m-5m' },
                { label: 'Trên 5,000,000đ', val: 'over-5m' },
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => setPriceFilter(item.val)}
                  className={`text-left py-1 hover:text-accent transition-colors ${
                    priceFilter === item.val ? 'text-accent font-bold' : 'text-foreground-muted'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* 3. PRODUCT GRID & SORT CONTROLLER (Right panel) */}
        <main className="lg:col-span-9 space-y-6">
          {/* Sorting controllers */}
          <div className="flex justify-between items-center bg-background-card border border-border px-4 py-3 rounded-custom text-xs">
            <span className="text-foreground-muted">
              Hiển thị <span className="text-foreground font-bold">{sortedProducts.length}</span> mô hình
            </span>
            <div className="flex items-center gap-2">
              <span className="text-foreground-muted">Sắp xếp:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-zinc-900 border border-border text-foreground px-2 py-1.5 rounded-custom outline-none focus:border-accent text-xs font-semibold cursor-pointer"
              >
                <option value="newest">Hàng mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
              </select>
            </div>
          </div>

          {/* Grid View */}
          {isLoading ? (
            <GridSkeleton count={8} />
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {sortedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Không tìm thấy figure phù hợp"
              message="Vui lòng điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm của bạn để khám phá các sản phẩm khác."
              buttonText="Xóa tất cả bộ lọc"
              linkUrl="/products"
            />
          )}
        </main>
      </div>

      {/* 4. MOBILE SLIDE OVER FILTER OVERLAY */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative bg-background border-l border-border w-full max-w-xs h-full p-5 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1">
                  <Filter size={14} className="text-accent" /> Bộ lọc di động
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full hover:bg-zinc-900 border border-border text-foreground-muted hover:text-foreground"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Status mobile filter */}
              <div className="space-y-2">
                <h4 className="text-[10px] uppercase font-bold text-foreground-muted">Tình trạng</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Tất cả', val: '' },
                    { label: 'Có sẵn', val: 'AVAILABLE' },
                    { label: 'Pre-order', val: 'PREORDER' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => {
                        setStatusFilter(item.val);
                        updateFilter('status', item.val);
                        setMobileFilterOpen(false);
                      }}
                      className={`px-3 py-1 border text-xs rounded-full font-bold ${
                        statusFilter === item.val
                          ? 'border-accent bg-accent text-white'
                          : 'border-border text-foreground-muted bg-zinc-900'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category mobile filter */}
              <div className="space-y-2 border-t border-border pt-4">
                <h4 className="text-[10px] uppercase font-bold text-foreground-muted">Danh mục</h4>
                <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto">
                  <button
                    onClick={() => {
                      setCategoryFilter('');
                      updateFilter('category', '');
                      setMobileFilterOpen(false);
                    }}
                    className={`px-3 py-1 border text-xs rounded-full font-bold ${
                      !categoryFilter
                        ? 'border-accent bg-accent text-white'
                        : 'border-border text-foreground-muted bg-zinc-900'
                    }`}
                  >
                    Tất cả
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategoryFilter(cat.slug);
                        updateFilter('category', cat.slug);
                        setMobileFilterOpen(false);
                      }}
                      className={`px-3 py-1 border text-xs rounded-full font-bold ${
                        categoryFilter === cat.slug
                          ? 'border-accent bg-accent text-white'
                          : 'border-border text-foreground-muted bg-zinc-900'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price mobile filter */}
              <div className="space-y-2 border-t border-border pt-4">
                <h4 className="text-[10px] uppercase font-bold text-foreground-muted">Mức giá</h4>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'Tất cả mức giá', val: '' },
                    { label: 'Dưới 1,000,000đ', val: 'under-1m' },
                    { label: '1,000,000đ - 3,000,000đ', val: '1m-3m' },
                    { label: '3,000,000đ - 5,000,000đ', val: '3m-5m' },
                    { label: 'Trên 5,000,000đ', val: 'over-5m' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => {
                        setPriceFilter(item.val);
                        setMobileFilterOpen(false);
                      }}
                      className={`text-left py-1 text-xs ${
                        priceFilter === item.val ? 'text-accent font-bold' : 'text-foreground-muted'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                clearAllFilters();
                setMobileFilterOpen(false);
              }}
              className="w-full bg-zinc-900 border border-border text-foreground py-2.5 rounded-custom text-xs font-bold uppercase tracking-wider mt-6"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold uppercase tracking-wider text-foreground-muted">Đang tải danh mục sản phẩm...</p>
      </div>
    }>
      <ProductsCatalogContent />
    </Suspense>
  );
}
