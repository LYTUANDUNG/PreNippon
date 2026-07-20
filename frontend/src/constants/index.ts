export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,
  CART: '/cart',
  WISHLIST: '/wishlist',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_TRACK: (code: string) => `/orders/track/${code}`,
  BLOGS: '/blogs',
  BLOG_DETAIL: (slug: string) => `/blogs/${slug}`,
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    PRODUCTS: '/admin/products',
    CAMPAIGNS: '/admin/campaigns',
    ORDERS: '/admin/orders',
    USERS: '/admin/users',
    BANNERS: '/admin/banners',
    BLOGS: '/admin/blogs',
  }
};

export const PRODUCT_STATUS = {
  AVAILABLE: 'AVAILABLE',
  PREORDER: 'PREORDER',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  DISABLED: 'DISABLED',
};

export const PRODUCT_STATUS_TEXT: Record<string, string> = {
  AVAILABLE: 'Có sẵn',
  PREORDER: 'Pre-order',
  OUT_OF_STOCK: 'Hết hàng',
  DISABLED: 'Ngừng kinh doanh',
};

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  DEPOSIT_PAID: 'DEPOSIT_PAID',
  ORDERED: 'ORDERED',
  SHIPPING: 'SHIPPING',
  ARRIVED: 'ARRIVED',
  READY: 'READY',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
};

export const ORDER_STATUS_TEXT: Record<string, string> = {
  PENDING: 'Chờ thanh toán cọc',
  DEPOSIT_PAID: 'Đã đặt cọc',
  ORDERED: 'Đã chốt đơn hãng',
  SHIPPING: 'Đang vận chuyển',
  ARRIVED: 'Đã về kho VN',
  READY: 'Sẵn sàng giao hàng',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
  REFUNDED: 'Đã hoàn tiền',
};

export const ORDER_STATUS_COLOR: Record<string, string> = {
  PENDING: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  DEPOSIT_PAID: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  ORDERED: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  SHIPPING: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  ARRIVED: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  READY: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
  COMPLETED: 'text-green-500 bg-green-500/10 border-green-500/20',
  CANCELLED: 'text-red-500 bg-red-500/10 border-red-500/20',
  REFUNDED: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
};

// Preorder progress stages for tracking
export const PREORDER_TIMELINE_STAGES = [
  { stage: 'DEPOSIT_PAID', label: 'Đã đặt cọc', desc: 'Đã nhận khoản thanh toán đặt cọc 30%' },
  { stage: 'ORDERED_BRAND', label: 'Đã chốt đơn', desc: 'Shop đã chốt số lượng đặt hàng với nhà sản xuất/phân phối' },
  { stage: 'SHIPPING_VN', label: 'Đang nhập hàng', desc: 'Hàng bắt đầu vận chuyển từ Nhật Bản/Hãng về Việt Nam' },
  { stage: 'CUSTOMS', label: 'Đang thông quan', desc: 'Hàng đang được làm thủ tục hải quan tại cảng' },
  { stage: 'ARRIVED', label: 'Đã về kho', desc: 'Đã kiểm kho tại Việt Nam, sẵn sàng soạn đơn' },
  { stage: 'DELIVERING', label: 'Đang giao', desc: 'Đơn hàng đang trên đường vận chuyển tới địa chỉ nhận' },
  { stage: 'COMPLETED', label: 'Hoàn thành', desc: 'Giao hàng thành công và tất toán phần thanh toán còn lại' },
];

export const PAYMENT_METHODS = {
  VNPAY: 'VNPAY',
  MOMO: 'MOMO',
  ZALOPAY: 'ZALOPAY',
  COD: 'COD',
};

export const PAYMENT_METHODS_TEXT: Record<string, string> = {
  VNPAY: 'Cổng thanh toán VNPay',
  MOMO: 'Ví điện tử MoMo',
  ZALOPAY: 'Ví ZaloPay',
  COD: 'Thanh toán COD khi nhận hàng (Phần còn lại)',
};

export const USER_TIERS = {
  SILVER: 'SILVER',
  GOLD: 'GOLD',
  PLATINUM: 'PLATINUM',
  DIAMOND: 'DIAMOND',
};

export const USER_TIER_TEXT: Record<string, string> = {
  SILVER: 'Thành viên Bạc',
  GOLD: 'Thành viên Vàng',
  PLATINUM: 'Thành viên Bạch Kim',
  DIAMOND: 'Thành viên Kim Cương',
};

export const USER_TIER_COLOR: Record<string, string> = {
  SILVER: 'text-slate-400 border-slate-500/30 bg-slate-500/5',
  GOLD: 'text-amber-400 border-amber-500/30 bg-amber-500/5',
  PLATINUM: 'text-sky-300 border-sky-400/30 bg-sky-400/5',
  DIAMOND: 'text-red-400 border-red-500/30 bg-red-500/5',
};

export const USER_TIERS_MIN_POINTS = {
  SILVER: 0,
  GOLD: 500,
  PLATINUM: 2000,
  DIAMOND: 5000,
};

// 1 Point = 100 VND discount
export const POINT_TO_VND_RATE = 100;
// Earn 1 Point for every 100,000 VND spent
export const VND_TO_POINT_RATE = 100000;
