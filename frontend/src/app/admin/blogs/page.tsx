'use client';

import { useState } from 'react';
import { useBlogs } from '../../../hooks/useBlogs';
import { useToastStore } from '../../../store/toastStore';
import { Blog } from '../../../types/blog';
import { Plus, Search, Edit2, Trash2, X, Check } from 'lucide-react';

export default function AdminBlogsPage() {
  const { blogs, createBlog, updateBlog, deleteBlog, isLoading } = useBlogs();
  const addToast = useToastStore((state) => state.addToast);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const handleOpenAdd = () => {
    setEditingBlog(null);
    setTitle('');
    setSummary('');
    setContent('');
    setThumbnail('https://images.unsplash.com/photo-1608889174633-8a3d3c8b4042?w=800');
    setTagsInput('Figure, Review, Anime');
    setModalOpen(true);
  };

  const handleOpenEdit = (b: Blog) => {
    setEditingBlog(b);
    setTitle(b.title);
    setSummary(b.summary);
    setContent(b.content);
    setThumbnail(b.thumbnail);
    setTagsInput(b.tags.join(', '));
    setModalOpen(true);
  };

  const handleDelete = async (id: number, bTitle: string) => {
    if (confirm(`Bạn có chắc muốn xóa bài viết "${bTitle}"?`)) {
      try {
        await deleteBlog(id);
        addToast('Đã xóa bài viết thành công!', 'success');
      } catch (err) {
        addToast('Lỗi khi xóa bài viết!', 'error');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const payload: any = {
      title,
      slug,
      summary,
      content,
      thumbnail,
      tags: tagsArray,
      seoTitle: `${title} | PreNippon`,
      seoDescription: summary.substring(0, 150),
      authorId: 27, // Admin
      authorName: 'Admin PreNippon'
    };

    try {
      if (editingBlog) {
        await updateBlog({ id: editingBlog.id, blog: payload });
        addToast('Cập nhật bài viết thành công!', 'success');
      } else {
        await createBlog(payload);
        addToast('Đăng bài viết mới thành công!', 'success');
      }
      setModalOpen(false);
    } catch (err) {
      addToast('Lỗi khi lưu bài viết!', 'error');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight">Quản Lý Bài Viết & Tin Tức</h1>
          <p className="text-xs text-foreground-muted">Viết bài mới, biên tập kiến thức figure sưu tầm hoặc thông báo khuyến mãi</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-custom transition-all cursor-pointer"
        >
          <Plus size={16} /> Viết bài mới
        </button>
      </div>

      {isLoading ? (
        <p className="text-xs text-foreground-muted">Đang tải bài viết...</p>
      ) : (
        <div className="bg-background-card border border-border rounded-custom overflow-hidden shadow-lg">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border text-foreground-muted font-bold text-[10px] uppercase tracking-wider bg-zinc-900/50">
                <th className="p-3">Xem trước</th>
                <th className="p-3">Bài viết / Tóm tắt</th>
                <th className="p-3">Thẻ tags</th>
                <th className="p-3">Tác giả</th>
                <th className="p-3">Ngày đăng</th>
                <th className="p-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {blogs.map((b) => (
                <tr key={b.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="p-3 max-w-[120px]">
                    <img src={b.thumbnail} alt={b.title} className="w-16 h-10 object-cover rounded border border-border bg-zinc-900 shrink-0" />
                  </td>
                  <td className="p-3">
                    <p className="font-bold text-foreground line-clamp-1">{b.title}</p>
                    <p className="text-[10px] text-foreground-muted line-clamp-1 max-w-sm">{b.summary}</p>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {b.tags.map((t) => (
                        <span key={t} className="text-[9px] font-semibold px-1.5 py-0.5 bg-zinc-900 border border-border/80 text-foreground-muted rounded-sm">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-foreground-muted">{b.authorName}</td>
                  <td className="p-3 text-foreground-muted font-semibold">
                    {new Date(b.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="p-3 text-right space-x-2 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(b)}
                      className="p-1.5 bg-zinc-900 border border-border text-foreground hover:text-accent rounded hover:border-accent transition-all cursor-pointer inline-flex"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id, b.title)}
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

      {/* BLOG CRUD MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModalOpen(false)} />
          <div className="relative bg-background border border-border rounded-custom shadow-2xl w-full max-w-xl z-10 p-6 flex flex-col justify-between">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-foreground-muted hover:text-foreground"
            >
              <X size={16} />
            </button>
            <h3 className="text-sm font-black uppercase text-foreground mb-4 border-b border-border pb-2">
              {editingBlog ? `Sửa Bài Viết #${editingBlog.id}` : 'Viết bài viết mới'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-foreground-muted">Tiêu đề bài viết</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-3 outline-none focus:border-accent text-foreground font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-foreground-muted">Ảnh bìa (Thumbnail URL)</label>
                  <input
                    type="text"
                    required
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-3 outline-none focus:border-accent text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-foreground-muted">Thẻ tags (Ngăn cách bằng dấu phẩy)</label>
                  <input
                    type="text"
                    required
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-3 outline-none focus:border-accent text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-foreground-muted">Tóm tắt ngắn (Summary)</label>
                <input
                  type="text"
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full h-9 bg-zinc-900 border border-border rounded-custom px-3 outline-none focus:border-accent text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-foreground-muted">Nội dung bài viết (Hỗ trợ HTML)</label>
                <textarea
                  required
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-zinc-900 border border-border rounded-custom p-3 text-xs outline-none focus:border-accent text-foreground font-mono resize-none"
                />
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
                  <Check size={14} /> Đăng Bài Viết
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
