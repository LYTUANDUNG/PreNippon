const fs = require('fs');
const path = require('path');

// Helper to generate IDs
let productIdCounter = 1;
let userIdCounter = 1;
let orderIdCounter = 1;
let blogIdCounter = 1;
let reviewIdCounter = 1;
let bannerIdCounter = 1;

// 1. Define Cosmetics Categories
const categories = [
  { id: 1, name: "Skincare", slug: "skincare", parentId: null },
  { id: 2, name: "Makeup", slug: "makeup", parentId: null },
  { id: 3, name: "Serum & Tinh chất", slug: "serum", parentId: 1 },
  { id: 4, name: "Kem Dưỡng", slug: "kem-duong", parentId: 1 },
  { id: 5, name: "Kem Chống Nắng", slug: "kem-chong-nang", parentId: 1 },
  { id: 6, name: "Toner & Nước hoa hồng", slug: "toner", parentId: 1 },
  { id: 7, name: "Sữa Rửa Mặt", slug: "sua-rua-mat", parentId: 1 },
  { id: 8, name: "Son Môi", slug: "son-moi", parentId: 2 },
  { id: 9, name: "Cushion & Kem nền", slug: "cushion", parentId: 2 },
  { id: 10, name: "Nước Tẩy Trang", slug: "nuoc-tay-trang", parentId: 1 },
  { id: 11, name: "Chăm sóc tóc", slug: "cham-soc-toc", parentId: null },
  { id: 12, name: "Chăm sóc cơ thể", slug: "cham-soc-co-the", parentId: null },
  { id: 13, name: "Sale", slug: "sale", parentId: null }
];

// 2. Define High-end Cosmetics Brands
const brands = [
  { id: 1, name: "SK-II", slug: "sk-ii" },
  { id: 2, name: "Shiseido", slug: "shiseido" },
  { id: 3, name: "Anua", slug: "anua" },
  { id: 4, name: "Round Lab", slug: "round-lab" },
  { id: 5, name: "Torriden", slug: "torriden" },
  { id: 6, name: "La Roche-Posay", slug: "la-roche-posay" },
  { id: 7, name: "Bioderma", slug: "bioderma" },
  { id: 8, name: "CeraVe", slug: "cerave" },
  { id: 9, name: "COSRX", slug: "cosrx" },
  { id: 10, name: "Hada Labo", slug: "hada-labo" },
  { id: 11, name: "Laneige", slug: "laneige" },
  { id: 12, name: "Kiehl's", slug: "kiehls" }
];

// 3. Define Cosmetics Collections / Lines (instead of figures series)
const series = [
  { id: 1, name: "Dưỡng Sáng Độc Quyền (Brightening)", slug: "brightening-line" },
  { id: 2, name: "Cấp Ẩm Phục Hồi Sâu (Hydrating & Barrier)", slug: "hydrating-barrier-line" },
  { id: 3, name: "Làm Dịu Da Ngừa Mụn (Acne Soothing)", slug: "acne-soothing-line" },
  { id: 4, name: "Chống Lão Hóa Trẻ Hóa (Advanced Anti-Aging)", slug: "anti-aging-line" },
  { id: 5, name: "Chống Nắng Phổ Rộng (Broad Spectrum)", slug: "broad-spectrum-line" },
  { id: 6, name: "Làm Sạch Dịu Nhẹ (Gentle Cleansing)", slug: "gentle-cleansing-line" }
];

// Unsplash premium high resolution cosmetics, skincare, and makeup images
const cosmeticsImages = [
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1617897903246-719242758050?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1601612620969-983dc1551a0c?w=800&auto=format&fit=crop&q=80"
];

// Helper to get random items
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
  "Admin PreNippon", "Manager Cosmetics", "Consultant Lead", "Tester PreNippon"
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

// Cosmetics Specifics
const activeIngredients = [
  "Niacinamide 10%, Zinc PCA 1%",
  "Retinol tinh khiết 0.5%, Ceramide NP",
  "Salicylic Acid (BHA) 2%, Tea Tree Oil",
  "Hyaluronic Acid đa tầng, Vitamin B5 (Panthenol)",
  "Centella Asiatica (Rau má) 95%",
  "Galactomyces Ferment Filtrate (Pitera độc quyền)",
  "Vitamin C nguyên chất 15%, Ferulic Acid",
  "Peptides phức hợp, Squalane tự nhiên",
  "Lactobionic Acid (PHA), Gluconolactone"
];

const skinTypes = [
  "Mọi loại da, kể cả da nhạy cảm",
  "Da dầu mụn, lỗ chân lông to",
  "Da khô thiếu nước, bong tróc",
  "Da hỗn hợp thiên dầu",
  "Da nhạy cảm dễ kích ứng",
  "Da lão hóa, nếp nhăn và xỉn màu"
];

const skinConcerns = {
  "Dưỡng Sáng Độc Quyền (Brightening)": "Làm dưỡng sáng da, mờ thâm nám, giúp đều màu da, nâng tông nhẹ tự nhiên.",
  "Cấp Ẩm Phục Hồi Sâu (Hydrating & Barrier)": "Cấp ẩm tầng sâu tức thì, phục hồi hàng rào bảo vệ da bị tổn thương.",
  "Làm Dịu Da Ngừa Mụn (Acne Soothing)": "Giảm sưng viêm mụn hiệu quả, kiềm dầu thừa, thông thoáng lỗ chân lông.",
  "Chống Lão Hóa Trẻ Hóa (Advanced Anti-Aging)": "Cải thiện nếp nhăn li ti, chống oxy hóa mạnh mẽ, trẻ hóa bề mặt da.",
  "Chống Nắng Phổ Rộng (Broad Spectrum)": "Màng lọc UV phổ rộng bảo vệ da toàn diện, kiềm dầu tối đa suốt 12h.",
  "Làm Sạch Dịu Nhẹ (Gentle Cleansing)": "Tẩy trang và làm sạch sâu bụi mịn bã nhờn nhưng không gây khô căng da."
};

const volumeOptions = ["50ml", "100ml", "150ml", "200ml", "30g", "75ml", "120ml", "250ml"];

// Generate 50 Premium Cosmetics Products
const products = [];
const cosmeticProductNames = [
  { prefix: "Serum Tinh Chất Phục Hồi", catId: 3, lineId: 2 },
  { prefix: "Kem Dưỡng Ẩm Chuyên Sâu", catId: 4, lineId: 2 },
  { prefix: "Serum Dưỡng Sáng Mờ Thâm", catId: 3, lineId: 1 },
  { prefix: "Kem Chống Nắng Vật Lý Phổ Rộng", catId: 5, lineId: 5 },
  { prefix: "Toner Cân Bằng Dịu Da", catId: 6, lineId: 3 },
  { prefix: "Sữa Rửa Mặt Sạch Sâu Ngừa Mụn", catId: 7, lineId: 3 },
  { prefix: "Nước Tẩy Trang Sạch Sâu Dịu Nhẹ", catId: 10, lineId: 6 },
  { prefix: "Kem Mắt Trẻ Hóa Xóa Nhăn", catId: 4, lineId: 4 },
  { prefix: "Kem Dưỡng Trắng Hồng Đều Màu", catId: 4, lineId: 1 },
  { prefix: "Cushion Trang Điểm Căng Bóng", catId: 9, lineId: 1 },
  { prefix: "Son Thỏi Siêu Lì Mịn Môi", catId: 8, lineId: 1 }
];

for (let i = 1; i <= 50; i++) {
  const brand = randItem(brands);
  const line = randItem(series);
  
  // Pick a base template
  let template = randItem(cosmeticProductNames);
  if (i <= 10) template = cosmeticProductNames[0]; // More serums
  else if (i <= 20) template = cosmeticProductNames[1]; // More creams
  else if (i <= 30) template = cosmeticProductNames[3]; // More sunscreens
  
  const name = `${template.prefix} ${brand.name} - ${line.name.split(' (')[0]}`;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${i}`;
  const sku = `${brand.slug.substring(0, 3).toUpperCase()}-${line.slug.substring(0, 3).toUpperCase()}-${randRange(100, 999)}`;
  
  const isPreorder = i % 2 === 0;
  const isSale = !isPreorder && (i % 5 === 0);
  const price = randRange(8, 48) * 50000; // 400k to 2.4M VND
  
  let status = 'AVAILABLE';
  if (isPreorder) status = 'PREORDER';
  else if (i % 12 === 0) status = 'OUT_OF_STOCK';

  let campaign = null;
  if (isPreorder) {
    const depositPct = randItem([30, 40, 50]);
    const limitQty = randItem([100, 150, 200, 300]);
    const orderedQty = randRange(10, limitQty - 5);
    const depositAmt = (price * depositPct) / 100;
    
    const openDate = new Date(Date.now() - randRange(2, 18) * 24 * 60 * 60 * 1000).toISOString();
    const closeDate = new Date(Date.now() + randRange(5, 25) * 24 * 60 * 60 * 1000).toISOString();
    const releaseOptions = ["Tháng 10/2026", "Tháng 11/2026", "Quý IV/2026", "Tháng 12/2026"];
    
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
          notes: 'Mở đợt gom đặt hàng preorder xách tay chính hãng giá ưu đãi nhất.',
          updatedAt: openDate
        }
      ]
    };
  }

  // Pick images
  const thumbUrl = cosmeticsImages[i % cosmeticsImages.length];
  const extraImg1 = cosmeticsImages[(i + 1) % cosmeticsImages.length];
  const extraImg2 = cosmeticsImages[(i + 2) % cosmeticsImages.length];

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
    category: categories.find(c => c.id === (isSale ? 13 : template.catId)) || categories[0],
    brand: brand,
    series: line,
    price: price,
    status: status,
    quantity: isPreorder ? 0 : randRange(5, 45),
    description: `Sản phẩm ${name} là dòng mỹ phẩm chính hãng chất lượng cao. Với thành phần hoạt tính chuyên sâu, sản phẩm mang đến hiệu quả rõ rệt sau 4 tuần sử dụng. ${skinConcerns[line.name]} Công thức dịu nhẹ đã được kiểm nghiệm da liễu, không gây bí tắc lỗ chân lông hay kích ứng da. Hoàn hảo để bổ sung vào routine chăm sóc da hàng ngày của bạn.`,
    images: productImages,
    campaign: campaign,
    character: skinConcerns[line.name].split(',')[0], // Mapped to primary target benefit
    manufacturer: brand.name,
    releaseDateText: isPreorder ? campaign.releaseDate : "Có sẵn",
    scale: randItem(volumeOptions), // Mapped to Volume
    material: randItem(activeIngredients), // Mapped to Active Ingredients
    height: randItem(skinTypes), // Mapped to Suitable Skin Types
    seoTitle: `${name} chính hãng nhập khẩu | PreNippon`,
    seoDescription: `Đặt mua ${name} chính hãng cam kết đền gấp 10 lần nếu phát hiện hàng nhái. Pre-order giữ slot giá hời nhất thị trường.`,
    createdAt: new Date(Date.now() - randRange(20, 150) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  });

  productIdCounter++;
}

// Generate 20 Cosmetic Reviews
const reviews = [];
const reviewerNames = [
  "Thanh Hằng", "Khánh Linh", "Bích Phương", "Hương Giang", "Quỳnh Anh",
  "Minh Hằng", "Hà Tăng", "Ngọc Trinh", "Tóc Tiên", "Midu",
  "Anh Tuấn", "Quang Vinh", "Đông Nhi", "Ông Cao Thắng", "Chi Pu"
];
const reviewComments = [
  "Sản phẩm dùng siêu thích, da mình giảm sưng mụn rõ rệt sau 1 tuần. Gom preorder giá hời quá trời luôn!",
  "Đã nhận hàng chuẩn auth, shop đóng gói cực kỳ cẩn thận có bọc xốp bóng khí dày dặn không móp méo hộp.",
  "Tinh chất thấm cực nhanh, không gây bết rít tí nào. Trộm vía da căng bóng khỏe khoắn hơn hẳn.",
  "Serum chân ái của đời mình! Cấp ẩm siêu đỉnh, da mùa đông không hề bị bong tróc khô sần sùi nữa.",
  "Mới đầu hơi sợ vì hàng preorder, nhưng hàng về đúng lịch trình, check mã vạch chuẩn đét nha mọi người.",
  "Chất son siêu lì nhưng mướt môi cực, ăn uống không bị trôi nhiều. Màu lên chuẩn tone xinh xắn lắm.",
  "Cushion đánh lên mỏng nhẹ tự nhiên như da thật, che phủ được 80% khuyết điểm mụn thâm. Đáng mua!",
  "Kem chống nắng kiềm dầu siêu đỉnh, không bị vệt trắng hay bết dính. Sẽ tiếp tục đặt thêm đợt sau."
];

for (let i = 1; i <= 20; i++) {
  reviews.push({
    id: reviewIdCounter++,
    productId: randRange(1, 50),
    reviewerName: randItem(reviewerNames),
    rating: randItem([5, 5, 5, 4, 4]),
    comment: randItem(reviewComments),
    createdAt: new Date(Date.now() - randRange(1, 30) * 24 * 60 * 60 * 1000).toISOString()
  });
}

// Generate 10 Cosmetics Preorder Banners
const banners = [
  {
    id: bannerIdCounter++,
    title: "CHIẾN DỊCH PRE-ORDER MỸ PHẨM CHÍNH HÃNG",
    imageUrl: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1600&q=80",
    linkUrl: "/products?status=PREORDER",
    type: "HERO",
    orderIndex: 0,
    isActive: true,
    badgeText: "PRE-ORDER CAMPAIGN",
    buttonText: "ĐẶT CỌC NGAY"
  },
  {
    id: bannerIdCounter++,
    title: "SK-II PITERA TREATMENT ESSENCE - DƯỠNG SÁNG TRẺ HÓA",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&q=80",
    linkUrl: "/products/serum-tinh-chat-phuc-hoi-sk-ii-duong-sang-doc-quyen-brightening-1",
    type: "HERO",
    orderIndex: 1,
    isActive: true,
    badgeText: "HOT DEAL",
    buttonText: "XEM CHI TIẾT"
  },
  {
    id: bannerIdCounter++,
    title: "KEM CHỐNG NẮNG LA ROCHE-POSAY ANTHELIOS KIỀM DẦU 12H",
    imageUrl: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1600&q=80",
    linkUrl: "/products/kem-chong-nang-vat-ly-pho-rong-la-roche-posay-chong-nang-pho-rong-broad-spectrum-4",
    type: "HERO",
    orderIndex: 2,
    isActive: true,
    badgeText: "BEST SELLER PREORDER",
    buttonText: "ĐẶT CỌC 30%"
  },
  {
    id: bannerIdCounter++,
    title: "FLASH SALE PRE-ORDER: MUA KEM DƯỠNG TẶNG TONER",
    imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&q=80",
    linkUrl: "/products?category=sale",
    type: "PROMO",
    orderIndex: 3,
    isActive: true
  },
  {
    id: bannerIdCounter++,
    title: "Đợt Gom Hàng SK-II & Shiseido Lớn Nhất Năm Kết Thúc Sau:",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1600&q=80",
    linkUrl: "/products?status=PREORDER",
    type: "COUNTDOWN",
    orderIndex: 4,
    isActive: true,
    countdownTarget: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days out
  }
];

// Generate 10 Cosmetics Blogs
const blogs = [
  {
    id: blogIdCounter++,
    title: "5 Bước Skincare Khoa Học Cho Làn Da Dầu Mụn Vào Mùa Hè",
    slug: "5-buoc-skincare-khoa-hoc-cho-lan-da-dau-mun",
    summary: "Hướng dẫn xây dựng routine làm sạch sâu, kiềm dầu thừa hiệu quả từ các hoạt chất BHA, Niacinamide chuyên sâu.",
    content: `<p>Mùa hè là ác mộng của những cô nàng sở hữu làn da dầu mụn. Nhiệt độ tăng cao kích thích tuyến bã nhờn hoạt động mạnh mẽ, dễ gây bí tắc lỗ chân lông. Dưới đây là chu trình dưỡng da chuẩn da liễu:</p>
              <h3>Bước 1: Làm sạch kép (Double Cleansing)</h3>
              <p>Dù không trang điểm, hãy dùng nước tẩy trang dịu nhẹ Bioderma để lấy đi dầu thừa trước khi dùng sữa rửa mặt CeraVe.</p>
              <h3>Bước 2: Nước cân bằng (Toner)</h3>
              <p>Sử dụng Toner Anua Heartleaf 77% để làm dịu các nốt mụn sưng đỏ lập tức.</p>
              <h3>Bước 3: Serum đặc trị mụn</h3>
              <p>Bổ sung Serum COSRX Salicylic Acid 2% giúp gom cồi mụn nhanh chóng.</p>`,
    thumbnail: "https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80",
    tags: ["Skincare", "Da mụn", "Routine"],
    seoTitle: "Routine skincare cho da dầu mụn mùa hè | PreNippon",
    seoDescription: "Xây dựng chu trình dưỡng da ngừa mụn, kiềm dầu hiệu quả từ các chuyên gia da liễu hàng đầu.",
    authorId: 27,
    authorName: "Dược Sĩ Minh Trang",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: blogIdCounter++,
    title: "So Sánh Nước Thần SK-II Facial Treatment Essence vs Các Bản Dupe",
    slug: "so-sanh-nuoc-than-sk-ii-facial-treatment-essence",
    summary: "Đánh giá chi tiết thành phần Pitera độc quyền và hiệu quả chống lão hóa thực sự trên làn da châu Á.",
    content: `<p>Nước thần SK-II từ lâu đã trở thành huyền thoại dưỡng da châu Á. Tuy nhiên, mức giá đắt đỏ khiến nhiều chị em phân vân. Liệu chất men Pitera độc quyền có thực sự mang lại làn da pha lê?</p>
              <p>Pitera chứa hơn 50 vi chất dinh dưỡng bao gồm vitamin, khoáng chất, axit amin giúp điều hòa chu kỳ tái tạo da. So với các dòng lên men thông thường, nước thần SK-II thẩm thấu nhanh hơn, tăng khả năng ngậm nước và cải thiện độ đàn hồi rõ rệt sau 14 ngày sử dụng.</p>`,
    thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
    tags: ["Review", "SK-II", "Chống lão hóa"],
    seoTitle: "Đánh giá nước thần SK-II chính hãng | PreNippon",
    seoDescription: "Nước thần SK-II có thực sự tốt không? So sánh chi tiết hiệu quả trẻ hóa da thực tế.",
    authorId: 27,
    authorName: "Beauty Editor Lan Chi",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: blogIdCounter++,
    title: "Top 5 Kem Chống Nắng Phổ Rộng Tốt Nhất Cho Da Treatment",
    slug: "top-5-kem-chong-nang-pho-rong-cho-da-treatment",
    summary: "Bảo vệ tối đa làn da đang sử dụng Retinol, AHA/BHA với màng lọc chống nắng tiên tiến từ Shiseido, La Roche-Posay.",
    content: `<p>Khi da đang treatment bằng Retinol hoặc Acid, lớp sừng sẽ mỏng đi và cực kỳ nhạy cảm với tia cực tím. Việc sử dụng kem chống nắng phổ rộng là bắt buộc.</p>
              <p>La Roche-Posay Anthelios UVMune 400 là ứng cử viên số 1 nhờ màng lọc độc quyền Mexoryl 400 bảo vệ da khỏi tia UVA dài. Shiseido The Perfect Protector với công nghệ WetForce kháng nước tối đa thích hợp cho hoạt động ngoài trời.</p>`,
    thumbnail: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80",
    tags: ["Chống nắng", "Treatment", "Shiseido"],
    seoTitle: "Kem chống nắng phổ rộng cho da treatment tốt nhất | PreNippon",
    seoDescription: "Top kem chống nắng màng lọc tiên tiến bảo vệ da nhạy cảm đang treatment hiệu quả.",
    authorId: 27,
    authorName: "Bác Sĩ Da Liễu Khánh Nam",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Generate 100 Realistic Orders for Cosmetics Items
const orders = [];
for (let i = 1; i <= 100; i++) {
  const customer = randItem(users.filter(u => u.role === 'ROLE_CUSTOMER'));
  const orderCode = `NIP-${100000 + i}`;

  // Generate 1-3 items
  const itemsCount = randRange(1, 3);
  const items = [];
  let totalAmount = 0;
  let requiredDeposit = 0;

  for (let j = 0; j < itemsCount; j++) {
    const prod = randItem(products);
    const quantity = randRange(1, 2);
    const itemPrice = prod.price;
    const isPre = prod.status === 'PREORDER' && prod.campaign;

    let depositAmount = 0;
    if (isPre) {
      depositAmount = prod.campaign.depositAmount;
      requiredDeposit += depositAmount * quantity;
    }

    items.push({
      id: i * 10 + j,
      orderId: i,
      productId: prod.id,
      quantity: quantity,
      price: itemPrice,
      depositAmount: depositAmount,
      type: isPre ? 'PREORDER' : 'AVAILABLE'
    });

    totalAmount += itemPrice * quantity;
  }

  // Determine Status based on index
  let status = 'PENDING';
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
    notes: i % 8 === 0 ? "Giao hàng giờ hành chính. Gọi trước khi giao." : undefined,
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

// 4. Output Directories
const mockDir = path.join(__dirname);
if (!fs.existsSync(mockDir)){
  fs.mkdirSync(mockDir, { recursive: true });
}

// 5. Write all static seed databases (Ensure all 9 tables exist)
fs.writeFileSync(path.join(mockDir, 'categories.json'), JSON.stringify(categories, null, 2));
fs.writeFileSync(path.join(mockDir, 'brands.json'), JSON.stringify(brands, null, 2));
fs.writeFileSync(path.join(mockDir, 'series.json'), JSON.stringify(series, null, 2));
fs.writeFileSync(path.join(mockDir, 'users.json'), JSON.stringify(users, null, 2));
fs.writeFileSync(path.join(mockDir, 'products.json'), JSON.stringify(products, null, 2));
fs.writeFileSync(path.join(mockDir, 'reviews.json'), JSON.stringify(reviews, null, 2));
fs.writeFileSync(path.join(mockDir, 'banners.json'), JSON.stringify(banners, null, 2));
fs.writeFileSync(path.join(mockDir, 'blogs.json'), JSON.stringify(blogs, null, 2));
fs.writeFileSync(path.join(mockDir, 'orders.json'), JSON.stringify(orders, null, 2));

console.log("Premium Cosmetics Mock database successfully generated!");
