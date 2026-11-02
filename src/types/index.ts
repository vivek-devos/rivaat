export type UserRole = 'customer' | 'shopkeeper' | 'delivery';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  phone?: string;
  email?: string;
  shopId?: string;
  shopName?: string;
  riderId?: string;
  avatar?: string;
  address?: string;
  isNewUser?: boolean;
}

export interface Shop {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  marketArea: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  estSince: number;
  category: string[];
  bannerImage: string;
  avatarImage: string;
  address: string;
  totalProducts: number;
  salesCount: number;
  description?: string;
}

export interface Garment {
  id: string;
  shopId: string;
  shopName: string;
  shopArea: string;
  title: string;
  category: 'Sarees' | 'Kurtas & Ethnic' | 'Suits & Blazers' | 'Shirts & Casuals' | 'Dresses' | 'Kids Wear';
  price: number;
  originalPrice: number;
  fabric: string;
  colors: string[];
  sizes: string[];
  images: string[];
  model3dType?: 'saree' | 'kurta' | 'suit' | 'dress' | 'shirt';
  description: string;
  rating: number;
  inStock: boolean;
  trialAvailable: boolean;
  unitsSold: number; // Kitna product bika hai (e.g. 148 units)
  totalSalesGenerated: number; // Us product ki wajah se kitni sales aayi hai (e.g. ₹5,17,852)
  isNewUpload?: boolean;
  syncLatency?: string;
  fabricDetails: {
    weave: string;
    care: string;
    feel: string;
  };
}

export interface TrialItem extends Garment {
  selectedSize: string;
  selectedColor: string;
  trialDecision?: 'keep' | 'return' | 'pending';
}

export interface ShopSettlementSummary {
  shopId: string;
  shopName: string;
  shopArea: string;
  keptItems: TrialItem[];
  returnedItems: TrialItem[];
  shopBillAmount: number;
  payoutAmount: number;
}

export interface ThreeWayBillDispatch {
  billId: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  timestamp: number;
  customerDelivered: boolean;
  riderSaved: boolean;
  shopSummariesDispatched: {
    shopId: string;
    shopName: string;
    amount: number;
    payout: number;
    delivered: boolean;
  }[];
}

export interface LiveSettlementEvent {
  orderId: string;
  customerName: string;
  totalAmount: number;
  paymentMethod: string;
  timestamp: number;
  shopBreakdowns: ShopSettlementSummary[];
  threeWayDispatch?: ThreeWayBillDispatch;
}

export interface ShopImpactData {
  shopId: string;
  shopName: string;
  marketArea: string;
  category: string;
  baselineOfflineSales: number;
  currentRivaatSales: number;
  currentGrowthPct: number;
  projected6MonthSales: number;
  projected1YearSales: number;
  projected1YearGrowthPct: number;
  familiesEmpowered: number;
  artisansSupported: number;
  deadStockReducedPct: number;
}

export interface TrialOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  slot: string;
  items: TrialItem[];
  status: 'booked' | 'picked_from_shop' | 'out_for_trial' | 'at_doorstep_trying' | 'settled';
  createdAt: string;
  totalItemsCount: number;
  familyNote?: string;
  riderName?: string;
  riderPhone?: string;
  riderPickupConfirmed?: boolean;
  deliveryStage?: 'heading_to_shop' | 'picked_up' | 'arrived_doorstep' | 'trying' | 'payment_collected' | 'returned_to_shop';
  keptItems?: TrialItem[];
  returnedItems?: TrialItem[];
  totalKeptAmount?: number;
  platformFee?: number;
  shopSettlements?: ShopSettlementSummary[];
}
