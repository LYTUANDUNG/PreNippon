'use client';

import { useBlogs } from '../../../hooks/useBlogs';
import Link from 'next/link';
import { ROUTES } from '../../../constants';
import { Calendar, User, Search, BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function BlogsPage() {
  const { blogs, isLoading } = useBlogs();
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');

  // Collect unique tags
  const allTags = Array.from(new Set(blogs.flatMap((b) => b.tags)));

  const filteredBlogs = blogs.filter((blog) => {
    const matchSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.summary.toLowerCase().includes(search.toLowerCase());
    
    const matchTag = activeTag ? blog.tags.includes(activeTag) : true;

    return matchSearch && matchTag;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="text-left">
          <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
            <BookOpen size={24} className="text-accent" /> Tin Tức & Blog Mô Hình
          </h1>
          <p className="text-xs text-foreground-muted">Kiến thức sưu tầm figure, review sản phẩm và hướng dẫn chi tiết cho Otaku</p>
        </div>
        
        {/* Search bar */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 bg-background-card border border-border text-foreground rounded-custom px-3 pr-8 text-xs font-semibold placeholder:text-foreground-muted outline-none focus:border-accent"
          />
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
        </div>
      </div>

      {/* Tags Filter Row */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs justify-start border-b border-border/40 pb-4">
          <button
            onClick={() => setActiveTag('')}
            className={`px-3.5 py-1 border rounded-full font-bold uppercase tracking-wider text-[10px] ${
              !activeTag ? 'border-accent bg-accent text-white' : 'border-border text-foreground-muted bg-zinc-950/20'
            }`}
          >
            Tất cả thẻ
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3.5 py-1 border rounded-full font-bold uppercase tracking-wider text-[10px] ${
                activeTag === tag ? 'border-accent bg-accent text-white' : 'border-border text-foreground-muted bg-zinc-950/20'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Blog Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[16/10] bg-background-card animate-pulse border border-border rounded-custom" />
          ))}
        </div>
      ) : filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <Link
              key={blog.id}
              href={ROUTES.BLOG_DETAIL(blog.slug)}
              className="group bg-background-card border border-border hover:border-accent/40 rounded-custom overflow-hidden transition-all duration-300 flex flex-col h-full hover:shadow-lg"
            >
              <div className="aspect-[16/9] w-full overflow-hidden bg-zinc-900 border-b border-border relative">
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2 z-10 flex gap-1">
                  {blog.tags.slice(0, 2).map((t, idx) => (
                    <span key={idx} className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-zinc-950 text-foreground border border-border rounded-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="p-4 flex-grow flex flex-col justify-between gap-3 text-left">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground line-clamp-2 group-hover:text-accent transition-colors leading-snug">
                    {blog.title}
                  </h3>
                  <p className="text-[11px] text-foreground-muted line-clamp-2 leading-relaxed">
                    {blog.summary}
                  </p>
                </div>
                
                <div className="border-t border-border/40 pt-2 flex justify-between items-center text-[10px] text-foreground-muted">
                  <span className="flex items-center gap-1">
                    <User size={10} className="text-accent" /> {blog.authorName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={10} /> {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xs text-foreground-muted">Không tìm thấy bài viết phù hợp với bộ lọc hiện tại.</p>
        </div>
      )}
    </div>
  );
}
