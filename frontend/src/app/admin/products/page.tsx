'use client';

import { useState } from 'react';
import { useProducts } from '../../../hooks/useProducts';
import { useToastStore } from '../../../store/toastStore';
import { Product } from '../../../types/product';
import { Plus, Search, Edit2, Trash2, X, PlusCircle, Check } from 'lucide-react';
import { getMockTable } from '../../../api/apiClient';

export default function AdminProductsCRUDPage() {
  const { products, createProduct, updateProduct, deleteProduct, isLoading } = useProducts();
  const addToast = useToastStore((state) => state.addToast);

  // States
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState(1500000);
  const [status, setStatus] = useState<'AVAILABLE' | 'PREORDER' | 'OUT_OF_STOCK'>('AVAILABLE');
  const [quantity, setQuantity] = useState(10);
  const [description, setDescription] = useState('');
  const [brandId, setBrandId] = useState(1);
  const [categoryId, setCategoryId] = useState(2);
  const [seriesId, setSeriesId] = useState(1);
  const [imageUrls, setImageUrls] = useState('https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800');
  
  // Specs
  const [character, setCharacter] = useState('');
  const [scale, setScale] = useState('1/7');
  const [height, setHeight] = useState('24 cm');

  // Preorder campaign subform
  const [isPreorderCampaign, setIsPreorderCampaign] = useState(false);
  const [depositPercentage, setDepositPercentage] = useState(30);
  const [limitQuantity, setLimitQuantity] = useState(100);
  const [releaseDate, setReleaseDate] = useState('Tháng 12/2026');

  // Static options loaded
  const categoriesList = getMockTable<any>('categories');
  const brandsList = getMockTable<any>('brands');
  const seriesList = getMockTable<any>('series');

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName('');
    setSku('');
    setPrice(1500000);
    setStatus('AVAILABLE');
    setQuantity(10);
    setDescription('');
    setBrandId(1);
    setCategoryId(2);
    setSeriesId(1);
    setImageUrls('https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800');
    setCharacter('');
    setScale('1/7');
    setHeight('24 cm');
    setIsPreorderCampaign(false);
    setModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setPrice(p.price);
    setStatus(p.status as any);
    setQuantity(p.quantity);
    setDescription(p.description);
    setBrandId(p.brand.id);
    setCategoryId(p.category.id);
    setSeriesId(p.series.id);
    setImageUrls(p.images.map((img) => img.url).join(', '));
    setCharacter(p.character || '');
    setScale(p.scale || '1/7');
    setHeight(p.height || '24 cm');
    
    // Campaign check
    if (p.status === 'PREORDER' && p.campaign) {
      setIsPreorderCampaign(true);
      setDepositPercentage(p.campaign.depositPercentage);
      setLimitQuantity(p.campaign.limitQuantity);
      setReleaseDate(p.campaign.releaseDate);
    } else {
      setIsPreorderCampaign(false);
    }

    setModalOpen(true);
  };

  const handleDelete = async (id: number, pName: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm ${pName}?`)) {
      try {
        await deleteProduct(id);
        addToast(`Đã xóa thành công sản phẩm: ${pName}`, 'success');
      } catch (err) {
        addToast('Lỗi khi xóa sản phẩm!', 'error');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Map objects
    const category = categoriesList.find((c) => c.id === Number(categoryId)) || categoriesList[0];
    const brand = brandsList.find((b) => b.id === Number(brandId)) || brandsList[0];
    const series = seriesList.find((s) => s.id === Number(seriesId)) || seriesList[0];

    // Image splits
    const imagesArray = imageUrls
      .split(',')
      .map((url, idx) => ({
        id: Date.now() + idx,
        productId: editingProduct?.id || 999,
        url: url.trim(),
        isThumbnail: idx === 0,
      }));

    // Preorder Campaign builder
    let campaign = null;
    if (status === 'PREORDER' || isPreorderCampaign) {
      campaign = {
        id: editingProduct?.campaign?.id || Date.now(),
        productId: editingProduct?.id || 999,
        openDate: new Date().toISOString(),
        closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days close
        releaseDate: releaseDate,
        depositPercentage: Number(depositPercentage),
        depositAmount: (price * Number(depositPercentage)) / 100,
        limitQuantity: Number(limitQuantity),
        orderedQuantity: editingProduct?.campaign?.orderedQuantity || 0,
        status: 'ACTIVE',
        timelines: editingProduct?.campaign?.timelines || [
          {
            id: Date.now() + 100,
            campaignId: editingProduct?.campaign?.id || Date.now(),
            stage: 'OPENED',
            notes: 'Mở nhận pre-order chính hãng từ nhà sản xuất.',
            updatedAt: new Date().toISOString()
          }
        ]
      };
    }

    const payload: any = {
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      sku,
      price: Number(price),
      status: (isPreorderCampaign ? 'PREORDER' : status) as any,
      quantity: isPreorderCampaign ? 0 : Number(quantity),
      description,
      category,
      brand,
      series,
      images: imagesArray,
      campaign,
      character,
      scale,
      height,
      manufacturer: brand.name,
      releaseDateText: isPreorderCampaign ? releaseDate : 'Có sẵn'
    };

    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, product: payload });
        addToast(`Cập nhật thành công: ${name}`, 'success');
      } else {
        await createProduct(payload);
        addToast(`Thêm thành công mô hình mới: ${name}`, 'success');
      }
      setModalOpen(false);
    } catch (err) {
      addToast('Lỗi khi lưu sản phẩm!', 'error');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      
      {/* Upper options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight">Quản Lý Danh Mục Kho</h1>
          <p className="text-xs text-foreground-muted">Thêm mới, sửa đổi thông tin hoặc xóa mô hình sản phẩm</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-custom transition-all cursor-pointer"
        >
          <Plus size={16} /> Thêm figure mới
        </button>
      </div>

      {/* Search filter bar */}
      <div className="relative max-w-sm w-full">
        <input
          type="text"
          placeholder="Tìm tên mô hình, mã SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 bg-background-card border border-border text-foreground rounded-custom px-3 pr-8 text-xs font-semibold placeholder:text-foreground-muted outline-none focus:border-accent"
        />
        <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
      </div>

      {/* Data Table */}
      {isLoading ? (
        <p className="text-xs text-foreground-muted py-6">Đang truy vấn danh mục...</p>
      ) : (
        <div className="bg-background-card border border-border rounded-custom overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border text-foreground-muted font-bold text-[10px] uppercase tracking-wider bg-zinc-900/50">
                  <th className="p-3">Mô tả</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Tình trạng</th>
                  <th className="p-3">Hãng / Series</th>
                  <th className="p-3">Giá bán</th>
                  <th className="p-3">Kho / Preorder</th>
                  <th className="p-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredProducts.map((p) => {
                  const thumb = p.images.find((img) => img.isThumbnail)?.url || p.images[0]?.url;
                  const isPre = p.status === 'PREORDER' && p.campaign;

                  return (
                    <tr key={p.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="p-3 flex items-center gap-3 max-w-[280px]">
                        <img src={thumb} alt={p.name} className="w-10 h-12 object-cover rounded border border-border bg-zinc-900 shrink-0" />
                        <span className="font-bold text-foreground line-clamp-2 leading-snug">{p.name}</span>
                      </td>
                      <td className="p-3 font-mono text-foreground-muted">{p.sku}</td>
                      <td className="p-3">
                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-sm border ${
                          p.status === 'AVAILABLE'
                            ? 'border-green-500 text-green-500 bg-green-500/5'
                            : p.status === 'PREORDER'
                            ? 'border-accent text-accent bg-accent/5'
                            : 'border-zinc-700 text-zinc-500 bg-zinc-900/30'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-foreground">{p.brand.name}</p>
                        <p className="text-[10px] text-foreground-muted">{p.series.name}</p>
                      </td>
                      <td className="p-3 font-bold text-foreground">{formatVND(p.price)}</td>
                      <td className="p-3">
                        {isPre ? (
                          <p className="text-accent font-semibold">Gom: {p.campaign!.orderedQuantity}/{p.campaign!.limitQuantity} Suất</p>
                        ) : (
                          <p className="text-foreground-muted">Sẵn: {p.quantity} Hộp</p>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2 shrink-0">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 bg-zinc-900 border border-border text-foreground hover:text-accent rounded hover:border-accent transition-all cursor-pointer inline-flex"
                          title="Sửa sản phẩm"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 bg-zinc-900 border border-border text-foreground hover:text-accent rounded hover:border-accent transition-all cursor-pointer inline-flex"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CRUD MODAL FORM OVERLAY */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModalOpen(false)} />
          <div className="relative bg-background border border-border rounded-custom shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto z-10 p-6 flex flex-col justify-between">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-foreground-muted hover:text-foreground"
            >
              <X size={16} />
            </button>
            <h3 className="text-sm font-black uppercase text-foreground mb-4 border-b border-border pb-2">
              {editingProduct ? `Cập nhật sản phẩm #${editingProduct.id}` : 'Thêm figure mô hình mới'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] uppercase font-bold text-foreground-muted">Tên mô hình</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-3 text-xs outline-none focus:border-accent text-foreground font-semibold"
                  />
                </div>

                {/* SKU */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-foreground-muted">Mã SKU</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-3 text-xs outline-none focus:border-accent text-foreground font-mono"
                  />
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-foreground-muted">Giá niêm yết (VND)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-3 text-xs outline-none focus:border-accent text-foreground"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-foreground-muted">Danh mục</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-2 outline-none focus:border-accent text-foreground"
                  >
                    {categoriesList.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Brand Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-foreground-muted">Nhà sản xuất</label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(Number(e.target.value))}
                    className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-2 outline-none focus:border-accent text-foreground"
                  >
                    {brandsList.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Series Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-foreground-muted">IP / Series</label>
                  <select
                    value={seriesId}
                    onChange={(e) => setSeriesId(Number(e.target.value))}
                    className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-2 outline-none focus:border-accent text-foreground"
                  >
                    {seriesList.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* Images */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] uppercase font-bold text-foreground-muted">URLs Ảnh (Cách nhau bằng dấu phẩy, ảnh đầu tiên là thumbnail)</label>
                  <input
                    type="text"
                    required
                    value={imageUrls}
                    onChange={(e) => setImageUrls(e.target.value)}
                    className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-3 text-xs outline-none focus:border-accent text-foreground"
                  />
                </div>

                {/* Specs */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-foreground-muted">Tỷ lệ (Scale)</label>
                  <input
                    type="text"
                    value={scale}
                    onChange={(e) => setScale(e.target.value)}
                    className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-3 text-xs outline-none focus:border-accent text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-foreground-muted">Chiều cao (Height)</label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-3 text-xs outline-none focus:border-accent text-foreground"
                  />
                </div>

                {/* Status selection */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-foreground-muted">Trạng thái bán hàng</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-2 outline-none focus:border-accent text-foreground"
                  >
                    <option value="AVAILABLE">Có sẵn hàng (AVAILABLE)</option>
                    <option value="PREORDER">Nhận đặt trước (PREORDER)</option>
                    <option value="OUT_OF_STOCK">Tạm hết hàng (OUT_OF_STOCK)</option>
                  </select>
                </div>

                {/* Stock Quantity if AVAILABLE */}
                {status !== 'PREORDER' && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-foreground-muted">Số lượng tồn kho (Hộp)</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-3 text-xs outline-none focus:border-accent text-foreground"
                    />
                  </div>
                )}
              </div>

              {/* Toggle Campaign inputs if PREORDER */}
              {status === 'PREORDER' && (
                <div className="border border-accent/20 bg-accent-muted/5 p-4 rounded-custom space-y-4 mt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="campaign_check"
                      checked={isPreorderCampaign}
                      onChange={(e) => setIsPreorderCampaign(e.target.checked)}
                      className="rounded border-border outline-none focus:ring-accent text-accent"
                    />
                    <label htmlFor="campaign_check" className="font-bold text-foreground select-none cursor-pointer">
                      Kích hoạt Pre-order Campaign (Bắt buộc thiết lập lịch trình)
                    </label>
                  </div>

                  {isPreorderCampaign && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-foreground-muted">Phần trăm đặt cọc (%)</label>
                        <input
                          type="number"
                          value={depositPercentage}
                          onChange={(e) => setDepositPercentage(Number(e.target.value))}
                          className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-3 outline-none focus:border-accent text-foreground"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-foreground-muted">Giới hạn Suất (Slots)</label>
                        <input
                          type="number"
                          value={limitQuantity}
                          onChange={(e) => setLimitQuantity(Number(e.target.value))}
                          className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-3 outline-none focus:border-accent text-foreground"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-foreground-muted">Dự kiến phát hành</label>
                        <input
                          type="text"
                          value={releaseDate}
                          onChange={(e) => setReleaseDate(e.target.value)}
                          className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-3 outline-none focus:border-accent text-foreground"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-foreground-muted">Mô tả sản phẩm</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-900 border border-border rounded-custom p-3 text-xs outline-none focus:border-accent text-foreground resize-none"
                />
              </div>

              {/* Save triggers */}
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
                  <Check size={14} /> Lưu sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
