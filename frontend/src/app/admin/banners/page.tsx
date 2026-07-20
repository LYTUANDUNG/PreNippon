'use client';

import { useState } from 'react';
import { useBanners } from '../../../hooks/useBanner';
import { useToastStore } from '../../../store/toastStore';
import { Banner } from '../../../types/common';
import { Plus, Search, Edit2, Trash2, X, Check } from 'lucide-react';

export default function AdminBannersPage() {
  const { banners, createBanner, updateBanner, deleteBanner, isLoading } = useBanners();
  const addToast = useToastStore((state) => state.addToast);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('/products');
  const [type, setType] = useState<'HERO' | 'PROMO' | 'COUNTDOWN'>('HERO');
  const [orderIndex, setOrderIndex] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [badgeText, setBadgeText] = useState('');
  const [buttonText, setButtonText] = useState('Mua Ngay');
  const [countdownTarget, setCountdownTarget] = useState('');

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setTitle('');
    setImageUrl('https://images.unsplash.com/photo-1563089145-599997674d42?w=800');
    setLinkUrl('/products');
    setType('HERO');
    setOrderIndex(banners.length);
    setIsActive(true);
    setBadgeText('CAMPAIGN');
    setButtonText('Mua Ngay');
    setCountdownTarget('');
    setModalOpen(true);
  };

  const handleOpenEdit = (b: Banner) => {
    setEditingBanner(b);
    setTitle(b.title);
    setImageUrl(b.imageUrl);
    setLinkUrl(b.linkUrl);
    setType(b.type);
    setOrderIndex(b.orderIndex);
    setIsActive(b.isActive);
    setBadgeText(b.badgeText || '');
    setButtonText(b.buttonText || 'Mua Ngay');
    setCountdownTarget(b.countdownTarget || '');
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc muốn xóa banner này?')) {
      try {
        await deleteBanner(id);
        addToast('Đã xóa banner thành công!', 'success');
      } catch (err) {
        addToast('Lỗi khi xóa banner!', 'error');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      title,
      imageUrl,
      linkUrl,
      type,
      orderIndex: Number(orderIndex),
      isActive,
      badgeText: type === 'HERO' ? badgeText : undefined,
      buttonText: type === 'HERO' ? buttonText : undefined,
      countdownTarget: type === 'COUNTDOWN' ? countdownTarget : undefined
    };

    try {
      if (editingBanner) {
        await updateBanner({ id: editingBanner.id, banner: payload });
        addToast('Cập nhật banner thành công!', 'success');
      } else {
        await createBanner(payload);
        addToast('Tạo banner mới thành công!', 'success');
      }
      setModalOpen(false);
    } catch (err) {
      addToast('Lỗi khi lưu banner!', 'error');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight">Quản Lý Banner Quảng Cáo</h1>
          <p className="text-xs text-foreground-muted">Sắp xếp các slide biểu ngữ lớn, flash sale hoặc countdown trên trang chủ</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-custom transition-all cursor-pointer"
        >
          <Plus size={16} /> Thêm banner
        </button>
      </div>

      {isLoading ? (
        <p className="text-xs text-foreground-muted">Đang tải...</p>
      ) : (
        <div className="bg-background-card border border-border rounded-custom overflow-hidden shadow-lg">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border text-foreground-muted font-bold text-[10px] uppercase tracking-wider bg-zinc-900/50">
                <th className="p-3">Xem trước</th>
                <th className="p-3">Tiêu đề / Liên kết</th>
                <th className="p-3">Loại</th>
                <th className="p-3">Thứ tự</th>
                <th className="p-3">Hiển thị</th>
                <th className="p-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {banners.map((b) => (
                <tr key={b.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="p-3 max-w-[120px]">
                    <img src={b.imageUrl} alt={b.title} className="w-16 h-10 object-cover rounded border border-border bg-zinc-900 shrink-0" />
                  </td>
                  <td className="p-3">
                    <p className="font-bold text-foreground line-clamp-1">{b.title}</p>
                    <p className="text-[10px] text-foreground-muted truncate max-w-xs">{b.linkUrl}</p>
                  </td>
                  <td className="p-3 font-semibold text-foreground-muted font-mono">{b.type}</td>
                  <td className="p-3 font-semibold">{b.orderIndex}</td>
                  <td className="p-3">
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-sm ${
                      b.isActive ? 'text-green-500 bg-green-500/10' : 'text-zinc-500 bg-zinc-900/30'
                    }`}>
                      {b.isActive ? 'HIỆN' : 'ẨN'}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(b)}
                      className="p-1.5 bg-zinc-900 border border-border text-foreground hover:text-accent rounded hover:border-accent transition-all cursor-pointer inline-flex"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-1.5 bg-zinc-900 border border-border text-foreground hover:text-accent rounded hover:border-accent transition-all cursor-pointer inline-flex"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* BANNER CRUD MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModalOpen(false)} />
          <div className="relative bg-background border border-border rounded-custom shadow-2xl w-full max-w-lg z-10 p-6 flex flex-col justify-between">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-foreground-muted hover:text-foreground"
            >
              <X size={16} />
            </button>
            <h3 className="text-sm font-black uppercase text-foreground mb-4 border-b border-border pb-2">
              {editingBanner ? `Sửa Banner #${editingBanner.id}` : 'Thêm Banner mới'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-foreground-muted">Tiêu đề Banner</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-3 outline-none focus:border-accent text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-foreground-muted">Loại Banner</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-2 outline-none focus:border-accent text-foreground"
                  >
                    <option value="HERO">Hero Slideshow (HERO)</option>
                    <option value="PROMO">Promotions (PROMO)</option>
                    <option value="COUNTDOWN">Campaign Ticker (COUNTDOWN)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-foreground-muted">Thứ tự hiển thị</label>
                  <input
                    type="number"
                    required
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(Number(e.target.value))}
                    className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-3 outline-none focus:border-accent text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-foreground-muted">Image URL (Hình ảnh quảng cáo)</label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-3 outline-none focus:border-accent text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-foreground-muted">Liên kết đích (Redirect Link)</label>
                <input
                  type="text"
                  required
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-3 outline-none focus:border-accent text-foreground"
                />
              </div>

              {type === 'HERO' && (
                <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-foreground-muted">Thẻ Badge nổi bật</label>
                    <input
                      type="text"
                      value={badgeText}
                      onChange={(e) => setBadgeText(e.target.value)}
                      className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-3 outline-none focus:border-accent text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-foreground-muted">Chữ trên nút bấm</label>
                    <input
                      type="text"
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-3 outline-none focus:border-accent text-foreground"
                    />
                  </div>
                </div>
              )}

              {type === 'COUNTDOWN' && (
                <div className="space-y-1 border-t border-border/40 pt-3">
                  <label className="text-[9px] uppercase font-bold text-foreground-muted">Thời điểm Countdown đích (ISO Date String)</label>
                  <input
                    type="text"
                    placeholder="2026-12-31T23:59:59Z"
                    value={countdownTarget}
                    onChange={(e) => setCountdownTarget(e.target.value)}
                    className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-3 outline-none focus:border-accent text-foreground"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="active_check"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-border outline-none text-accent focus:ring-accent"
                />
                <label htmlFor="active_check" className="font-bold text-foreground select-none cursor-pointer">
                  Kích hoạt hiển thị công khai trên giao diện
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-border text-foreground hover:bg-zinc-900 rounded-custom transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-accent hover:bg-accent-hover text-white rounded-custom font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Check size={14} /> Lưu Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
