'use client';

import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function FAQPage() {
  const faqs = [
    {
      q: "Pre-order mỹ phẩm là gì? Khác gì so với mua sẵn?",
      a: "Pre-order mỹ phẩm là hình thức gom đặt mua trước các dòng sản phẩm dưỡng da, trang điểm hoặc các set quà tặng đặc biệt trực tiếp từ nước ngoài. Việc đặt trước giúp bạn chắc chắn sở hữu sản phẩm mong muốn với mức giá ưu đãi hơn nhiều (tiết kiệm 10% - 20%) so với khi chờ sản phẩm có sẵn tại thị trường tự do."
    },
    {
      q: "Số tiền đặt cọc 30% được tính như thế nào?",
      a: "Tiền cọc được tính bằng 30% giá bán chính thức của sản phẩm. Số tiền này được shop sử dụng làm quỹ đặt mua hàng giữ chỗ từ hãng sản xuất nước ngoài. Vì vậy, số tiền cọc này sẽ không được hoàn trả nếu quý khách tự ý hủy đơn vì lý do cá nhân."
    },
    {
      q: "Khi hàng về Việt Nam, làm sao tôi biết để thanh toán nốt?",
      a: "Ngay khi hàng về đến kho Việt Nam của PreNippon, trạng thái đơn hàng của bạn sẽ chuyển sang 'READY' (Sẵn sàng giao). Đồng thời hệ thống sẽ gửi Email thông báo tự động. Quý khách vào phần 'Đơn hàng của tôi', click 'Thanh toán nốt' và chọn COD hoặc chuyển khoản MoMo/VNPay."
    },
    {
      q: "Chai lọ và hộp mỹ phẩm có được đảm bảo còn nguyên vẹn không móp méo?",
      a: "PreNippon tự hào có quy chuẩn đóng gói chuyên nghiệp. Tất cả sản phẩm mỹ phẩm đều được quấn 3 lớp chống sốc bọt khí dày dặn và đựng trong hộp carton cứng cáp. Chúng tôi bảo hiểm 100% rủi ro bể vỡ, móp méo nghiêm trọng do vận chuyển."
    },
    {
      q: "Shop có hỗ trợ ship COD toàn quốc phần còn lại không?",
      a: "Có. Quý khách hoàn toàn có thể lựa chọn hình thức thanh toán COD (thanh toán tiền mặt cho shipper khi nhận hàng) cho phần số dư còn lại của đơn hàng preorder."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 text-left">
      <div className="text-center space-y-3">
        <div className="p-3 bg-accent/10 rounded-full text-accent w-14 h-14 flex items-center justify-center mx-auto">
          <HelpCircle size={28} />
        </div>
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight">Câu Hỏi Thường Gặp (FAQ)</h1>
        <p className="text-xs text-foreground-muted">Giải đáp các thắc mắc về chính sách đặt cọc, vận chuyển Nhật-Việt và chính sách đổi trả</p>
      </div>

      {/* Accordions */}
      <div className="border border-border rounded-custom divide-y divide-border overflow-hidden bg-background-card/40">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="transition-all duration-200">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 flex justify-between items-center text-xs font-bold text-foreground hover:bg-zinc-950/40 text-left transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown size={14} className={`text-foreground-muted transition-transform duration-200 ${isOpen ? 'rotate-180 text-accent' : ''}`} />
              </button>
              {isOpen && (
                <div className="p-4 bg-zinc-950/20 text-xs text-foreground-muted border-t border-border/30 leading-relaxed animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
