import { Shop, Garment, TrialOrder } from '../types';

export const MOCK_SHOPS: Shop[] = [
  {
    id: 'shop-1',
    name: 'Meena Vastra & Handlooms',
    ownerName: 'Shri Rameshwar Lal',
    phone: '+91 98112 45890',
    marketArea: 'Chandni Chowk, Old Delhi',
    distanceKm: 1.2,
    rating: 4.9,
    reviewCount: 342,
    estSince: 1984,
    category: ['Sarees', 'Kurtas & Ethnic', 'Bridal Dupattas'],
    bannerImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    avatarImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    address: 'Shop 42, Katra Neel, Chandni Chowk, New Delhi',
    totalProducts: 148,
    salesCount: 1250,
  },
  {
    id: 'shop-2',
    name: 'Royal Heritage Menswear',
    ownerName: 'Gurpreet Singh',
    phone: '+91 98765 12340',
    marketArea: 'South Extension Part 1',
    distanceKm: 2.4,
    rating: 4.8,
    reviewCount: 219,
    estSince: 1996,
    category: ['Suits & Blazers', 'Kurtas & Ethnic', 'Shirts & Casuals'],
    bannerImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80',
    avatarImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    address: 'E-14, Main Market, South Extension 1, New Delhi',
    totalProducts: 92,
    salesCount: 890,
  },
  {
    id: 'shop-3',
    name: 'Kashish Boutique & Pret',
    ownerName: 'Sunita & Priya Mittal',
    phone: '+91 99100 88231',
    marketArea: 'Lajpat Nagar Central Market',
    distanceKm: 1.8,
    rating: 4.9,
    reviewCount: 420,
    estSince: 2005,
    category: ['Kurtas & Ethnic', 'Dresses', 'Sarees'],
    bannerImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
    avatarImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    address: 'Shop 108, Block C, Central Market, Lajpat Nagar II, New Delhi',
    totalProducts: 165,
    salesCount: 2100,
  },
  {
    id: 'shop-4',
    name: 'Silk Sutra Kanchipuram Store',
    ownerName: 'K. Balasubramanian',
    phone: '+91 94440 98213',
    marketArea: 'Karol Bagh Market',
    distanceKm: 3.1,
    rating: 5.0,
    reviewCount: 512,
    estSince: 1978,
    category: ['Sarees', 'Dresses'],
    bannerImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80',
    avatarImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    address: '7/22, Ajmal Khan Road, Karol Bagh, New Delhi',
    totalProducts: 210,
    salesCount: 3400,
  }
];

export const MOCK_GARMENTS: Garment[] = [
  {
    id: 'g-1',
    shopId: 'shop-1',
    shopName: 'Meena Vastra & Handlooms',
    shopArea: 'Chandni Chowk',
    title: 'Banarasi Katan Silk Saree with Zari Border',
    category: 'Sarees',
    price: 3499,
    originalPrice: 5999,
    fabric: 'Pure Katan Silk',
    colors: ['#800020', '#1A365D', '#B45309'],
    sizes: ['Free Size (6.3m with Blouse)'],
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
    ],
    model3dType: 'saree',
    description: 'Directly sourced from Varanasi handloom weavers by Shri Rameshwar Lal. Heavy gold zari pallu with rich bootis. Pure silk certified.',
    rating: 4.9,
    inStock: true,
    trialAvailable: true,
    unitsSold: 148,
    totalSalesGenerated: 517852,
    fabricDetails: {
      weave: 'Handwoven 120-count Pure Katan',
      care: 'Dry Clean Only',
      feel: 'Substantial, smooth silk with royal drape'
    }
  },
  {
    id: 'g-2',
    shopId: 'shop-3',
    shopName: 'Kashish Boutique & Pret',
    shopArea: 'Lajpat Nagar',
    title: 'Chanderi Embroidered Anarkali Kurta Set',
    category: 'Kurtas & Ethnic',
    price: 2450,
    originalPrice: 4200,
    fabric: 'Chanderi Cotton Silk',
    colors: ['#047857', '#F59E0B', '#BE185D'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
    ],
    model3dType: 'kurta',
    description: 'Intricate Lucknowi gotta patti detailing along the neckline and hem. Includes flared palazzo pants and organza dupatta with hand-block print.',
    rating: 4.8,
    inStock: true,
    trialAvailable: true,
    unitsSold: 215,
    totalSalesGenerated: 526750,
    fabricDetails: {
      weave: 'Chanderi power-loom with cotton lining',
      care: 'Gentle Handwash / Dry Clean',
      feel: 'Lightweight, breathable festive wear'
    }
  },
  {
    id: 'g-3',
    shopId: 'shop-2',
    shopName: 'Royal Heritage Menswear',
    shopArea: 'South Extension',
    title: 'Raw Silk Nehru Jacket with Bandhgala',
    category: 'Suits & Blazers',
    price: 2199,
    originalPrice: 3800,
    fabric: 'Textured Raw Matka Silk',
    colors: ['#D97706', '#1E293B', '#15803D'],
    sizes: ['38', '40', '42', '44'],
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'
    ],
    model3dType: 'suit',
    description: 'Tailored fit Nehru jacket with antiqued brass buttons and Mandarin collar. Perfect for family weddings and festive functions.',
    rating: 4.9,
    inStock: true,
    trialAvailable: true,
    unitsSold: 98,
    totalSalesGenerated: 215502,
    fabricDetails: {
      weave: 'Matka Silk with structured inner fusing',
      care: 'Steam Press & Dry Clean',
      feel: 'Crisp, premium texture with rich sheen'
    }
  },
  {
    id: 'g-4',
    shopId: 'shop-2',
    shopName: 'Royal Heritage Menswear',
    shopArea: 'South Extension',
    title: 'Pure Linen Mandarin Collar Shirt',
    category: 'Shirts & Casuals',
    price: 1599,
    originalPrice: 2499,
    fabric: '100% French Flax Linen',
    colors: ['#FFFFFF', '#38BDF8', '#78716C'],
    sizes: ['38', '40', '42', '44'],
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620012253295-c15c429f66bf?auto=format&fit=crop&w=800&q=80'
    ],
    model3dType: 'shirt',
    description: 'Pre-washed breathable natural flax linen. Keeps you cool all day long, tailors sharply under jackets or as standalone casual wear.',
    rating: 4.7,
    inStock: true,
    trialAvailable: true,
    unitsSold: 184,
    totalSalesGenerated: 294216,
    fabricDetails: {
      weave: '60 Lea Pure Linen',
      care: 'Machine Wash Cold / Air Dry',
      feel: 'Airy, relaxed, gets softer with each wash'
    }
  },
  {
    id: 'g-5',
    shopId: 'shop-4',
    shopName: 'Silk Sutra Kanchipuram Store',
    shopArea: 'Karol Bagh',
    title: 'Authentic Kanchipuram Temple Border Silk Saree',
    category: 'Sarees',
    price: 4890,
    originalPrice: 8500,
    fabric: 'South Indian Pure Mulberry Silk',
    colors: ['#991B1B', '#065F46', '#854D0E'],
    sizes: ['Free Size (6.2m)'],
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    ],
    model3dType: 'saree',
    description: 'Hallmarked Korvai temple border weaving technique. Certified pure zari with peacock and floral chakra motifs. Traditional heirloom piece.',
    rating: 5.0,
    inStock: true,
    trialAvailable: true,
    unitsSold: 86,
    totalSalesGenerated: 420540,
    fabricDetails: {
      weave: '3-Ply Pure Mulberry Silk',
      care: 'Specialist Dry Clean Only',
      feel: 'Heavy, luxurious drape with golden shimmer'
    }
  },
  {
    id: 'g-6',
    shopId: 'shop-3',
    shopName: 'Kashish Boutique & Pret',
    shopArea: 'Lajpat Nagar',
    title: 'Floral Hand-Block Tiered Maxi Dress',
    category: 'Dresses',
    price: 1850,
    originalPrice: 2999,
    fabric: 'Mulmul Organic Cotton',
    colors: ['#EC4899', '#3B82F6', '#10B981'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'
    ],
    model3dType: 'dress',
    description: 'Sanganeri hand-block printed on ultra-soft mulmul cotton. Features gentle tier flounces and pockets. Made by women artisans in Jaipur.',
    rating: 4.8,
    inStock: true,
    trialAvailable: true,
    unitsSold: 162,
    totalSalesGenerated: 299700,
    fabricDetails: {
      weave: 'Hand-spun Mulmul Cotton',
      care: 'Gentle Machine Wash with mild detergent',
      feel: 'Feather-light, cloud-soft against skin'
    }
  },
  {
    id: 'g-7',
    shopId: 'shop-1',
    shopName: 'Meena Vastra & Handlooms',
    shopArea: 'Chandni Chowk',
    title: 'Tussar Silk Kurti with Kantha Hand-Stitch',
    category: 'Kurtas & Ethnic',
    price: 1699,
    originalPrice: 2799,
    fabric: 'Wild Tussar Ghicha Silk',
    colors: ['#CA8A04', '#475569', '#9F1239'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    model3dType: 'kurta',
    description: 'Bengal Kantha running stitch embroidery handcrafted over organic textured Tussar silk. Straight cut with side slits.',
    rating: 4.7,
    inStock: true,
    trialAvailable: true,
    unitsSold: 112,
    totalSalesGenerated: 190288,
    fabricDetails: {
      weave: 'Handloom Tussar with natural slubs',
      care: 'Dry Clean or Cold Hand Soak',
      feel: 'Organic textured silk with earthy feel'
    }
  },
  {
    id: 'g-8',
    shopId: 'shop-2',
    shopName: 'Royal Heritage Menswear',
    shopArea: 'South Extension',
    title: 'Festive Lucknowi Chikankari Men\'s Kurta',
    category: 'Kurtas & Ethnic',
    price: 1950,
    originalPrice: 3200,
    fabric: 'Pure Cotton with Georgette Threadwork',
    colors: ['#F8FAFC', '#E0E7FF', '#FEF3C7'],
    sizes: ['38', '40', '42', '44', '46'],
    images: [
      'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    model3dType: 'kurta',
    description: 'Traditional Bakhiya and Phanda stitches hand-embroidered by Lucknow craftswomen. Includes matching cotton churidar pyjama.',
    rating: 4.9,
    inStock: true,
    trialAvailable: true,
    unitsSold: 135,
    totalSalesGenerated: 263250,
    fabricDetails: {
      weave: 'Voile Cotton with dense shadow work',
      care: 'Handwash in gentle detergent',
      feel: 'Ultra breathable, elegant celebratory wear'
    }
  }
];

export const INITIAL_ACTIVE_ORDER: TrialOrder = {
  id: 'RVT-89241',
  customerName: 'Aarav Sharma & Family',
  customerPhone: '+91 98201 55432',
  deliveryAddress: 'Flat 402, Sunshine Heights, Lajpat Nagar III, New Delhi',
  slot: 'Same-Day Evening Trial (Within 8-10 km radius)',
  createdAt: 'Just now',
  totalItemsCount: 6,
  familyNote: 'Mom and elder sister will review fabric & drape before final buy.',
  riderName: 'Vikram Yadav (Rivaat Saathi #104)',
  riderPhone: '+91 98100 23456',
  status: 'at_doorstep_trying',
  items: [
    {
      ...MOCK_GARMENTS[0],
      selectedSize: 'Free Size',
      selectedColor: '#800020',
      trialDecision: 'pending'
    },
    {
      ...MOCK_GARMENTS[1],
      selectedSize: 'M',
      selectedColor: '#047857',
      trialDecision: 'pending'
    },
    {
      ...MOCK_GARMENTS[2],
      selectedSize: '40',
      selectedColor: '#D97706',
      trialDecision: 'pending'
    },
    {
      ...MOCK_GARMENTS[3],
      selectedSize: '40',
      selectedColor: '#FFFFFF',
      trialDecision: 'pending'
    },
    {
      ...MOCK_GARMENTS[5],
      selectedSize: 'M',
      selectedColor: '#EC4899',
      trialDecision: 'pending'
    },
    {
      ...MOCK_GARMENTS[7],
      selectedSize: '42',
      selectedColor: '#F8FAFC',
      trialDecision: 'pending'
    }
  ]
};
