'use client';

import Link from 'next/link';
import { ROUTES } from '../constants';
import { Mail, Phone, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background-card border-t border-border text-foreground-muted text-xs pt-12 pb-6 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
        
        {/* Col 1: Brand details */}
        <div className="md:col-span-4 space-y-4">
          <Link href={ROUTES.HOME} className="flex items-center gap-1">
            <span className="text-lg font-black text-foreground tracking-tighter">
              PRE<span className="text-accent">NIPPON</span>
            </span>
          </Link>
          <p className="leading-relaxed">
            Hệ thống đặt hàng trước (Pre-order) mỹ phẩm cao cấp nhập khẩu chính hãng từ Nhật Bản, Hàn Quốc, Pháp & Mỹ. Cam kết hàng chuẩn Auth 100%, bảo hiểm vận chuyển hàng hóa, đền bù x10 nếu phát hiện hàng nhái.
          </p>
          <div className="space-y-2 pt-2">
            <p className="flex items-center gap-2 text-foreground">
              <Phone size={14} className="text-accent" />
              <span className="font-bold">Hotline: 1900 xxxx (09:00 - 21:00)</span>
            </p>
            <p className="flex items-center gap-2 text-foreground">
              <Mail size={14} className="text-accent" />
              <span className="font-bold">support@prenippon.vn</span>
            </p>
          </div>
        </div>

        {/* Col 2: Policy anchors */}
        <div className="md:col-span-3 md:col-start-6 space-y-3">
          <h4 className="text-[10px] font-black uppercase text-foreground tracking-widest">
            Chính sách cửa hàng
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href={ROUTES.FAQ} className="hover:text-accent transition-colors flex items-center gap-1.5">
                <ShieldCheck size={12} />
                Chính sách cọc 30% - 50%
              </Link>
            </li>
            <li>
              <Link href={ROUTES.FAQ} className="hover:text-accent transition-colors flex items-center gap-1.5">
                <Truck size={12} />
                Vận chuyển quốc tế nhập khẩu
              </Link>
            </li>
            <li>
              <Link href={ROUTES.FAQ} className="hover:text-accent transition-colors flex items-center gap-1.5">
                <RefreshCw size={12} />
                Đổi trả do lỗi nhà sản xuất
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Navigation anchors */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-[10px] font-black uppercase text-foreground tracking-widest">
            Khám phá
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href={ROUTES.ABOUT} className="hover:text-accent transition-colors">
                Cam kết Auth & Nguồn gốc xuất xứ
              </Link>
            </li>
            <li>
              <Link href={ROUTES.BLOGS} className="hover:text-accent transition-colors">
                Cẩm nang làm đẹp & Tin tức Mỹ phẩm
              </Link>
            </li>
            <li>
              <Link href={ROUTES.CONTACT} className="hover:text-accent transition-colors">
                Liên hệ & Hệ thống địa chỉ
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Social links & Copyright */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-foreground-muted">
          &copy; {new Date().getFullYear()} PreNippon Premium Cosmetics. Inspired by Morachi layout. Built for demo presentation.
        </p>
        <div className="flex gap-4">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-foreground-muted hover:text-accent transition-colors" title="Facebook">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H7v3h2v9h3v-9h2.72L15 8h-3V6.5a1 1 0 0 1 1-1h2V2h-3a4 4 0 0 0-4 4z"/></svg>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-foreground-muted hover:text-accent transition-colors" title="YouTube">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.5 6.8c-.2-1.3-1.2-2.3-2.5-2.5C18.8 4 12 4 12 4s-6.8 0-9 .3c-1.3.2-2.3 1.2-2.5 2.5C.2 9 0 12 0 12s0 3 .3 5.2c.2 1.3 1.2 2.3 2.5 2.5 2.2.3 9 .3 9 .3s6.8 0 9-.3c1.3-.2 2.3-1.2 2.5-2.5.3-2.2.3-5.2.3-5.2s0-3-.3-5.2zm-13.8 8.1V9.1l5.8 2.9-5.8 2.9z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
