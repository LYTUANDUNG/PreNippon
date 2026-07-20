'use client';

import { CheckCircle, Trophy, Handshake, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 text-left">
      {/* Header Title */}
      <div className="space-y-4 text-center">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
          Về Chúng Tôi
        </h1>
        <p className="text-sm text-foreground-muted max-w-xl mx-auto leading-relaxed">
          PreNippon Store là đơn vị uy tín hàng đầu cung cấp giải pháp gom mua, đặt hàng trước (Pre-order) các dòng mỹ phẩm chăm sóc da và trang điểm cao cấp nhập khẩu chính hãng.
        </p>
      </div>

      {/* Main Image */}
      <div className="aspect-[21/9] w-full overflow-hidden border border-border rounded-custom bg-background-card-hover">
        <img
          src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1200&q=80"
          alt="Premium Cosmetics display"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Grid Content: Commitment and History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div className="space-y-3">
          <h3 className="text-lg font-black uppercase text-accent tracking-wider flex items-center gap-2">
            <Trophy size={20} /> Tầm Nhìn & Sứ Mệnh
          </h3>
          <p className="text-xs text-foreground-muted leading-relaxed">
            Thành lập năm 2026, PreNippon ra đời nhằm giải quyết bài toán tiếp cận nguồn mỹ phẩm xách tay và nhập khẩu cao cấp trực tiếp từ các thương hiệu lớn toàn cầu. Sứ mệnh của chúng tôi là mang những sản phẩm làm đẹp an toàn, chất lượng vượt trội đến tay người tiêu dùng Việt Nam với chi phí tối ưu, quy trình đặt trước minh bạch và chính sách cam kết hàng thật tuyệt đối.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-black uppercase text-accent tracking-wider flex items-center gap-2">
            <Handshake size={20} /> Cam kết cốt lõi
          </h3>
          <ul className="space-y-2.5 text-xs text-foreground-muted">
            <li className="flex items-start gap-2">
              <CheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" />
              <span><strong>100% Authentic:</strong> Cam kết hoàn tiền gấp 10 lần giá trị hóa đơn nếu phát hiện sản phẩm giả mạo, tráo đổi seal.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" />
              <span><strong>Đóng gói hoàn hảo:</strong> Quy cách bọc quấn 3 lớp xốp bong bóng dày dặn chống va đập, bảo đảm mỹ phẩm còn nguyên hộp, không móp méo chảy đổ.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" />
              <span><strong>Hỗ trợ cọc linh hoạt:</strong> Chỉ thu cọc từ 30% khi đặt trước, cam kết cập nhật lộ trình ship Nhật-Hàn-Việt minh bạch.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive values */}
      <div className="bg-background-card border border-border p-6 rounded-custom grid grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <Sparkles size={24} className="text-accent mx-auto animate-pulse-glow" />
          <h4 className="text-lg font-black text-foreground">10,000+</h4>
          <p className="text-[10px] text-foreground-muted uppercase font-semibold">Sản Phẩm Đã Giao</p>
        </div>
        <div className="space-y-1">
          <Trophy size={24} className="text-accent mx-auto animate-pulse-glow" />
          <h4 className="text-lg font-black text-foreground">99.8%</h4>
          <p className="text-[10px] text-foreground-muted uppercase font-semibold">Hài Lòng Quy Cách</p>
        </div>
        <div className="space-y-1">
          <Handshake size={24} className="text-accent mx-auto animate-pulse-glow" />
          <h4 className="text-lg font-black text-foreground">5,000+</h4>
          <p className="text-[10px] text-foreground-muted uppercase font-semibold">Thành Viên Active</p>
        </div>
      </div>
    </div>
  );
}
