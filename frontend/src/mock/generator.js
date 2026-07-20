const fs = require('fs');
const path = require('path');

// Helper to generate IDs
let productIdCounter = 1;
let userIdCounter = 1;
let orderIdCounter = 1;
let blogIdCounter = 1;
let reviewIdCounter = 1;
let bannerIdCounter = 1;

// Define Base Lists
const categories = [
  { id: 1, name: "Figure", slug: "figure", parentId: null },
  { id: 2, name: "Scale Figure", slug: "scale-figure", parentId: 1 },
  { id: 3, name: "Nendoroid", slug: "nendoroid", parentId: 1 },
  { id: 4, name: "POP UP PARADE", "slug": "pop-up-parade", parentId: 1 },
  { id: 5, name: "Model Kit", slug: "model-kit", parentId: null },
  { id: 6, name: "Merchandise", slug: "merchandise", parentId: null },
  { id: 7, name: "Phụ kiện", slug: "accessories", parentId: null },
  { id: 8, name: "Sale", slug: "sale", parentId: null }
];

const brands = [
  { id: 1, name: "Good Smile Company", slug: "good-smile-company" },
  { id: 2, name: "Kotobukiya", slug: "kotobukiya" },
  { id: 3, name: "Alter", slug: "alter" },
  { id: 4, name: "Bandai Spirits", slug: "bandai-spirits" },
  { id: 5, name: "Max Factory", slug: "max-factory" }
];

const series = [
  { id: 1, name: "One Piece", slug: "one-piece" },
  { id: 2, name: "Naruto Shippuden", slug: "naruto" },
  { id: 3, name: "Hatsune Miku", slug: "hatsune-miku" },
  { id: 4, name: "Jujutsu Kaisen", slug: "jujutsu-kaisen" },
  { id: 5, name: "Demon Slayer", slug: "demon-slayer" },
  { id: 6, name: "Genshin Impact", slug: "genshin-impact" },
  { id: 7, name: "Evangelion", slug: "evangelion" },
  { id: 8, name: "Fate/Grand Order", slug: "fate-grand-order" }
];

// Unsplash high quality anime figure-like or model images
const figureImages = [
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1608889174633-8a3d3c8b4042?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1559893088-c0787ebfc084?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80"
];

// Helper to get random item
const randItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

// Generate 30 Users
const users = [];
const roles = ['ROLE_CUSTOMER', 'ROLE_CUSTOMER', 'ROLE_CUSTOMER', 'ROLE_CUSTOMER', 'ROLE_ADMIN'];
const tiers = ['SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];
const names = [
  "Nguyễn Văn A", "Trần Thị B", "Lê Hoàng C", "Phạm Minh D", "Võ Hoàng E",
  "Nguyễn Thị F", "Hoàng Văn G", "Đỗ Minh H", "Phan Thanh I", "Nguyễn Khắc J",
  "Đặng Ngọc K", "Trịnh Hữu L", "Bùi Thế M", "Lý Hoài N", "Ngô Bảo O",
  "Dương Hồng P", "Trần Vĩnh Q", "Lương Đức R", "Phùng Hải S", "Vũ Hoàng T",
  "Lê Văn U", "Nguyễn Quốc V", "Phạm Xuân W", "Bùi Văn X", "Trần Như Y", "Lê Thanh Z",
  "Admin PreNippon", "Manager Figure", "Tech Lead Morachi", "Tester PreNippon"
];

for (let i = 0; i < 30; i++) {
  const isLastFour = i >= 26;
  const role = isLastFour ? 'ROLE_ADMIN' : 'ROLE_CUSTOMER';
  const tier = isLastFour ? 'SILVER' : randItem(tiers);
  const email = isLastFour 
    ? `admin${i - 25}@prenippon.com`
    : `customer${i + 1}@gmail.com`;

  users.push({
    id: userIdCounter++,
    email: email,
    fullName: names[i],
    phone: `09${randRange(10000000, 99999999)}`,
    role: role,
    status: 'ACTIVE',
    rewardPoints: role === 'ROLE_ADMIN' ? 0 : randRange(0, 6000),
    tier: tier,
    twoFaEnabled: role === 'ROLE_ADMIN',
    addresses: [
      {
        id: i * 2 + 1,
        userId: i + 1,
        recipientName: names[i],
        phoneNumber: `09${randRange(10000000, 99999999)}`,
        street: `${randRange(1, 999)} Đường Láng`,
        ward: "Láng Hạ",
        district: "Đống Đa",
        city: "Hà Nội",
        isDefault: true
      },
      {
        id: i * 2 + 2,
        userId: i + 1,
        recipientName: names[i],
        phoneNumber: `09${randRange(10000000, 99999999)}`,
        street: `${randRange(10, 500)} Nguyễn Trãi`,
        ward: "Thanh Xuân Trung",
        district: "Thanh Xuân",
        city: "Hà Nội",
        isDefault: false
      }
    ],
    createdAt: new Date(Date.now() - randRange(10, 100) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  });
}

// Generate 50 Products
const products = [];
const animeCharacters = {
  "One Piece": ["Monkey D. Luffy", "Roronoa Zoro", "Nami", "Nico Robin", "Trafalgar Law", "Portgas D. Ace"],
  "Naruto Shippuden": ["Uchiha Sasuke", "Uzumaki Naruto", "Hatake Kakashi", "Hyuga Hinata", "Itachi Uchiha"],
  "Hatsune Miku": ["Hatsune Miku", "Megurine Luka", "Kagamine Rin", "Kagamine Len"],
  "Jujutsu Kaisen": ["Gojo Satoru", "Itadori Yuji", "Fushiguro Megumi", "Kugisaki Nobara", "Ryomen Sukuna"],
  "Demon Slayer": ["Kamado Tanjiro", "Kamado Nezuko", "Agatsuma Zenitsu", "Hashibira Inosuke", "Rengoku Kyojuro"],
  "Genshin Impact": ["Raiden Shogun", "Zhongli", "Ganyu", "Hu Tao", "Keqing", "Venti"],
  "Evangelion": ["Ikari Shinji", "Souryu Asuka Langley", "Ayanami Rei", "Mari Illustrious Makinami"],
  "Fate/Grand Order": ["Saber (Artoria Pendragon)", "Jeanne d'Arc", "Mash Kyrielight", "Gilgamesh"]
};

const figureScales = ["1/7", "1/8", "1/6", "Non-scale", "1/4"];
const materials = ["PVC, ABS", "PVC, ABS, POM", "Resin, PVC", "ABS, PVC, Die-cast"];

// Pre-define 50 products metadata to sound very authentic
const productNamesTemplates = [
  { name: "Scale Figure {character} ({series})", catId: 2, scale: "1/7" },
  { name: "Nendoroid {character} ({series})", catId: 3, scale: "Non-scale" },
  { name: "POP UP PARADE {character} ({series})", catId: 4, scale: "Non-scale" },
  { name: "Model Kit MG {character} ({series})", catId: 5, scale: "1/100" },
  { name: "Scale Figure {character} - Neon Ver. ({series})", catId: 2, scale: "1/7" },
  { name: "Acrylic Stand {character} ({series})", catId: 6, scale: "Non-scale" },
  { name: "Keyring & Pins Set {character} ({series})", catId: 6, scale: "Non-scale" },
  { name: "Display Case for {character} Series", catId: 7, scale: "Non-scale" }
];

for (let i = 1; i <= 50; i++) {
  const chosenSeries = randItem(series);
  const character = randItem(animeCharacters[chosenSeries.name]);
  const brand = randItem(brands);
  
  // Pick template
  let template = randItem(productNamesTemplates);
  if (i <= 15) template = productNamesTemplates[0]; // More scale figures
  else if (i <= 30) template = productNamesTemplates[1]; // More Nendoroids
  else if (i <= 40) template = productNamesTemplates[2]; // POP UP PARADE
  
  const name = template.name.replace("{character}", character).replace("{series}", chosenSeries.name);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${i}`;
  const sku = `${brand.slug.substring(0, 3).toUpperCase()}-${chosenSeries.slug.substring(0, 3).toUpperCase()}-${randRange(1000, 9999)}`;
  
  const isPreorder = i % 2 === 0; // 50% preorder, 50% available/sale
  const isSale = !isPreorder && (i % 5 === 0);
  const price = randRange(15, 120) * 50000; // 750k to 6M VND
  
  let status = 'AVAILABLE';
  if (isPreorder) status = 'PREORDER';
  else if (i % 12 === 0) status = 'OUT_OF_STOCK';

  let campaign = null;
  if (isPreorder) {
    const depositPct = randItem([30, 40, 50]);
    const limitQty = randItem([50, 100, 150, 200]);
    const orderedQty = randRange(5, limitQty - 1);
    const depositAmt = (price * depositPct) / 100;
    
    // Dates
    const openDate = new Date(Date.now() - randRange(1, 20) * 24 * 60 * 60 * 1000).toISOString();
    const closeDate = new Date(Date.now() + randRange(5, 30) * 24 * 60 * 60 * 1000).toISOString();
    const releaseOptions = ["Tháng 11/2026", "Tháng 12/2026", "Quý I/2027", "Quý II/2027"];
    
    campaign = {
      id: productIdCounter,
      productId: i,
      openDate: openDate,
      closeDate: closeDate,
      releaseDate: randItem(releaseOptions),
      depositPercentage: depositPct,
      depositAmount: depositAmt,
      limitQuantity: limitQty,
      orderedQuantity: orderedQty,
      status: 'ACTIVE',
      timelines: [
        {
          id: productIdCounter * 2,
          campaignId: productIdCounter,
          stage: 'OPENED',
          notes: 'Mở nhận pre-order chính hãng từ nhà sản xuất. Số lượng giới hạn.',
          updatedAt: openDate
        }
      ]
    };
  }

  // Gallery images (thumbnail + 2 extra images)
  const thumbUrl = figureImages[i % figureImages.length];
  const extraImg1 = figureImages[(i + 1) % figureImages.length];
  const extraImg2 = figureImages[(i + 2) % figureImages.length];

  const productImages = [
    { id: i * 3, productId: i, url: thumbUrl, isThumbnail: true },
    { id: i * 3 + 1, productId: i, url: extraImg1, isThumbnail: false },
    { id: i * 3 + 2, productId: i, url: extraImg2, isThumbnail: false }
  ];

  products.push({
    id: i,
    name: name,
    slug: slug,
    sku: sku,
    barcode: `893${randRange(1000000000, 9999999999)}`,
    category: categories.find(c => c.id === (isSale ? 8 : template.catId)) || categories[0],
    brand: brand,
    series: chosenSeries,
    price: price,
    status: status,
    quantity: isPreorder ? 0 : randRange(1, 20),
    description: `Mô tả chi tiết sản phẩm ${name} chính hãng từ hãng ${brand.name}. Sản phẩm mô phỏng nhân vật ${character} thuộc series nổi tiếng ${chosenSeries.name}. Thiết kế tinh xảo, chất lượng nước sơn cao cấp, sắc nét từng chi tiết nhỏ. Phù hợp trưng bày tủ kính, bàn làm việc hoặc làm bộ sưu tập quà tặng cao cấp.`,
    images: productImages,
    campaign: campaign,
    character: character,
    manufacturer: brand.name,
    releaseDateText: isPreorder ? campaign.releaseDate : "Có sẵn",
    scale: template.scale,
    material: randItem(materials),
    height: `${randRange(10, 45)} cm`,
    seoTitle: `${name} chính hãng giá tốt | PreNippon Store`,
    seoDescription: `Mua sản phẩm ${name} chính hãng ${brand.name} giá hấp dẫn tại PreNippon. Đặt cọc trước nhận giá rẻ nhất. Ship COD toàn quốc.`,
    createdAt: new Date(Date.now() - randRange(30, 200) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  });

  productIdCounter++;
}

// Generate 20 Reviews
const reviews = [];
const comments = [
  "Sản phẩm quá đẹp, nước sơn mịn và sắc sảo đúng chất chính hãng!",
  "Hàng box đẹp không móp méo, shop đóng gói siêu kỹ 3 lớp xốp bong bóng.",
  "Figure sắc nét từng chi tiết, pose dáng ngầu lòi luôn nha.",
  "Đã nhận hàng sau khi hoàn tất thanh toán cọc. Thời gian hàng về đúng hẹn.",
  "Good Smile Company chưa bao giờ làm mình thất vọng, chi tiết khuôn mặt rất có hồn.",
  "Nendoroid cute lạc lối luôn mng ơi, khớp gắn mượt mà dễ thương.",
  "Scale 1/7 to vật vã, trưng bày trung tâm tủ kính hết bài.",
  "Lần đầu pre-order ở shop, tư vấn nhiệt tình, hỗ trợ cập nhật timeline rất rõ.",
  "Hàng cực xịn xò, giá preorder rẻ hơn kha khá so với mua sẵn.",
  "Ủng hộ shop nhiều lần rồi, cực kỳ uy tín!"
];

for (let i = 1; i <= 20; i++) {
  const prod = randItem(products);
  const user = randItem(users.filter(u => u.role === 'ROLE_CUSTOMER'));
  
  reviews.push({
    id: reviewIdCounter++,
    userId: user.id,
    userName: user.fullName,
    userAvatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`,
    productId: prod.id,
    rating: randItem([4, 5, 5, 5, 3]), // skewed high
    comment: randItem(comments),
    imageUrl: i % 4 === 0 ? randItem(figureImages) : undefined,
    status: 'APPROVED',
    createdAt: new Date(Date.now() - randRange(1, 30) * 24 * 60 * 60 * 1000).toISOString()
  });
}

// Attach Reviews to Products list
products.forEach(p => {
  p.reviews = reviews.filter(r => r.productId === p.id);
});

// Generate 10 Banners
const banners = [
  {
    id: 1,
    title: "Morachi Style Premium Figure Store",
    imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=1920&q=80",
    linkUrl: "/products",
    orderIndex: 0,
    isActive: true,
    type: "HERO",
    badgeText: "PRE-ORDER CAMPAIGN",
    buttonText: "Khám Phá Ngay"
  },
  {
    id: 2,
    title: "Nendoroid Wonderland - Đặt trước nhận ưu đãi 10%",
    imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&q=80",
    linkUrl: "/products?category=nendoroid",
    orderIndex: 1,
    isActive: true,
    type: "HERO",
    badgeText: "NEW ARRIVALS",
    buttonText: "Xem Danh Sách"
  },
  {
    id: 3,
    title: "Gundam & Model Kit - Lắp ráp thỏa đam mê",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&q=80",
    linkUrl: "/products?category=model-kit",
    orderIndex: 2,
    isActive: true,
    type: "HERO",
    badgeText: "BANDAI SPIRITS",
    buttonText: "Mua Ngay"
  }
];

// Add 7 more minor promo banners
for (let i = 4; i <= 10; i++) {
  banners.push({
    id: i,
    title: `Chương trình Khuyến mãi Banner phụ ${i}`,
    imageUrl: figureImages[i % figureImages.length],
    linkUrl: "/products?category=sale",
    orderIndex: i,
    isActive: i < 8,
    type: "PROMO"
  });
}

// Generate 20 Blogs
const blogTitles = [
  "Top 10 Figure Đáng Mong Chờ Nhất Cuối Năm 2026",
  "Hướng Dẫn Phân Biệt Figure Real Và Fake Cho Người Mới",
  "Nendoroid Là Gì? Tại Sao Chúng Lại Thu Hút Giới Trẻ Đến Vậy?",
  "Review Chi Tiết Scale Figure Hatsune Miku 1/7 Từ Hãng Alter",
  "Kinh Nghiệm Bảo Quản Figure Anime Không Bị Phai Màu Dưới Ánh Nắng",
  "Lịch Sử Thành Lập Good Smile Company - Đế Chế Nendoroid",
  "POP UP PARADE: Dòng Figure Chất Lượng Cao Giá Bình Dân",
  "Sự Khác Biệt Giữa Scale Figure Và Prize Figure Có Thể Bạn Chưa Biết",
  "Gundam Model Kit: Lịch Trình Phát Hành Gunpla Mới Của Bandai",
  "Cẩm Nang Đặt Pre-order Hàng Nhật Bản An Toàn Và Uy Tín",
  "Hé Lộ Mẫu Thiết Kế Mới Nhất Series Jujutsu Kaisen Của Hãng Kotobukiya",
  "Trưng Bày Figure Đẹp: Thiết Kế Đèn Led Tủ Kính Phù Hợp",
  "One Piece Gear 5 Figure: Những Phiên Bản Đáng Giá Nhất",
  "Tìm Hiểu Về Chất Liệu PVC Và ABS Sử Dụng Trong Chế Tác Đồ Chơi",
  "Anime Figure Exhibition 2026 Tokyo: Tổng Hợp Các Siêu Phẩm",
  "Review Model Kit MG Evangelion Unit-01 Thần Thánh",
  "Top Phụ Kiện Decor Bàn Làm Việc Cực Chất Cho Otaku",
  "Xu Hướng Sưu Tầm Figure Genshin Impact Của Giới Trẻ Việt Nam",
  "Demon Slayer Hashira Figures: Bộ Sưu Tập 9 Trụ Cột Đầy Đủ",
  "Làm Sao Để Sửa Khớp Nendoroid Bị Lỏng? Mẹo Đơn Giản Nhất"
];

const blogs = blogTitles.map((title, idx) => {
  const slug = title.toLowerCase().replace(/[^a-z0-9\s]+/g, '').replace(/\s+/g, '-');
  return {
    id: idx + 1,
    title: title,
    slug: slug,
    summary: `Tóm tắt nội dung bài viết: ${title}. Chia sẻ những thông tin hữu ích về sở thích sưu tầm mô hình chính hãng và văn hóa Anime/Manga.`,
    content: `<p>Đây là bài viết đầy đủ cho <strong>${title}</strong>. Nội dung phân tích chi tiết xu hướng, chất liệu chế tạo, giá cả thị trường và tư vấn đặt hàng tốt nhất tại Việt Nam.</p><p>Sưu tầm figure không chỉ là một thú vui cá nhân mà còn là việc lưu giữ những kỷ niệm đẹp về các nhân vật Anime mà chúng ta hâm mộ. Tại cửa hàng PreNippon, chúng tôi cam kết mang lại trải nghiệm pre-order hàng chính hãng 100% Nhật Bản cực kỳ chuyên nghiệp và tận tâm.</p>`,
    thumbnail: figureImages[idx % figureImages.length],
    tags: ["Figure", "Anime", "Review", "Sưu Tầm"],
    seoTitle: `${title} | Góc Chia Sẻ PreNippon`,
    seoDescription: `Đọc bài viết ${title} trên blog PreNippon Store. Góc kiến thức và review figure anime chính hãng hàng đầu Việt Nam.`,
    authorId: 27, // Admin
    authorName: "Admin PreNippon",
    createdAt: new Date(Date.now() - idx * 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  };
});

// Generate 100 Orders
const orders = [];
const orderStatuses = [
  'PENDING', 'DEPOSIT_PAID', 'ORDERED', 'SHIPPING', 
  'ARRIVED', 'READY', 'COMPLETED', 'CANCELLED', 'REFUNDED'
];

for (let i = 1; i <= 100; i++) {
  const customer = randItem(users.filter(u => u.role === 'ROLE_CUSTOMER'));
  const orderCode = `PRE-${2026}-${String(i).padStart(4, '0')}`;
  
  // Decide how many items (1 to 3)
  const itemsCount = randRange(1, 3);
  const items = [];
  let totalAmount = 0;
  let requiredDeposit = 0;
  
  const chosenProducts = [];
  while (chosenProducts.length < itemsCount) {
    const prod = randItem(products);
    if (!chosenProducts.some(p => p.id === prod.id)) {
      chosenProducts.push(prod);
    }
  }

  chosenProducts.forEach((p, idx) => {
    const qty = randRange(1, 2);
    const price = p.price;
    const isPre = p.status === 'PREORDER';
    const depositAmt = isPre ? (p.campaign ? p.campaign.depositAmount * qty : price * 0.3 * qty) : 0;
    
    items.push({
      id: i * 10 + idx,
      orderId: i,
      productId: p.id,
      quantity: qty,
      price: price,
      depositAmount: depositAmt,
      type: isPre ? 'PREORDER' : 'AVAILABLE'
    });

    totalAmount += price * qty;
    requiredDeposit += depositAmt;
  });

  // Calculate status weighting
  let status = 'COMPLETED';
  if (i <= 10) status = 'PENDING';
  else if (i <= 30) status = 'DEPOSIT_PAID';
  else if (i <= 40) status = 'ORDERED';
  else if (i <= 55) status = 'SHIPPING';
  else if (i <= 65) status = 'ARRIVED';
  else if (i <= 75) status = 'READY';
  else if (i <= 95) status = 'COMPLETED';
  else if (i <= 98) status = 'CANCELLED';
  else status = 'REFUNDED';

  // Calculate payments
  let depositPaid = 0;
  let remainingPaid = 0;
  let paymentStatus = 'UNPAID';
  const payments = [];

  const addPayment = (amt, method, type, payStatus, dateOffset) => {
    payments.push({
      id: payments.length + i * 10,
      orderId: i,
      amount: amt,
      paymentMethod: method,
      paymentType: type,
      transactionId: `TXN${randRange(100000000, 999999999)}`,
      status: payStatus,
      createdAt: new Date(Date.now() - dateOffset * 24 * 60 * 60 * 1000).toISOString()
    });
  };

  const method = randItem(['VNPAY', 'MOMO', 'ZALOPAY', 'COD']);

  if (status !== 'PENDING' && status !== 'CANCELLED') {
    // Deposit payment paid
    if (requiredDeposit > 0) {
      depositPaid = requiredDeposit;
      addPayment(requiredDeposit, method === 'COD' ? 'VNPAY' : method, 'DEPOSIT', 'SUCCESS', 15);
      paymentStatus = 'PARTIALLY_PAID';
    } else {
      depositPaid = 0;
      remainingPaid = totalAmount;
      addPayment(totalAmount, method, 'FULL_PAYMENT', 'SUCCESS', 15);
      paymentStatus = 'FULLY_PAID';
    }
  }

  if (status === 'COMPLETED') {
    if (requiredDeposit > 0) {
      remainingPaid = totalAmount - requiredDeposit;
      addPayment(totalAmount - requiredDeposit, randItem(['COD', 'MOMO', 'VNPAY']), 'REMAINING', 'SUCCESS', 2);
      paymentStatus = 'FULLY_PAID';
    }
  }

  const addr = customer.addresses[0];

  orders.push({
    id: i,
    userId: customer.id,
    orderCode: orderCode,
    totalAmount: totalAmount,
    requiredDeposit: requiredDeposit,
    depositPaid: depositPaid,
    remainingPaid: remainingPaid,
    status: status,
    paymentStatus: paymentStatus,
    recipientName: customer.fullName,
    phoneNumber: customer.phone || addr.phoneNumber,
    shippingAddress: `${addr.street}, Phường ${addr.ward}, Quận ${addr.district}, ${addr.city}`,
    notes: i % 8 === 0 ? "Giao hàng giờ hành chính. Alo trước 15p." : undefined,
    voucherId: undefined,
    voucherCode: undefined,
    rewardPointsUsed: 0,
    rewardPointsEarned: Math.floor(totalAmount / 100000),
    items: items,
    payments: payments,
    createdAt: new Date(Date.now() - randRange(5, 45) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  });
}

// Create Directory if missing
const mockDir = path.join(__dirname);
if (!fs.existsSync(mockDir)){
  fs.mkdirSync(mockDir, { recursive: true });
}

// Write JSON files
fs.writeFileSync(path.join(mockDir, 'users.json'), JSON.stringify(users, null, 2));
fs.writeFileSync(path.join(mockDir, 'products.json'), JSON.stringify(products, null, 2));
fs.writeFileSync(path.join(mockDir, 'reviews.json'), JSON.stringify(reviews, null, 2));
fs.writeFileSync(path.join(mockDir, 'banners.json'), JSON.stringify(banners, null, 2));
fs.writeFileSync(path.join(mockDir, 'blogs.json'), JSON.stringify(blogs, null, 2));
fs.writeFileSync(path.join(mockDir, 'orders.json'), JSON.stringify(orders, null, 2));

console.log("Mock data successfully generated!");
