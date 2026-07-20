'use client';

import { useParams } from 'next/navigation';
import { useBlog, useBlogs } from '../../../../hooks/useBlogs';
import EmptyState from '../../../../components/EmptyState';
import Link from 'next/link';
import { ROUTES } from '../../../../constants';
import { useToastStore } from '../../../../store/toastStore';
import { Calendar, User, ArrowLeft, Share2, MessageCircle } from 'lucide-react';

export default function BlogDetailPage() {
  const { slug } = useParams() as { slug: string };
  const { blog, isLoading } = useBlog(slug);
  const { blogs } = useBlogs();
  const addToast = useToastStore((state) => state.addToast);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-foreground-muted">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-wider">Đang tải bài viết...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="py-16">
        <EmptyState
          title="Không tìm thấy bài viết!"
          message="Bài viết bạn yêu cầu không tồn tại hoặc đã bị xóa."
          buttonText="Xem danh mục tin tức"
          linkUrl="/blogs"
        />
      </div>
    );
  }

  const handleShareFacebook = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      addToast('Đã copy đường dẫn bài viết! Sẵn sàng chia sẻ lên Facebook.', 'success');
    }
  };

  const otherBlogs = blogs.filter((b) => b.id !== blog.id).slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
      
      {/* 1. Back link and Main Content (Left) */}
      <main className="lg:col-span-8 space-y-6">
        <Link
          href={ROUTES.BLOGS}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground-muted hover:text-accent transition-colors uppercase tracking-wider mb-2"
        >
          <ArrowLeft size={14} /> Quay lại danh sách tin
        </Link>

        {/* Thumbnail */}
        <div className="aspect-[21/9] w-full overflow-hidden border border-border rounded-custom bg-zinc-900 relative">
          <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover" />
        </div>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-foreground-muted pb-3 border-b border-border/40">
          <span className="flex items-center gap-1">
            <User size={12} className="text-accent" /> Đăng bởi: <strong className="text-foreground">{blog.authorName}</strong>
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
          </span>
          <div className="flex gap-1">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-zinc-950 border border-border text-foreground rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-4xl font-black text-foreground uppercase tracking-tight leading-tight pt-2">
          {blog.title}
        </h1>

        {/* Body HTML content */}
        <article className="prose prose-invert max-w-none text-xs leading-relaxed text-foreground-muted space-y-4 pt-4 border-b border-border/40 pb-8">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </article>

        {/* Social Share action row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Share2 size={14} className="text-accent" /> Chia sẻ bài viết này
          </span>
          <div className="flex gap-2.5">
            <button
              onClick={handleShareFacebook}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold uppercase transition-colors duration-150"
            >
              <svg className="w-3.5 h-3.5 fill-current mr-1" viewBox="0 0 24 24"><path d="M9 8H7v3h2v9h3v-9h2.72L15 8h-3V6.5a1 1 0 0 1 1-1h2V2h-3a4 4 0 0 0-4 4z"/></svg> Facebook
            </button>
            <button
              onClick={handleShareFacebook}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold uppercase transition-colors duration-150"
            >
              <MessageCircle size={13} /> Sao chép link
            </button>
          </div>
        </div>
      </main>

      {/* 2. Sidebar other news (Right) */}
      <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
        <div className="bg-background-card border border-border p-5 rounded-custom space-y-4">
          <h3 className="text-xs font-black uppercase text-foreground border-b border-border pb-3 tracking-widest">
            Bài viết nổi bật khác
          </h3>

          <div className="flex flex-col gap-4">
            {otherBlogs.map((b) => (
              <Link
                key={b.id}
                href={ROUTES.BLOG_DETAIL(b.slug)}
                className="group flex gap-3 items-center border-b border-border/30 pb-3 last:border-0 last:pb-0"
              >
                <img
                  src={b.thumbnail}
                  alt={b.title}
                  className="w-16 h-12 object-cover rounded border border-border bg-zinc-900 shrink-0 group-hover:border-accent/40"
                />
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                    {b.title}
                  </h4>
                  <span className="text-[9px] text-foreground-muted font-semibold mt-1 block">
                    {new Date(b.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </aside>

    </div>
  );
}
