import React, { useState, useMemo } from 'react';
import { Garment, Shop, TrialItem, TrialOrder, LiveSettlementEvent } from '../types';
import { MOCK_SHOP_IMPACT_DATA, TOTAL_LOCAL_ECONOMY_STATS } from '../data/impactDatabase';
import { getDeliverySLA, AREA_PIN_MAP } from '../data/deliveryEstimate';
import { CustomerBillModal } from './CustomerBillModal';
import { LucidIcon } from './LucidIcon';
import {
  Crown,
  Gem,
  Sparkles,
  MapPin,
  Search,
  RotateCcw,
  ShoppingBag,
  CheckCircle2,
  Bike,
  ShieldCheck,
  Star,
  Layers,
  Heart,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  Clock,
  ArrowRight,
  Store,
  ArrowLeft,
  Phone,
  Calendar,
  Check,
  TrendingUp,
  BarChart3,
  Award,
  Users,
  ArrowUpRight,
  FileCheck,
  Scan,
  Truck,
  Shirt,
  Scissors,
  Flame,
  X
} from 'lucide-react';

interface CustomerDashboardProps {
  garments: Garment[];
  shops: Shop[];
  trialItems: TrialItem[];
  activeOrder: TrialOrder | null;
  onOpenDetailsModal: (garment: Garment) => void;
  onAddToTrial: (garment: Garment, size?: string, color?: string) => void;
  onOpenTrialCart: () => void;
  onOpenTrialRoom: () => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  onSwitchToDeliveryView?: () => void;
  latestSyncNotification?: {
    title: string;
    shopName: string;
    latencyMs: string;
    timestamp: number;
  } | null;
  latestSettlementEvent?: LiveSettlementEvent | null;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  garments,
  shops,
  trialItems,
  activeOrder,
  onOpenDetailsModal,
  onAddToTrial,
  onOpenTrialCart,
  onOpenTrialRoom,
  selectedArea,
  setSelectedArea,
  latestSyncNotification,
  latestSettlementEvent,
}) => {
  // Active Tab: 'shop' (Main clothing shopping catalog) | 'sales_tracker' (Kaun sa kapda bika table) | 'dukaans' | 'impact'
  const [activeTab, setActiveTab] = useState<'shop' | 'sales_tracker' | 'dukaans' | 'impact'>('shop');
  
  // Instant Delivered Digital Bill Modal State
  const [isBillModalOpen, setIsBillModalOpen] = useState<boolean>(false);
  const [showBillBanner, setShowBillBanner] = useState<boolean>(true);
  
  // Specific shop opened to view its catalog
  const [selectedShopDetail, setSelectedShopDetail] = useState<Shop | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [salesSortBy, setSalesSortBy] = useState<'revenue' | 'units' | 'rating'>('revenue');

  // Categories
  const categories = [
    { id: 'All', label: 'All Collections', icon: Sparkles },
    { id: 'Sarees', label: 'Banarasi & Silk Sarees', icon: Gem },
    { id: 'Kurtas & Ethnic', label: 'Anarkalis & Kurtas', icon: Crown },
    { id: 'Suits & Blazers', label: 'Men\'s Sherwani & Suits', icon: Shirt },
    { id: 'Shirts & Casuals', label: 'Pure Linen & Casuals', icon: Scissors },
    { id: 'Dresses', label: 'Hand-Block Dresses', icon: Flame },
  ];

  const availableAreas = Object.keys(AREA_PIN_MAP);
  const currentPin = AREA_PIN_MAP[selectedArea]?.pin || '110024';

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter garments for general view
  const filteredGarments = useMemo(() => {
    return garments.filter((g) => {
      const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;
      const matchesSearch =
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.shopName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [garments, selectedCategory, searchQuery]);

  // Garments sorted by Product Sales Analytics
  const garmentsRankedBySales = useMemo(() => {
    return [...garments].sort((a, b) => {
      if (salesSortBy === 'revenue') {
        return (b.totalSalesGenerated || 0) - (a.totalSalesGenerated || 0);
      } else if (salesSortBy === 'units') {
        return (b.unitsSold || 0) - (a.unitsSold || 0);
      } else {
        return b.rating - a.rating;
      }
    });
  }, [garments, salesSortBy]);

  // Macro Sales Counters
  const grandTotalProductSales = useMemo(() => {
    return garments.reduce((acc, g) => acc + (g.totalSalesGenerated || 0), 0);
  }, [garments]);

  const grandTotalUnitsSold = useMemo(() => {
    return garments.reduce((acc, g) => acc + (g.unitsSold || 0), 0);
  }, [garments]);

  // Garments for specifically selected shop
  const shopGarments = selectedShopDetail
    ? garments.filter((g) => g.shopId === selectedShopDetail.id)
    : [];

  return (
    <div className="space-y-6 pb-20 animate-fade-in font-sans">
      
      {/* ======================================================== */}
      {/* 1. SLIM BOUTIQUE CONTROL BAR (LOCATION + DYNAMIC SLA)    */}
      {/* ======================================================== */}
      <div className="bg-white dark:bg-[#161311] rounded-2xl border border-stone-200/90 dark:border-stone-800/80 px-4 py-2.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition-colors duration-200">
        
        {/* Left: Location & PIN dropdown with Rivaat Royal Delivery Seal */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white shadow-xs flex-shrink-0 border border-amber-400/50">
            <Crown size={12} className="text-amber-200" />
          </div>
          <span className="flex items-center gap-1 font-bold text-stone-700 dark:text-stone-300">
            <MapPin size={13} className="text-amber-600 dark:text-amber-400" />
            <span>Delivering To:</span>
          </span>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="font-bold text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer text-xs"
          >
            {availableAreas.map((area) => (
              <option key={area} value={area}>
                {area} (PIN: {AREA_PIN_MAP[area]?.pin})
              </option>
            ))}
          </select>
          <span className="text-stone-400 dark:text-stone-600 hidden sm:inline">•</span>
          
          {/* Dynamic Distance SLA Tag */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-bold text-[11px]">
            <Truck size={12} className="text-emerald-600 dark:text-emerald-400" />
            <span>⚡ Same-Day (8-10 km radius) | 🚚 2 Days (&gt;10 km)</span>
          </span>
        </div>

        {/* Right: Quick Search input */}
        <div className="flex items-center gap-2 w-full md:w-72">
          <div className="relative w-full">
            <Search size={13} className="text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search silk sarees, anarkalis, sherwanis..."
              className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-stone-400">
                <X size={12} />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 2. COMPACT DISMISSABLE SETTLEMENT INVOICE NOTIFICATION   */}
      {/* ======================================================== */}
      {latestSettlementEvent && showBillBanner && (
        <div className="bg-stone-900 text-white rounded-2xl px-4 py-2.5 shadow-md flex items-center justify-between gap-3 text-xs border border-amber-500/30 animate-fade-in">
          <div className="flex items-center gap-2.5 truncate">
            <Crown size={15} className="text-amber-400 flex-shrink-0" />
            <span className="truncate">
              <strong>Spot Bill Delivered:</strong> Order #{latestSettlementEvent.orderId} (₹{latestSettlementEvent.totalAmount.toLocaleString('en-IN')}) synchronized across you, rider & shops.
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setIsBillModalOpen(true)}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs"
            >
              View Invoice
            </button>
            <button onClick={() => setShowBillBanner(false)} className="text-stone-400 hover:text-white">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. STORE NAVIGATION TABS (Shop vs Sales Tracker vs Shops)*/}
      {/* ======================================================== */}
      {!selectedShopDetail && (
        <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold flex-wrap">
            
            <button
              onClick={() => setActiveTab('shop')}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'shop'
                  ? 'bg-stone-950 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-950 bg-white border border-stone-200'
              }`}
            >
              <Sparkles size={14} className={activeTab === 'shop' ? 'text-amber-400' : ''} />
              <span>Designer Outfits Store</span>
            </button>

            {/* User Feature: Kaun sa product bika aur kitni sales aayi */}
            <button
              onClick={() => setActiveTab('sales_tracker')}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'sales_tracker'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-950 bg-amber-50/80 border border-amber-300'
              }`}
            >
              <TrendingUp size={14} className={activeTab === 'sales_tracker' ? 'text-white' : 'text-amber-700'} />
              <span>👑 Product Sales & Revenue Tracker</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-400 text-stone-950 font-black">
                Live
              </span>
            </button>

            <button
              onClick={() => setActiveTab('dukaans')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'dukaans'
                  ? 'bg-stone-950 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-950 bg-white border border-stone-200'
              }`}
            >
              <Store size={14} />
              <span>Iconic Dukaans ({shops.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('impact')}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'impact'
                  ? 'bg-stone-950 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-950 bg-white border border-stone-200'
              }`}
            >
              <BarChart3 size={14} />
              <span>Retailers Growth Index</span>
            </button>
          </div>

          {/* Trial Wardrobe Bag Button */}
          <button
            onClick={onOpenTrialCart}
            data-cursor="trial"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-stone-900 to-stone-950 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition active:scale-95"
          >
            <ShoppingBag size={14} className="text-amber-400" />
            <span>₹0 Trial Bag ({trialItems.length}/10)</span>
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MAIN CLOTHING STOREFRONT (PRODUCTS FRONT AND CENTER)   */}
      {/* ======================================================== */}
      {activeTab === 'shop' && !selectedShopDetail && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Section A: HIGHLIGHTED TOP-SELLING ENSEMBLES STRIP */}
          {/* Directly surfaces: "Kaun sa product bika, kitna bika & kitni sales aayi" */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 font-serif">
                  <Crown size={14} /> Bestseller Designs • Live Storefront Proof
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-serif text-stone-950 mt-0.5">
                  Top-Selling Outfits Loved by Delhi Shoppers
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('sales_tracker')}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                <span>View Full Sales Leaderboard</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Top 3 Bestsellers Showcase Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {garmentsRankedBySales.slice(0, 3).map((bestseller, rankIdx) => {
                const sla = getDeliverySLA(selectedArea, bestseller.shopId, bestseller.shopArea);
                const isInTrial = trialItems.some((it) => it.id === bestseller.id);

                return (
                  <div
                    key={bestseller.id}
                    className="p-3.5 rounded-3xl bg-white dark:bg-[#161311] border border-amber-300/80 dark:border-amber-900/50 shadow-md flex gap-3.5 items-center justify-between hover:shadow-lg transition"
                  >
                    <div className="relative w-22 h-28 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 flex-shrink-0">
                      <img
                        src={bestseller.images[0]}
                        alt={bestseller.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-stone-950/85 text-amber-300 text-[9px] font-black font-serif border border-amber-400/40">
                        Rank #{rankIdx + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      {/* Shop Logo Avatar + Name */}
                      <div className="flex items-center gap-1.5 truncate">
                        <img
                          src={shops.find((s) => s.id === bestseller.shopId)?.avatarImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'}
                          alt={bestseller.shopName}
                          className="w-4 h-4 rounded-full object-cover border border-amber-400/80 flex-shrink-0"
                        />
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 font-semibold truncate">
                          {bestseller.shopName} ({bestseller.shopArea})
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate font-serif">
                        {bestseller.title}
                      </h4>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-sm text-stone-950 dark:text-stone-100 font-serif">₹{bestseller.price.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] line-through text-stone-400 dark:text-stone-500">₹{bestseller.originalPrice.toLocaleString('en-IN')}</span>
                      </div>

                      {/* Explicit Sales Stats Pill */}
                      <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-amber-950 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/60">
                        <span>🔥 {bestseller.unitsSold} Bika</span>
                        <span className="text-stone-300 dark:text-stone-600">•</span>
                        <span className="text-emerald-700 dark:text-emerald-400">₹{(bestseller.totalSalesGenerated / 1000).toFixed(0)}k Sales</span>
                      </div>

                      {/* SLA */}
                      <div className="text-[10px] text-stone-500 dark:text-stone-400 font-semibold">
                        <span className={sla.isDelayed ? "text-amber-800 dark:text-amber-400 font-bold" : "text-emerald-700 dark:text-emerald-400 font-bold"}>
                          {sla.slaLabel}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => onOpenDetailsModal(bestseller)}
                        className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs"
                        title="View details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => onAddToTrial(bestseller)}
                        disabled={isInTrial}
                        className={`p-2 rounded-xl text-xs font-bold transition ${
                          isInTrial ? 'bg-emerald-600 text-white' : 'bg-stone-900 hover:bg-amber-600 text-white'
                        }`}
                        title="Add to trial"
                      >
                        <ShoppingBag size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section B: CATEGORY PILLS BAR */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const IconComp = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition active:scale-95 border ${
                      isSelected
                        ? 'bg-stone-950 text-white border-amber-500 shadow-sm'
                        : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    <IconComp size={14} className={isSelected ? 'text-amber-400' : 'text-stone-500'} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Section C: ALL GARMENTS PRODUCT RACK (GRID OF CLOTHES) */}
            {filteredGarments.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-2">
                <ShoppingBag size={42} className="text-stone-300 mx-auto" />
                <h4 className="font-bold text-stone-900">No outfits found matching "{searchQuery}"</h4>
                <p className="text-xs text-stone-500">Try clearing your search query or picking another category.</p>
                <button
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                  className="px-4 py-2 bg-amber-600 text-white font-bold rounded-xl text-xs"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredGarments.map((garment) => {
                  const isInTrial = trialItems.some((item) => item.id === garment.id);
                  const isFav = !!favorites[garment.id];
                  const sla = getDeliverySLA(selectedArea, garment.shopId, garment.shopArea);

                  return (
                    <div
                      key={garment.id}
                      data-cursor="view"
                      className="group rounded-3xl border border-stone-200/90 dark:border-stone-800/80 bg-white dark:bg-[#161311] overflow-hidden shadow-xs hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Image Container with Badges */}
                        <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 dark:bg-stone-800">
                          <img
                            src={garment.images[0]}
                            alt={garment.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />

                          {/* Top Shop Crest Tag with Real Shop Avatar Logo */}
                          <div className="absolute top-2.5 left-2.5 bg-stone-950/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg border border-white/15 flex items-center gap-1.5 shadow-sm">
                            <img
                              src={shops.find((s) => s.id === garment.shopId)?.avatarImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'}
                              alt={garment.shopName}
                              className="w-3.5 h-3.5 rounded-full object-cover border border-amber-400/80 flex-shrink-0"
                            />
                            <span className="truncate max-w-[110px] text-amber-200">{garment.shopName}</span>
                          </div>

                          {/* Wishlist Heart Button */}
                          <button
                            onClick={(e) => toggleFavorite(garment.id, e)}
                            className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition shadow ${
                              isFav ? 'bg-rose-600 text-white' : 'bg-white/80 dark:bg-stone-900/80 hover:bg-white text-stone-700 dark:text-stone-300'
                            }`}
                          >
                            <Heart size={14} className={isFav ? 'fill-white' : ''} />
                          </button>

                          {/* Fabric Tag */}
                          <div className="absolute bottom-2.5 left-2.5 bg-stone-900/80 backdrop-blur-md text-amber-200 text-[10px] font-medium px-2 py-0.5 rounded-lg border border-amber-400/20">
                            {garment.fabric}
                          </div>

                          {/* Quick Inspect Button Overlay */}
                          <button
                            onClick={() => onOpenDetailsModal(garment)}
                            className="absolute bottom-2.5 right-2.5 bg-white/95 dark:bg-stone-900/95 hover:bg-amber-600 hover:text-white text-stone-900 dark:text-stone-100 px-2.5 py-1 rounded-lg text-[10px] font-extrabold shadow transition flex items-center gap-1"
                          >
                            <Eye size={11} />
                            <span>Inspect</span>
                          </button>
                        </div>

                        {/* Details */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 font-semibold">
                            <span>{garment.shopArea}</span>
                            <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-bold">
                              <Star size={12} className="fill-amber-500 text-amber-500" /> {garment.rating}
                            </span>
                          </div>

                          <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 leading-snug line-clamp-2 font-serif">
                            {garment.title}
                          </h3>

                          {/* Price */}
                          <div className="flex items-baseline gap-2 pt-0.5">
                            <span className="text-base font-extrabold text-stone-950 dark:text-stone-100 font-serif">
                              ₹{garment.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs line-through text-stone-400 dark:text-stone-500">
                              ₹{garment.originalPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                              {Math.round(((garment.originalPrice - garment.price) / garment.originalPrice) * 100)}% OFF
                            </span>
                          </div>

                          {/* Product Sales Metric (User Request) */}
                          <div className="flex items-center justify-between text-[10px] font-bold py-1 px-2 rounded-lg bg-amber-500/10 border border-amber-400/20 text-amber-900 dark:text-amber-300">
                            <span className="flex items-center gap-1">
                              <TrendingUp size={11} className="text-amber-600 dark:text-amber-400" />
                              <span>{garment.unitsSold} Bika (Sold)</span>
                            </span>
                            <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">
                              ₹{(garment.totalSalesGenerated / 1000).toFixed(0)}k Sales
                            </span>
                          </div>

                          {/* Delivery SLA Badge (User Request) */}
                          <div className="pt-0.5">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${sla.colorClass} ${sla.bgClass}`}>
                              <Truck size={11} />
                              <span>{sla.badgeText}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-4 pt-0 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => onOpenDetailsModal(garment)}
                            className="py-2.5 px-2 rounded-xl border border-stone-200 hover:border-amber-500 bg-stone-50 hover:bg-amber-50 text-stone-900 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                          >
                            <Eye size={13} className="text-amber-600" />
                            <span>Fabric</span>
                          </button>

                          <button
                            onClick={() => onAddToTrial(garment)}
                            disabled={isInTrial}
                            data-cursor="trial"
                            className={`py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm ${
                              isInTrial
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-900 hover:bg-amber-600 text-white'
                            }`}
                          >
                            {isInTrial ? (
                              <>
                                <CheckCircle2 size={13} className="text-emerald-300" />
                                <span>In Bag ✓</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag size={13} className="text-amber-300" />
                                <span>Try at Home (₹0)</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 5. FULL PRODUCT SALES & REVENUE LEADERBOARD TAB          */}
      {/* (Dedicated Table: "Kaun sa product bika & kitni sales aayi") */}
      {/* ======================================================== */}
      {activeTab === 'sales_tracker' && !selectedShopDetail && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Summary Strip */}
          <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white rounded-3xl p-6 shadow-xl border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-2">
                <Crown size={14} className="text-amber-400" />
                <span>Live Garment Sales Transparency</span>
              </div>
              <h2 className="text-2xl font-black font-serif text-white">
                Kaun Sa Product Bika & Kitni Sales Aayi
              </h2>
              <p className="text-xs text-stone-300 max-w-xl mt-1">
                Every verified garment sold through Rivaat doorstep trials with total units purchased by Delhi shoppers and revenue credited to local shopkeepers.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-amber-300 block">Total Pieces Bika</span>
                <span className="text-xl font-black font-serif text-white">{grandTotalUnitsSold} Units</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">Total Sales Generated</span>
                <span className="text-xl font-black font-serif text-emerald-400">₹{grandTotalProductSales.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Sorter Buttons */}
          <div className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200">
            <span className="text-xs font-bold text-stone-700">Sort Garments by:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSalesSortBy('revenue')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  salesSortBy === 'revenue' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700'
                }`}
              >
                💰 Highest Sales (₹)
              </button>
              <button
                onClick={() => setSalesSortBy('units')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  salesSortBy === 'units' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700'
                }`}
              >
                🔥 Most Pieces Bika
              </button>
              <button
                onClick={() => setSalesSortBy('rating')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  salesSortBy === 'rating' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700'
                }`}
              >
                ⭐ Top Customer Rating
              </button>
            </div>
          </div>

          {/* Product Sales Leaderboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {garmentsRankedBySales.map((garment, idx) => {
              const isInTrial = trialItems.some((item) => item.id === garment.id);
              const sla = getDeliverySLA(selectedArea, garment.shopId, garment.shopArea);

              return (
                <div
                  key={garment.id}
                  className="bg-white rounded-3xl border border-stone-200 p-4 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row gap-4 justify-between"
                >
                  <div className="flex gap-3.5">
                    <div className="relative w-24 h-32 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0">
                      <img
                        src={garment.images[0]}
                        alt={garment.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-stone-950/80 text-amber-300 text-[11px] font-black font-serif flex items-center justify-center border border-amber-400/40">
                        #{idx + 1}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {garment.shopName} ({garment.shopArea})
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 font-serif leading-snug line-clamp-2">
                        {garment.title}
                      </h4>
                      <div className="flex items-baseline gap-2 pt-0.5">
                        <span className="text-sm font-extrabold text-stone-950 font-serif">
                          ₹{garment.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] line-through text-stone-400">
                          ₹{garment.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="pt-0.5">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${sla.colorClass} ${sla.bgClass}`}>
                          <Truck size={11} />
                          <span>{sla.badgeText}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Explicit Sales Numbers */}
                  <div className="sm:border-l sm:border-stone-100 sm:pl-4 flex sm:flex-col justify-between sm:justify-center items-end sm:items-start gap-2 bg-stone-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-500 block">Kitna Product Bika</span>
                      <div className="text-base sm:text-lg font-black text-amber-700 font-serif">
                        🔥 {garment.unitsSold} Pieces Bika
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-500 block">Total Sales Aayi</span>
                      <div className="text-base sm:text-lg font-black text-emerald-700 font-serif">
                        ₹{garment.totalSalesGenerated.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      onClick={() => onAddToTrial(garment)}
                      disabled={isInTrial}
                      data-cursor="trial"
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                        isInTrial ? 'bg-emerald-600 text-white' : 'bg-stone-900 hover:bg-amber-600 text-white'
                      }`}
                    >
                      {isInTrial ? 'In Trial Bag ✓' : 'Add to ₹0 Trial'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 6. SHOPS DIRECTORY                                       */}
      {/* ======================================================== */}
      {activeTab === 'dukaans' && !selectedShopDetail && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
              Iconic Generational Dukaans of Delhi
            </h2>
            <p className="text-xs text-stone-500">
              Browse directly from generational master weavers and boutique tailors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shops.map((shop) => {
              const shopClothes = garments.filter((g) => g.shopId === shop.id);
              const sla = getDeliverySLA(selectedArea, shop.id, shop.marketArea);

              return (
                <div
                  key={shop.id}
                  onClick={() => setSelectedShopDetail(shop)}
                  data-cursor="shop"
                  className="group cursor-pointer rounded-3xl border border-stone-200 bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={shop.bannerImage}
                        alt={shop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Star size={13} className="text-amber-400 fill-amber-400" />
                        {shop.rating} ({shop.reviewCount})
                      </div>

                      <div className="absolute bottom-3 left-3 flex items-center gap-3">
                        <img
                          src={shop.avatarImage}
                          alt={shop.ownerName}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400 shadow"
                        />
                        <div className="text-white">
                          <h3 className="font-bold font-serif text-lg leading-tight">{shop.name}</h3>
                          <p className="text-xs text-amber-200">Owner: {shop.ownerName}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-stone-600">
                          <MapPin size={13} className="text-amber-600" /> {shop.marketArea}
                        </span>
                        <span className={`font-bold px-2.5 py-0.5 rounded-full border text-[11px] ${sla.colorClass} ${sla.bgClass}`}>
                          {sla.slaLabel}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 line-clamp-2">
                        {shop.address}. Preserving traditional handlooms since {shop.estSince}.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl">
                      ⚡ {shopClothes.length} Outfits Available
                    </span>
                    <button className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs group-hover:bg-amber-700 transition flex items-center gap-1">
                      <span>Browse Rack</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. LOCAL RETAILERS GROWTH INDEX (IMPACT DB)              */}
      {/* ======================================================== */}
      {activeTab === 'impact' && !selectedShopDetail && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-2xl font-bold font-serif text-stone-900">
              Local Clothing Shops Sales & Growth Index
            </h2>
            <p className="text-xs text-stone-500">
              Verified data on how local stores grow with continuous Rivaat adoption.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-stone-500 uppercase">Total Sales via Rivaat</span>
              <div className="text-2xl font-black text-stone-900 font-serif">
                ₹{TOTAL_LOCAL_ECONOMY_STATS.totalSalesGenerated.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp size={13} /> +{TOTAL_LOCAL_ECONOMY_STATS.averageGrowthPct}% Surge
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-stone-500 uppercase">Dead-Stock Reduced</span>
              <div className="text-2xl font-black text-emerald-600 font-serif">
                {TOTAL_LOCAL_ECONOMY_STATS.averageDeadStockReduction}%
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-stone-500 uppercase">Craft Families Supported</span>
              <div className="text-2xl font-black text-stone-900 font-serif">
                {TOTAL_LOCAL_ECONOMY_STATS.totalArtisansSupported} Families
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-stone-500 uppercase">Repeat Trial Rate</span>
              <div className="text-2xl font-black text-amber-700 font-serif">
                {TOTAL_LOCAL_ECONOMY_STATS.customerRetentionPct}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. SINGLE SHOP DETAILS CATALOG VIEW                      */}
      {/* ======================================================== */}
      {selectedShopDetail && (
        <div className="space-y-6 animate-fade-in">
          <button
            onClick={() => setSelectedShopDetail(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-amber-600 transition bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-xs"
          >
            <ArrowLeft size={15} />
            <span>← Back to All Outfits</span>
          </button>

          {/* Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white p-6 sm:p-8 shadow-xl">
            <img
              src={selectedShopDetail.bannerImage}
              alt={selectedShopDetail.name}
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/80 to-transparent" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedShopDetail.avatarImage}
                  alt={selectedShopDetail.ownerName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-lg"
                />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
                    {selectedShopDetail.name}
                  </h1>
                  <p className="text-xs text-stone-300 mt-1">
                    Owner: {selectedShopDetail.ownerName} • {selectedShopDetail.address}
                  </p>
                </div>
              </div>

              {(() => {
                const sla = getDeliverySLA(selectedArea, selectedShopDetail.id, selectedShopDetail.marketArea);
                return (
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl text-xs space-y-1">
                    <span className="text-stone-300 block">Distance to your PIN: {sla.distanceKm.toFixed(1)} km</span>
                    <span className={`font-bold ${sla.isDelayed ? "text-amber-400" : "text-emerald-400"}`}>
                      {sla.slaLabel}
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Clothes grid for this shop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {shopGarments.map((garment) => {
              const isInTrial = trialItems.some((item) => item.id === garment.id);
              return (
                <div
                  key={garment.id}
                  className="group rounded-3xl border border-stone-200 bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                    <img
                      src={garment.images[0]}
                      alt={garment.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute bottom-2.5 left-2.5 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-lg">
                      {garment.fabric}
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h3 className="font-bold text-sm text-stone-900 font-serif line-clamp-2">
                      {garment.title}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-extrabold text-stone-950 font-serif">
                        ₹{garment.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs line-through text-stone-400">
                        ₹{garment.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-bold py-1 px-2 rounded-lg bg-amber-500/10 text-amber-900">
                      <span>🔥 {garment.unitsSold} Bika</span>
                      <span className="text-emerald-700">₹{(garment.totalSalesGenerated / 1000).toFixed(0)}k Sales</span>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      onClick={() => onAddToTrial(garment)}
                      disabled={isInTrial}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                        isInTrial ? 'bg-emerald-600 text-white' : 'bg-stone-900 hover:bg-amber-600 text-white'
                      }`}
                    >
                      {isInTrial ? 'In Trial Bag ✓' : 'Add to ₹0 Trial Bag'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Instant Digital Bill Modal */}
      {isBillModalOpen && latestSettlementEvent && (
        <CustomerBillModal
          settlement={latestSettlementEvent}
          onClose={() => setIsBillModalOpen(false)}
        />
      )}

    </div>
  );
};
