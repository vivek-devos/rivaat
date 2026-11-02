import { ShopImpactData } from '../types';

export const MOCK_SHOP_IMPACT_DATA: ShopImpactData[] = [
  {
    shopId: 'shop-1',
    shopName: 'Meena Vastra & Handlooms',
    marketArea: 'Chandni Chowk, Old Delhi',
    category: 'Handloom Sarees & Bridal',
    baselineOfflineSales: 85000,
    currentRivaatSales: 218400,
    currentGrowthPct: 156.9,
    projected6MonthSales: 360000,
    projected1YearSales: 510000,
    projected1YearGrowthPct: 500.0,
    familiesEmpowered: 14,
    artisansSupported: 18,
    deadStockReducedPct: 84
  },
  {
    shopId: 'shop-2',
    shopName: 'Royal Heritage Menswear',
    marketArea: 'South Extension Part 1',
    category: 'Ethnic Men & Sherwanis',
    baselineOfflineSales: 65000,
    currentRivaatSales: 165000,
    currentGrowthPct: 153.8,
    projected6MonthSales: 280000,
    projected1YearSales: 410000,
    projected1YearGrowthPct: 530.7,
    familiesEmpowered: 9,
    artisansSupported: 12,
    deadStockReducedPct: 78
  },
  {
    shopId: 'shop-3',
    shopName: 'Kashish Boutique & Pret',
    marketArea: 'Lajpat Nagar Central Market',
    category: 'Anarkalis & Pret Wear',
    baselineOfflineSales: 75000,
    currentRivaatSales: 195000,
    currentGrowthPct: 160.0,
    projected6MonthSales: 320000,
    projected1YearSales: 460000,
    projected1YearGrowthPct: 513.3,
    familiesEmpowered: 11,
    artisansSupported: 15,
    deadStockReducedPct: 91
  },
  {
    shopId: 'shop-4',
    shopName: 'Silk Sutra Kanchipuram Store',
    marketArea: 'Karol Bagh Market',
    category: 'Pure Kanchipuram Silks',
    baselineOfflineSales: 110000,
    currentRivaatSales: 310000,
    currentGrowthPct: 181.8,
    projected6MonthSales: 480000,
    projected1YearSales: 690000,
    projected1YearGrowthPct: 527.2,
    familiesEmpowered: 20,
    artisansSupported: 24,
    deadStockReducedPct: 88
  }
];

export const TOTAL_LOCAL_ECONOMY_STATS = {
  totalSalesGenerated: 888400,
  averageGrowthPct: 163.1,
  totalArtisansSupported: 69,
  averageDeadStockReduction: 85.2,
  customerRetentionPct: 84.6
};
