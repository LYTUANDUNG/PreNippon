'use client';

import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { useToastStore } from '../../../store/toastStore';

export default function ContactPage() {
  const addToast = useToastStore((state) => state.addToast);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !msg) return;

    addToast('Gửi tin nhắn liên hệ thành công! Shop sẽ phản hồi qua Email sớm nhất.', 'success');
    setName('');
    setEmail('');
    setMsg('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-12 text-left">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight">Liên Hệ PreNippon</h1>
        <p className="text-xs text-foreground-muted">Gửi yêu cầu hỗ trợ nhanh hoặc ghé thăm chi nhánh cửa hàng tại Hà Nội & Hồ Chí Minh</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact info details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-background-card border border-border p-5 rounded-custom space-y-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-accent border-b border-border pb-3">Chi tiết thông tin</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-foreground">Trụ sở Hà Nội:</p>
                  <p className="text-foreground-muted">Số 123 Đường Láng, phường Láng Hạ, quận Đống Đa, Hà Nội.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-foreground">Chi nhánh Hồ Chí Minh:</p>
                  <p className="text-foreground-muted">Số 456 Nguyễn Trãi, phường Thanh Xuân Trung, quận 5, TP. Hồ Chí Minh.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={16} className="text-accent shrink-0" />
                <div>
                  <p className="font-bold text-foreground">Hotline hỗ trợ:</p>
                  <p className="text-foreground-muted">1900 xxxx (09:00 - 21:00)</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={16} className="text-accent shrink-0" />
                <div>
                  <p className="font-bold text-foreground">Địa chỉ hòm thư:</p>
                  <p className="text-foreground-muted">contact@prenippon.vn</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="aspect-[4/3] w-full bg-zinc-950 border border-border rounded-custom overflow-hidden relative flex items-center justify-center text-foreground-muted text-[11px] font-bold">
            <span className="animate-pulse">📍 [Bản đồ chỉ đường Google Maps]</span>
          </div>
        </div>

        {/* Message form feedback */}
        <form onSubmit={handleMessageSubmit} className="lg:col-span-7 bg-background-card border border-border p-6 rounded-custom space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-foreground border-b border-border pb-3">Gửi tin nhắn trực tiếp</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-foreground-muted">Tên của bạn</label>
              <input
                type="text"
                required
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 bg-zinc-900 border border-border rounded-custom px-3 text-xs outline-none focus:border-accent text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-foreground-muted">Địa chỉ Email</label>
              <input
                type="email"
                required
                placeholder="A@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 bg-zinc-900 border border-border rounded-custom px-3 text-xs outline-none focus:border-accent text-foreground"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] uppercase font-bold text-foreground-muted">Nội dung tin nhắn</label>
              <textarea
                required
                rows={5}
                placeholder="Gõ thắc mắc của bạn cần shop hỗ trợ tư vấn..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="w-full bg-zinc-900 border border-border rounded-custom p-3 text-xs outline-none focus:border-accent text-foreground resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="h-10 bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider px-6 rounded-custom flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
          >
            <Send size={14} /> Gửi tin nhắn đi
          </button>
        </form>
      </div>
    </div>
  );
}
