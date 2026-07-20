'use client';

import { Sparkles, Trophy, CheckCircle, Handshake } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-12 text-left">
      
      {/* Hero Header */}
      <div className="space-y-4 text-center">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
          Về Chúng Tôi
        </h1>
        <p className="text-sm text-foreground-muted max-w-xl mx-auto leading-relaxed">
          PreNippon Figure Store là điểm đến hàng đầu tại Việt Nam cho những người đam mê mô hình anime, scale figures và collectibles chính hãng từ Nhật Bản.
        </p>
      </div>

      {/* Main Image */}
      <div className="aspect-[21/9] w-full overflow-hidden border border-border rounded-custom bg-zinc-900">
        <img
          src="https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&q=80"
          alt="Figure collection display"
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
            Thành lập năm 2026, PreNippon ra đời từ niềm đam mê tột cùng đối với văn hóa ACG Nhật Bản. Sứ mệnh của chúng tôi là xóa nhòa ranh giới địa lý, mang những tác phẩm nghệ thuật nhựa tinh xảo từ các điêu khắc gia Nhật Bản đến tận tay giới sưu tầm Việt Nam với chi phí tối ưu và dịch vụ an toàn nhất.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-black uppercase text-accent tracking-wider flex items-center gap-2">
            <Handshake size={20} /> Cam kết cốt lõi
          </h3>
          <ul className="space-y-2.5 text-xs text-foreground-muted">
            <li className="flex items-start gap-2">
              <CheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" />
              <span><strong>100% Authentic:</strong> Đền bù gấp 10 lần giá trị hóa đơn nếu phát hiện sản phẩm giả mạo, tráo đổi hộp.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" />
              <span><strong>Hộp đẹp hoàn hảo:</strong> Quy cách đóng gói 3 lớp bóng xốp khí gia cố góc, đảm bảo box figure còn nguyên vẹn khi thông quan.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" />
              <span><strong>Tất toán an toàn:</strong> Chỉ thu cọc 30% khi đặt trước, cam kết hoàn tiền 100% nếu hãng trễ hẹn giao hàng quá 6 tháng.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive values */}
      <div className="bg-background-card border border-border p-6 rounded-custom grid grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <Sparkles size={24} className="text-accent mx-auto animate-pulse-glow" />
          <h4 className="text-lg font-black text-foreground">10,000+</h4>
          <p className="text-[10px] text-foreground-muted uppercase font-semibold">Figure Đã Giao</p>
        </div>
        <div className="space-y-1">
          <Trophy size={24} className="text-accent mx-auto animate-pulse-glow" />
          <h4 className="text-lg font-black text-foreground">99.8%</h4>
          <p className="text-[10px] text-foreground-muted uppercase font-semibold">Hài Lòng Về Box</p>
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
