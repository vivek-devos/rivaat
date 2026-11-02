import React, { useState, useMemo } from 'react';
import { UserRole, UserProfile, Shop, Garment, TrialItem } from '../types';
import {
  Crown,
  Gem,
  Sparkles,
  Shirt,
  Scissors,
  Feather,
  Flame,
  ShoppingBag,
  Store,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Clock,
  Star,
  Heart,
  Eye,
  MapPin,
  CheckCircle2,
  Award,
  BadgePercent,
  ArrowRight,
  ChevronRight,
  SlidersHorizontal,
  Search,
  X,
  Check,
  Bike,
  Lock,
  Phone,
  User,
  Sliders,
  Sparkle,
  TrendingUp,
  Sun,
  Moon
} from 'lucide-react';
import { LucidIcon, LucidVariant } from './LucidIcon';
import { getDeliverySLA } from '../data/deliveryEstimate';

interface LandingPageProps {
  onLogin: (user: UserProfile) => void;
  garments: Garment[];
  shops: Shop[];
  trialItems: TrialItem[];
  onAddToTrial: (garment: Garment, size?: string, color?: string) => void;
  onOpenDetailsModal: (garment: Garment) => void;
  onOpenTrialCart: () => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLogin,
  garments,
  shops,
  trialItems,
  onAddToTrial,
  onOpenDetailsModal,
  onOpenTrialCart,
  selectedArea,
  setSelectedArea,
  theme = 'light',
  onToggleTheme,
}) => {
  // Catalog Filtering & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedShopFilter, setSelectedShopFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'all' | 'wedding' | 'handloom' | 'groom' | 'budget'>('all');

  // Auth Modal State
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Form States
  const [custName, setCustName] = useState('Aarav Sharma');
  const [custPhone, setCustPhone] = useState('+91 98201 55432');
  const [custArea, setCustArea] = useState('Lajpat Nagar');
  const [custAddress, setCustAddress] = useState('Flat 402, Sunshine Heights, Lajpat Nagar, New Delhi');
  const [custPin, setCustPin] = useState('4829');

  const [shopName, setShopName] = useState('Meena Vastra & Handlooms');
  const [ownerName, setOwnerName] = useState('Shri Rameshwar Lal');
  const [shopArea, setShopArea] = useState('Chandni Chowk');
  const [shopPhone, setShopPhone] = useState('+91 98112 45890');
  const [shopCategory, setShopCategory] = useState('Sarees & Ethnic Silk');
  const [shopPassword, setShopPassword] = useState('••••••••');

  const [riderName, setRiderName] = useState('Vikram Yadav');
  const [riderPhone, setRiderPhone] = useState('+91 98100 23456');
  const [vehicleNo, setVehicleNo] = useState('DL 3S CW 8921');
  const [riderPin, setRiderPin] = useState('1234');

  // Categories with authentic Lucide Icons
  const categories = [
    { id: 'All', label: 'All Ensembles', icon: Sparkles, variant: 'gold' as LucidVariant, count: garments.length },
    { id: 'Sarees', label: 'Banarasi & Silk Sarees', icon: Gem, variant: 'maroon' as LucidVariant, count: 24 },
    { id: 'Kurtas & Ethnic', label: 'Anarkalis & Kurtas', icon: Crown, variant: 'saffron' as LucidVariant, count: 32 },
    { id: 'Suits & Blazers', label: 'Men\'s Sherwani & Bandhgala', icon: Shirt, variant: 'sapphire' as LucidVariant, count: 18 },
    { id: 'Shirts & Casuals', label: 'Pure Linen & Casuals', icon: Scissors, variant: 'emerald' as LucidVariant, count: 14 },
    { id: 'Dresses', label: 'Hand-Block Festive Dresses', icon: Flame, variant: 'rose' as LucidVariant, count: 16 },
  ];

  const marketAreas = ['All Areas', 'Chandni Chowk', 'Lajpat Nagar', 'South Extension', 'Karol Bagh'];

  // Toggle favorite
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter & sort garments
  const filteredGarments = useMemo(() => {
    let result = garments.filter((g) => {
      let matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;
      if (activeTab === 'wedding') {
        matchesCategory = g.category === 'Sarees' || g.category === 'Suits & Blazers';
      } else if (activeTab === 'handloom') {
        matchesCategory = g.fabric.toLowerCase().includes('silk') || g.fabric.toLowerCase().includes('handloom');
      } else if (activeTab === 'groom') {
        matchesCategory = g.category === 'Suits & Blazers' || g.category === 'Shirts & Casuals';
      } else if (activeTab === 'budget') {
        matchesCategory = g.price <= 2500;
      }

      const matchesSearch =
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.shopName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArea =
        selectedArea === 'All Areas' || g.shopArea.toLowerCase().includes(selectedArea.toLowerCase());
      const matchesShop = selectedShopFilter === 'All' || g.shopId === selectedShopFilter;
      return matchesCategory && matchesSearch && matchesArea && matchesShop;
    });

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }
    return result;
  }, [garments, selectedCategory, activeTab, searchQuery, selectedArea, selectedShopFilter, sortBy]);

  // Auth Submit Handler
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'customer') {
      onLogin({
        id: `cust-${Date.now()}`,
        name: custName,
        role: 'customer',
        phone: custPhone,
        address: custAddress,
        isNewUser: authMode === 'register',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      });
    } else if (selectedRole === 'shopkeeper') {
      onLogin({
        id: 'shop-1',
        name: ownerName,
        role: 'shopkeeper',
        shopId: 'shop-1',
        shopName: shopName,
        phone: shopPhone,
        isNewUser: authMode === 'register',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      });
    } else {
      onLogin({
        id: 'rider-104',
        name: riderName,
        role: 'delivery',
        riderId: 'RIDER-104',
        phone: riderPhone,
        isNewUser: authMode === 'register',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      });
    }
  };

  // 1-Click Fast Demo Login
  const handleFastDemoLogin = (role: UserRole) => {
    if (role === 'customer') {
      onLogin({
        id: 'cust-1',
        name: 'Aarav Sharma',
        role: 'customer',
        phone: '+91 98201 55432',
        address: 'Flat 402, Sunshine Heights, Lajpat Nagar, New Delhi',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      });
    } else if (role === 'shopkeeper') {
      onLogin({
        id: 'shop-1',
        name: 'Shri Rameshwar Lal',
        role: 'shopkeeper',
        shopId: 'shop-1',
        shopName: 'Meena Vastra & Handlooms',
        phone: '+91 98112 45890',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      });
    } else {
      onLogin({
        id: 'rider-104',
        name: 'Vikram Yadav',
        role: 'delivery',
        riderId: 'RIDER-104',
        phone: '+91 98100 23456',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] dark:bg-[#0D0B0A] text-stone-900 dark:text-stone-100 flex flex-col justify-between selection:bg-amber-600 selection:text-white transition-colors duration-200">
      
      {/* ======================================================== */}
      {/* 1. LUXURY ANNOUNCEMENT BANNER                            */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-stone-950 via-[#3B151E] to-stone-950 text-amber-100 text-xs font-medium py-2.5 px-4 text-center border-b border-amber-500/20 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
          <div className="flex items-center gap-1.5 font-serif tracking-wider text-amber-300">
            <Crown size={14} className="text-amber-400" />
            <span className="font-bold tracking-widest text-[11px] uppercase">The Royal Wedding Edit 2026</span>
          </div>
          <span className="hidden md:inline text-amber-500/40">•</span>
          <div className="flex items-center gap-1.5 text-stone-200">
            <Sparkles size={13} className="text-amber-400 animate-pulse" />
            <span>Curate up to <strong>10 Designer Garments</strong> to try at home</span>
          </div>
          <span className="hidden md:inline text-amber-500/40">•</span>
          <div className="flex items-center gap-1.5 text-amber-200 font-semibold">
            <Truck size={13} className="text-emerald-400" />
            <span>Same-Day Delivery (within 8-10 km) • 2 Days for &gt;10 km</span>
          </div>
          <span className="hidden lg:inline text-amber-500/40">•</span>
          <div className="hidden lg:flex items-center gap-1.5 text-emerald-300 font-bold">
            <CreditCard size={13} />
            <span>₹0 Advance Payment • Pay on Spot via Card/Cash</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. HIGH-FASHION STOREFRONT HEADER                        */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#120F0D]/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-22 flex items-center justify-between gap-4">
          
          {/* Brand Identity - Luxury Indian Couture Aesthetic */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => { setSelectedCategory('All'); setSelectedShopFilter('All'); setActiveTab('all'); }}
          >
            {/* Royal Rivaat Crest Logo */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-700 via-orange-600 to-amber-950 p-0.5 shadow-lg shadow-amber-950/20 flex-shrink-0 border border-amber-400/50 group-hover:scale-105 transition duration-300">
              <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-stone-950/90 to-amber-950 flex items-center justify-center relative overflow-hidden backdrop-blur-xs">
                <span className="absolute -top-1 -right-1 text-[8px] text-amber-300">✦</span>
                <span className="absolute -bottom-1 -left-1 text-[8px] text-amber-300">✦</span>
                <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 absolute top-1" />
                <span className="font-serif font-black text-2xl sm:text-3xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 mt-1">
                  R
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-stone-950 dark:text-amber-100">
                  Rivaat
                </span>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-950/80 dark:to-orange-950/80 text-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 flex items-center gap-1 shadow-sm font-serif">
                  <Sparkles size={11} className="text-amber-600 dark:text-amber-400" />
                  रिवात
                </span>
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium tracking-wide">
                Luxury Local Ateliers • Same-Day Doorstep Trial (8-10 km)
              </p>
            </div>
          </div>

          {/* Center Search Bar with Dukaan & Fabric Filters */}
          <div className="hidden md:flex flex-1 max-w-xl items-center gap-2.5 bg-stone-50 border border-stone-300 rounded-2xl px-4 py-2.5 focus-within:border-amber-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/20 transition shadow-inner">
            <Search size={16} className="text-stone-400 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Banarasi katan silk, Anarkalis, Bandhgalas, Sherwanis..."
              className="bg-transparent text-xs w-full focus:outline-none text-stone-900 placeholder:text-stone-400 font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-stone-400 hover:text-stone-700">
                <X size={14} />
              </button>
            )}
            
            {/* Area Filter Selector inside search */}
            <div className="border-l border-stone-300 pl-3 flex items-center gap-1.5 text-[11px] font-bold text-stone-700 whitespace-nowrap">
              <MapPin size={13} className="text-amber-600" />
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="bg-transparent text-[11px] font-bold text-stone-800 focus:outline-none cursor-pointer"
              >
                {marketAreas.map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Action Icons: Wishlist, Trial Wardrobe Bag & Portal Login */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Wishlist Heart Counter */}
            <button
              onClick={() => {
                const count = Object.values(favorites).filter(Boolean).length;
                alert(`You have saved ${count} bespoke pieces in your Rivaat Wishlist!`);
              }}
              className="p-2.5 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 hover:text-rose-600 transition shadow-sm relative"
              title="Saved Wishlist"
            >
              <Heart size={18} className={Object.values(favorites).filter(Boolean).length > 0 ? "fill-rose-500 text-rose-500" : ""} />
              {Object.values(favorites).filter(Boolean).length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {Object.values(favorites).filter(Boolean).length}
                </span>
              )}
            </button>

            {/* Trial Wardrobe Bag Trigger */}
            <button
              onClick={onOpenTrialCart}
              data-cursor="trial"
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs flex items-center gap-2.5 shadow-md transition active:scale-95 border border-stone-800 hover:border-amber-500/50"
            >
              <ShoppingBag size={16} className="text-amber-400" />
              <span className="hidden sm:inline">₹0 Trial Bag</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 text-[11px] font-black shadow-inner">
                {trialItems.length}/10
              </span>
            </button>

            {/* Partner Portal Access Modal Trigger */}
            <button
              onClick={() => {
                setSelectedRole('shopkeeper');
                setAuthMode('login');
                setShowAuthModal(true);
              }}
              data-cursor="shop"
              className="px-3.5 py-2.5 rounded-2xl border border-amber-300/80 hover:border-amber-600 bg-amber-50/50 hover:bg-amber-100/70 text-stone-900 text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <Store size={15} className="text-amber-700" />
              <span className="hidden lg:inline">Merchant / Rider Login</span>
              <span className="lg:hidden">Portal</span>
            </button>

            {/* Dark / Light Theme Toggle Button */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-amber-300 border border-stone-200 dark:border-stone-700 transition flex items-center justify-center shadow-xs active:scale-95"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Theme'}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 fill-amber-400/30" />
                ) : (
                  <Moon className="w-4 h-4 text-stone-700 fill-stone-700/20" />
                )}
              </button>
            )}

            {/* Customer Sign In / Register */}
            <button
              onClick={() => {
                setSelectedRole('customer');
                setAuthMode('login');
                setShowAuthModal(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <User size={15} />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center gap-2 bg-stone-100 border border-stone-300 rounded-xl px-3 py-2 text-xs">
            <Search size={14} className="text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search silk sarees, anarkalis, sherwanis..."
              className="bg-transparent w-full focus:outline-none text-stone-900"
            />
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 3. COUTURE HERO BANNER (INSPIRED BY RIWAAYAT.IN)          */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F2EA] via-[#FCFAF7] to-white border-b border-stone-200 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* Left Storytelling: Royal Doorstep Experience */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/80 text-amber-950 text-xs font-bold shadow-sm">
                <Crown size={14} className="text-amber-600" />
                <span className="tracking-wide">Handcrafted by Generational Ateliers of Delhi</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif text-stone-950 tracking-tight leading-[1.14]">
                Experience Royal Ethnic Couture in Your Living Room,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-rose-700 to-amber-800">
                  Before Paying A Single Rupee.
                </span>
              </h1>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                Pure handwoven Banarasi Katan Silk from Chandni Chowk, Groom's raw silk bandhgalas from South Ex, and Chikankari anarkalis from Lajpat Nagar. Select up to 10 outfits to try with your family, jewelry, and shoes at home. Keep only what touches your heart — our delivery saathi returns the rest instantly.
              </p>

              {/* Call-to-action buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="#clothing-catalog"
                  data-cursor="trial"
                  className="px-7 py-4 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-stone-900/20 transition active:scale-95 flex items-center gap-2.5 border border-stone-800 hover:border-amber-400"
                >
                  <ShoppingBag size={18} className="text-amber-400" />
                  <span>Curate ₹0 Trial Box (Up to 10 Clothes)</span>
                  <ArrowRight size={16} />
                </a>

                <a
                  href="#heritage-dukaans"
                  data-cursor="shop"
                  className="px-6 py-4 rounded-2xl bg-white hover:bg-amber-50/50 border border-stone-300 hover:border-amber-400 text-stone-900 font-bold text-xs sm:text-sm shadow-sm transition flex items-center gap-2"
                >
                  <Store size={17} className="text-amber-600" />
                  <span>Explore Iconic Dukaans</span>
                </a>
              </div>

              {/* Verified Trust Badges with Styled Dual-Tone Lucide Icons */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-stone-200/80 shadow-xs">
                  <LucidIcon icon={ShieldCheck} variant="gold" size="sm" />
                  <span className="text-[11px] font-bold text-stone-800 leading-tight">100% Genuine Handlooms</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-stone-200/80 shadow-xs">
                  <LucidIcon icon={Truck} variant="emerald" size="sm" />
                  <span className="text-[11px] font-bold text-stone-800 leading-tight">Same-Day Delivery (8-10 km)</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-stone-200/80 shadow-xs">
                  <LucidIcon icon={Sparkles} variant="rose" size="sm" />
                  <span className="text-[11px] font-bold text-stone-800 leading-tight">Family Mirror Fitting</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-stone-200/80 shadow-xs">
                  <LucidIcon icon={RotateCcw} variant="saffron" size="sm" />
                  <span className="text-[11px] font-bold text-stone-800 leading-tight">₹0 Advance & Return</span>
                </div>
              </div>
            </div>

            {/* Right Lookbook Product Cards Mosaic */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              
              {/* Product Preview Card 1 - Banarasi Silk */}
              <div
                onClick={() => onOpenDetailsModal(garments[0])}
                data-cursor="view"
                className="group relative rounded-3xl overflow-hidden bg-white border border-amber-200/80 shadow-lg hover:shadow-2xl transition cursor-pointer transform hover:-translate-y-1 duration-300"
              >
                <div className="aspect-[3/4] overflow-hidden bg-stone-100 relative">
                  <img
                    src={garments[0]?.images[0]}
                    alt={garments[0]?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-md text-amber-300 text-[10px] font-serif font-bold px-2.5 py-1 rounded-lg border border-amber-400/30 shadow flex items-center gap-1">
                    <Crown size={11} className="text-amber-400" />
                    <span>Pure Katan Silk</span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 text-stone-900 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow flex items-center gap-1">
                    <Eye size={12} className="text-amber-600" />
                    <span>Quick View</span>
                  </div>
                </div>
                <div className="p-4 space-y-1.5">
                  <span className="text-[10px] text-stone-500 font-semibold block truncate">
                    Chandni Chowk • Meena Vastra
                  </span>
                  <h4 className="text-xs font-bold text-stone-900 truncate">
                    {garments[0]?.title}
                  </h4>
                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="text-sm font-extrabold text-stone-900">₹{garments[0]?.price.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] line-through text-stone-400">₹{garments[0]?.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">41% OFF</span>
                  </div>
                </div>
              </div>

              {/* Product Preview Card 2 - Anarkali Set */}
              <div
                onClick={() => onOpenDetailsModal(garments[1])}
                data-cursor="view"
                className="group relative rounded-3xl overflow-hidden bg-white border border-amber-200/80 shadow-lg hover:shadow-2xl transition cursor-pointer transform hover:-translate-y-1 duration-300 mt-6"
              >
                <div className="aspect-[3/4] overflow-hidden bg-stone-100 relative">
                  <img
                    src={garments[1]?.images[0]}
                    alt={garments[1]?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-900/85 backdrop-blur-md text-emerald-200 text-[10px] font-serif font-bold px-2.5 py-1 rounded-lg border border-emerald-400/30 shadow flex items-center gap-1">
                    <Gem size={11} className="text-emerald-300" />
                    <span>Chanderi Weave</span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 text-stone-900 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow flex items-center gap-1">
                    <Eye size={12} className="text-amber-600" />
                    <span>Quick View</span>
                  </div>
                </div>
                <div className="p-4 space-y-1.5">
                  <span className="text-[10px] text-stone-500 font-semibold block truncate">
                    Lajpat Nagar • Kashish Boutique
                  </span>
                  <h4 className="text-xs font-bold text-stone-900 truncate">
                    {garments[1]?.title}
                  </h4>
                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="text-sm font-extrabold text-stone-900">₹{garments[1]?.price.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] line-through text-stone-400">₹{garments[1]?.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">42% OFF</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. CURATED COUTURE CATEGORIES WITH STYLED LUCIDE ICONS    */}
      {/* ======================================================== */}
      <section className="py-8 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Crown size={16} className="text-amber-600" />
              <h3 className="text-sm font-serif font-extrabold uppercase tracking-wider text-stone-900">
                Explore by Category
              </h3>
            </div>
            <span className="text-xs text-stone-500">Pick any combination for home fitting</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const IconComp = cat.icon;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedShopFilter('All');
                    setActiveTab('all');
                    const el = document.getElementById('clothing-catalog');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`flex flex-col items-center text-center p-3.5 rounded-2xl transition duration-200 border text-xs font-bold group ${
                    isSelected
                      ? 'bg-gradient-to-b from-stone-900 to-stone-950 text-white border-amber-500 shadow-md ring-2 ring-amber-400/40'
                      : 'bg-[#FBF9F5] hover:bg-white text-stone-800 border-stone-200 hover:border-amber-300 shadow-xs'
                  }`}
                >
                  <LucidIcon
                    icon={IconComp}
                    variant={cat.variant}
                    size="md"
                    className="mb-2 group-hover:scale-110 transition duration-300"
                  />
                  <span className="line-clamp-1 text-xs font-serif font-semibold">{cat.label}</span>
                  <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-amber-300' : 'text-stone-400'}`}>
                    {cat.count} Outfits
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. MAIN DESIGNER CLOTHING SHOWROOM (PRODUCT GRID)        */}
      {/* ======================================================== */}
      <section id="clothing-catalog" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        
        {/* Collection Mood Tabs & Filters Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-stone-200 pb-6 mb-8">
          
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
              <Crown size={14} /> Artisanal Racks of Delhi
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-serif text-stone-950 mt-1">
              {selectedCategory === 'All' ? 'The Designer Wardrobe' : selectedCategory}
              {selectedArea !== 'All Areas' && ` in ${selectedArea}`}
              {selectedShopFilter !== 'All' && ` (${shops.find(s => s.id === selectedShopFilter)?.name})`}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Showing {filteredGarments.length} curated ensembles available for Same-Day doorstep fitting (within 8-10 km).
            </p>

            {/* Curated Mood Tabs */}
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              {[
                { id: 'all', label: 'All Collections' },
                { id: 'wedding', label: '👑 Royal Wedding Edit' },
                { id: 'handloom', label: '💎 100% Pure Silk & Handloom' },
                { id: 'groom', label: '🧥 Groom\'s Lounge' },
                { id: 'budget', label: '✨ Under ₹2,500' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setSelectedCategory('All');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeTab === tab.id
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dukaan Filter & Sort Controls */}
          <div className="flex items-center gap-2.5 flex-wrap text-xs">
            {/* Filter by Dukaan */}
            <div className="flex items-center gap-1.5 bg-white border border-stone-300 px-3.5 py-2.5 rounded-2xl text-stone-700 font-bold shadow-sm">
              <Store size={15} className="text-amber-600" />
              <select
                value={selectedShopFilter}
                onChange={(e) => setSelectedShopFilter(e.target.value)}
                className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="All">All Dukaans ({shops.length})</option>
                {shops.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.marketArea.split(',')[0]})</option>
                ))}
              </select>
            </div>

            {/* Sort by */}
            <div className="flex items-center gap-1.5 bg-white border border-stone-300 px-3.5 py-2.5 rounded-2xl text-stone-700 font-bold shadow-sm">
              <SlidersHorizontal size={15} className="text-stone-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured / Trending</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated by Customers</option>
              </select>
            </div>
          </div>
        </div>

        {/* Garments Product Grid */}
        {filteredGarments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm space-y-3">
            <ShoppingBag size={48} className="text-stone-300 mx-auto" />
            <h3 className="font-bold font-serif text-lg text-stone-900">No outfits match your active filters</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try resetting your search query or selecting "All Areas" to explore Delhi's full couture catalog.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSelectedArea('All Areas'); setSearchQuery(''); setSelectedShopFilter('All'); setActiveTab('all'); }}
              className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-md"
            >
              Reset All Filters
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
                  className="group rounded-3xl border border-stone-200/90 bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Container with Badges */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                      <img
                        src={garment.images[0]}
                        alt={garment.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />

                      {/* Top Shop Crest Tag */}
                      <div className="absolute top-3 left-3 bg-stone-950/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-xl shadow border border-white/10 flex items-center gap-1.5">
                        <Store size={12} className="text-amber-400" />
                        <span className="truncate max-w-[125px]">{garment.shopName}</span>
                      </div>

                      {/* Wishlist Heart Button */}
                      <button
                        onClick={(e) => toggleFavorite(garment.id, e)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition shadow ${
                          isFav
                            ? 'bg-rose-600 text-white'
                            : 'bg-white/80 hover:bg-white text-stone-700 hover:text-rose-600'
                        }`}
                        title="Save to wishlist"
                      >
                        <Heart size={15} className={isFav ? 'fill-white' : ''} />
                      </button>

                      {/* Fabric Authenticity Pill */}
                      <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-md text-amber-200 text-[10px] font-medium px-2.5 py-0.5 rounded-lg border border-amber-400/20">
                        {garment.fabric}
                      </div>

                      {/* Quick Inspect Button Overlay */}
                      <button
                        onClick={() => onOpenDetailsModal(garment)}
                        className="absolute bottom-3 right-3 bg-white/95 hover:bg-amber-600 hover:text-white text-stone-900 px-3 py-1 rounded-xl text-[10px] font-extrabold shadow-md transition flex items-center gap-1 active:scale-95"
                      >
                        <Eye size={12} className="text-amber-600 group-hover:text-white" />
                        <span>Inspect</span>
                      </button>
                    </div>

                    {/* Garment Details & Pricing */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold">
                        <span className="flex items-center gap-1">
                          <MapPin size={11} className="text-amber-600" />
                          {garment.shopArea}
                        </span>
                        <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                          <Star size={12} className="fill-amber-500 text-amber-500" /> {garment.rating}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-stone-900 leading-snug line-clamp-2 font-serif">
                        {garment.title}
                      </h3>

                      {/* Price with Strike-through and Discount */}
                      <div className="flex items-baseline gap-2 pt-0.5">
                        <span className="text-base font-extrabold text-stone-950 font-serif">
                          ₹{garment.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs line-through text-stone-400">
                          ₹{garment.originalPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {Math.round(((garment.originalPrice - garment.price) / garment.originalPrice) * 100)}% OFF
                        </span>
                      </div>

                      {/* Product Sales Metric (User Request) */}
                      <div className="flex items-center justify-between text-[10px] font-bold py-1 px-2 rounded-lg bg-amber-500/10 border border-amber-400/20 text-amber-900">
                        <span className="flex items-center gap-1">
                          <TrendingUp size={11} className="text-amber-600" />
                          <span>{garment.unitsSold} Bika (Sold)</span>
                        </span>
                        <span className="text-emerald-700 font-extrabold">
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

                  {/* Actions: Inspect Fabric & Add to ₹0 Trial Bag */}
                  <div className="p-4 pt-0 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onOpenDetailsModal(garment)}
                        className="py-2.5 px-2 rounded-xl border border-stone-200 hover:border-amber-500 bg-stone-50 hover:bg-amber-50/50 text-stone-900 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
                      >
                        <Eye size={14} className="text-amber-600" />
                        <span>Fabric Detail</span>
                      </button>

                      <button
                        onClick={() => onAddToTrial(garment)}
                        disabled={isInTrial}
                        data-cursor="trial"
                        className={`py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md active:scale-95 ${
                          isInTrial
                            ? 'bg-emerald-700 text-white'
                            : 'bg-stone-900 hover:bg-amber-600 text-white shadow-stone-900/20'
                        }`}
                      >
                        {isInTrial ? (
                          <>
                            <CheckCircle2 size={14} className="text-emerald-300" />
                            <span>In Bag ✓</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={14} className="text-amber-400" />
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
      </section>

      {/* ======================================================== */}
      {/* 6. THE RIVAAT COUTURE CONCIERGE EXPERIENCE               */}
      {/* ======================================================== */}
      <section className="py-14 bg-gradient-to-b from-[#F7F2EA] to-[#FBF9F5] border-t border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">
              <Crown size={14} /> The Royal Fitting Experience
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-serif text-stone-950">
              How Rivaat Doorstep Trial Works
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              No advance deposits. No courier returns. Try up to 10 garments in your bedroom mirror before deciding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-3.5 hover:shadow-md transition">
              <LucidIcon icon={ShoppingBag} variant="gold" size="lg" glow />
              <h3 className="font-bold font-serif text-base text-stone-950">1. Select Up to 10 Outfits</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Mix and match Banarasi sarees, Nehru jackets, and Anarkalis from any Chandni Chowk, Lajpat Nagar, or South Ex shop into 1 single bag.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-3.5 hover:shadow-md transition">
              <LucidIcon icon={Truck} variant="emerald" size="lg" glow />
              <h3 className="font-bold font-serif text-base text-stone-950">2. Same-Day Doorstep Arrival</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Guaranteed Same-Day delivery when delivery location and shop are within ~8-10 km. For distances exceeding 10 km, a 2-day delivery window applies.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-3.5 hover:shadow-md transition">
              <LucidIcon icon={Sparkles} variant="rose" size="lg" glow />
              <h3 className="font-bold font-serif text-base text-stone-950">3. Family Mirror Fitting</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Take your time trying the clothes in front of your mirror with family, real wedding jewelry, and shoes. Zero showroom pressure.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-3.5 hover:shadow-md transition">
              <LucidIcon icon={CreditCard} variant="saffron" size="lg" glow />
              <h3 className="font-bold font-serif text-base text-stone-950">4. Spot Settlement</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Keep the outfits you love and pay on the spot via UPI, Card machine, or Cash. Our rider packs the rest and returns them to shops instantly!
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. ICONIC HERITAGE DUKAANS OF DELHI                      */}
      {/* ======================================================== */}
      <section id="heritage-dukaans" className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
                <Store size={15} /> Generational Master Weavers
              </div>
              <h2 className="text-2xl sm:text-4xl font-black font-serif text-stone-950 mt-1">
                Iconic Heritage Dukaans of Delhi
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Generational shops trusted for 30+ years. Every garment is inspected and packed fresh for your trial.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shops.map((shop) => (
              <div
                key={shop.id}
                data-cursor="shop"
                className="bg-[#FBF9F5] rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-40 overflow-hidden bg-stone-200">
                    <img
                      src={shop.bannerImage}
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-3 left-3 flex items-center gap-2.5">
                      <img
                        src={shop.avatarImage}
                        alt={shop.ownerName}
                        className="w-10 h-10 rounded-xl object-cover border-2 border-amber-300 shadow"
                      />
                      <div className="text-white">
                        <span className="text-[11px] font-bold block leading-tight">{shop.ownerName}</span>
                        <span className="text-[9px] text-amber-300 font-medium">Est. {shop.estSince}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-stone-900 text-sm font-serif">{shop.name}</span>
                      <span className="flex items-center gap-1 text-amber-600 font-bold text-xs">
                        <Star size={13} className="fill-amber-500 text-amber-500" /> {shop.rating}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-500 flex items-center gap-1">
                      <MapPin size={12} className="text-amber-600 flex-shrink-0" />
                      <span className="truncate">{shop.marketArea}</span>
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {shop.category.map((cat, i) => (
                        <span key={i} className="text-[9px] font-semibold bg-white border border-stone-200 text-stone-700 px-2 py-0.5 rounded-full">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => {
                      setSelectedShopFilter(shop.id);
                      setSelectedCategory('All');
                      setActiveTab('all');
                      const el = document.getElementById('clothing-catalog');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                  >
                    <span>Browse {shop.name.split(' ')[0]}'s Rack</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. CLIENT WEDDING REVIEWS & TESTIMONIALS                 */}
      {/* ======================================================== */}
      <section className="py-14 bg-[#FBF9F5] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-1 text-amber-500 mb-2">
              <Star size={16} className="fill-amber-400" />
              <Star size={16} className="fill-amber-400" />
              <Star size={16} className="fill-amber-400" />
              <Star size={16} className="fill-amber-400" />
              <Star size={16} className="fill-amber-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-stone-950">
              Loved by Delhi NCR Families
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Real stories from brides, grooms, and parents who tried clothes at home for big occasions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-3">
              <p className="text-xs text-stone-700 italic leading-relaxed">
                "Trying 4 different Banarasi sarees with my mother in our living room was a dream. She paired her actual antique gold necklace with each saree before we paid. No traffic, no crowded Chandni Chowk lanes!"
              </p>
              <div className="pt-2 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                  PM
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-900 block">Pooja Malhotra</span>
                  <span className="text-[10px] text-stone-400">Greater Kailash, New Delhi</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-3">
              <p className="text-xs text-stone-700 italic leading-relaxed">
                "Needed a raw silk Nehru jacket for my cousin's sangeet. The Rivaat rider arrived in 38 minutes with 3 sizes from Royal Heritage South Ex. Kept size 40 and paid with Card machine on the spot!"
              </p>
              <div className="pt-2 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                  RK
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-900 block">Rohan Kapoor</span>
                  <span className="text-[10px] text-stone-400">Defence Colony, New Delhi</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm space-y-3">
              <p className="text-xs text-stone-700 italic leading-relaxed">
                "The fabric quality is genuine silk marked. What online platforms sell as silk is usually polyester, but Rivaat connects directly with authentic Chandni Chowk dukaans. Outstanding service!"
              </p>
              <div className="pt-2 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                  SA
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-900 block">Sunita Aggarwal</span>
                  <span className="text-[10px] text-stone-400">Noida Sector 50</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. PARTNER DUKAAN & DELIVERY PORTAL ACCESS STRIP        */}
      {/* ======================================================== */}
      <section className="py-10 bg-stone-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-wider block">
              Business Partner Portals
            </span>
            <h3 className="text-xl font-bold font-serif text-white">
              Are You a Local Dukaan Owner or Delivery Partner?
            </h3>
            <p className="text-xs text-stone-400">
              Digitize your shop rack with instant catalog sync or manage multi-stop delivery routes.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <button
              onClick={() => {
                setSelectedRole('shopkeeper');
                setAuthMode('login');
                setShowAuthModal(true);
              }}
              data-cursor="shop"
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg transition"
            >
              <Store size={16} className="text-stone-950" />
              <span>Shop Owner Portal</span>
            </button>

            <button
              onClick={() => {
                setSelectedRole('delivery');
                setAuthMode('login');
                setShowAuthModal(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition"
            >
              <Bike size={16} />
              <span>Delivery Saathi Portal</span>
            </button>

            <button
              onClick={() => handleFastDemoLogin('customer')}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <span>⚡ Aarav Sharma Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 10. LUXURY FOOTER                                        */}
      {/* ======================================================== */}
      <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-500 flex items-center justify-center text-stone-950 shadow">
                  <Crown size={20} className="text-amber-200" />
                </div>
                <span className="text-white font-bold font-serif text-xl tracking-tight">Rivaat</span>
              </div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Reviving India's generational retail dukaans through Same-Day doorstep trials (8-10 km), family fitting mirrors, and instant spot billing.
              </p>
            </div>

            <div>
              <h4 className="text-white font-serif font-bold text-xs uppercase tracking-wider mb-3">Iconic Bazaars</h4>
              <ul className="space-y-2 text-[11px] text-stone-400">
                <li>Chandni Chowk Sarees & Lehengas</li>
                <li>Lajpat Nagar Central Market</li>
                <li>South Extension Menswear Lounge</li>
                <li>Karol Bagh Silk Sutra</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-serif font-bold text-xs uppercase tracking-wider mb-3">Our Guarantees</h4>
              <ul className="space-y-2 text-[11px] text-stone-400">
                <li className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-amber-400" /> 100% Certified Pure Silk</li>
                <li className="flex items-center gap-1.5"><Truck size={13} className="text-emerald-400" /> Same-Day Delivery (8-10 km)</li>
                <li className="flex items-center gap-1.5"><CreditCard size={13} className="text-sky-400" /> Spot Payment via POS/UPI</li>
                <li className="flex items-center gap-1.5"><RotateCcw size={13} className="text-rose-400" /> Zero Pressure Home Fitting</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-serif font-bold text-xs uppercase tracking-wider mb-3">Partner Access</h4>
              <div className="space-y-2">
                <button
                  onClick={() => { setSelectedRole('shopkeeper'); setAuthMode('login'); setShowAuthModal(true); }}
                  className="block text-amber-400 hover:underline"
                >
                  Register Dukaan with Rivaat →
                </button>
                <button
                  onClick={() => { setSelectedRole('delivery'); setAuthMode('login'); setShowAuthModal(true); }}
                  className="block text-sky-400 hover:underline"
                >
                  Join as Delivery Saathi Rider →
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
            <div>
              © {new Date().getFullYear()} Rivaat (रिवात) Technologies. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Made with pride for Indian Handloom Weavers & Local Dukaans</span>
            </div>
          </div>

        </div>
      </footer>

      {/* ======================================================== */}
      {/* 11. FLOATING CONCIERGE TRIAL CART BAR                    */}
      {/* ======================================================== */}
      {trialItems.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4 animate-fade-in">
          <div className="bg-stone-950/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-3xl border border-amber-500/40 shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow flex-shrink-0">
                <ShoppingBag size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white font-serif">
                    {trialItems.length} of 10 Outfits in Trial Bag
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    ₹0 Advance
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Ready for Same-Day doorstep fitting (8-10 km radius)
                </p>
              </div>
            </div>

            <button
              onClick={onOpenTrialCart}
              data-cursor="trial"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-extrabold text-xs shadow-lg transition active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Book Trial</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 12. ROLE-BASED AUTH MODAL (LOGIN & REGISTRATION)         */}
      {/* ======================================================== */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200">
            
            {/* Modal Header */}
            <div className={`p-6 text-white flex items-center justify-between ${
              selectedRole === 'customer' 
                ? 'bg-gradient-to-r from-amber-700 via-stone-900 to-amber-800' 
                : selectedRole === 'shopkeeper'
                ? 'bg-gradient-to-r from-stone-900 via-stone-950 to-neutral-900'
                : 'bg-gradient-to-r from-sky-700 via-blue-700 to-sky-800'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-serif font-black text-xl shadow-md flex-shrink-0">
                  {selectedRole === 'customer' ? (
                    <ShoppingBag size={22} className="text-amber-300" />
                  ) : selectedRole === 'shopkeeper' ? (
                    <Store size={22} className="text-amber-400" />
                  ) : (
                    <Bike size={22} className="text-sky-200" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold font-serif text-lg text-white">
                    {selectedRole === 'customer'
                      ? (authMode === 'login' ? 'Customer Login' : 'New Customer Registration')
                      : selectedRole === 'shopkeeper'
                      ? (authMode === 'login' ? 'Shop Owner Login' : 'Register Local Dukaan')
                      : (authMode === 'login' ? 'Delivery Saathi Login' : 'Register New Rider')}
                  </h3>
                  <p className="text-xs text-white/80">
                    {selectedRole === 'customer'
                      ? '₹0 Doorstep Home Trial • Try Before You Buy'
                      : selectedRole === 'shopkeeper'
                      ? 'Local Merchant Portal • Sub-0.1ms Catalog Sync'
                      : 'Delivery Partner Shift • Spot POS Billing'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {/* Role Selector Tabs inside Modal */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-stone-100 rounded-2xl border border-stone-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSelectedRole('customer')}
                  className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                    selectedRole === 'customer'
                      ? 'bg-white text-stone-950 shadow-sm border border-stone-200'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <User size={14} className={selectedRole === 'customer' ? 'text-amber-600' : ''} />
                  <span>Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('shopkeeper')}
                  className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                    selectedRole === 'shopkeeper'
                      ? 'bg-white text-stone-950 shadow-sm border border-stone-200'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <Store size={14} className={selectedRole === 'shopkeeper' ? 'text-amber-600' : ''} />
                  <span>Shop Owner</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('delivery')}
                  className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                    selectedRole === 'delivery'
                      ? 'bg-white text-stone-950 shadow-sm border border-stone-200'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <Bike size={14} className={selectedRole === 'delivery' ? 'text-sky-600' : ''} />
                  <span>Delivery Boy</span>
                </button>
              </div>

              {/* Auth Mode Toggle (Login vs Register) */}
              <div className="flex rounded-2xl bg-stone-100 p-1 border border-stone-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2.5 rounded-xl transition text-center ${
                    authMode === 'login'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Already User? Log In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2.5 rounded-xl transition text-center ${
                    authMode === 'register'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  New User? Register
                </button>
              </div>

              {/* Dynamic Form based on Role & Auth Mode */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                
                {/* 1. CUSTOMER FORM */}
                {selectedRole === 'customer' && (
                  <div className="space-y-3">
                    {authMode === 'register' && (
                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={custName}
                          onChange={(e) => setCustName(e.target.value)}
                          placeholder="e.g. Aarav Sharma"
                          className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">Mobile Number (for OTP & Doorstep Delivery)</label>
                      <input
                        type="tel"
                        required
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        placeholder="+91 98201 55432"
                        className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                      />
                    </div>

                    {authMode === 'register' && (
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs font-bold text-stone-700 block mb-1">Neighborhood Area</label>
                            <select
                              value={custArea}
                              onChange={(e) => setCustArea(e.target.value)}
                              className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                              <option value="Lajpat Nagar">Lajpat Nagar</option>
                              <option value="Chandni Chowk">Chandni Chowk</option>
                              <option value="South Extension">South Extension</option>
                              <option value="Karol Bagh">Karol Bagh</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-stone-700 block mb-1">PIN Code</label>
                            <input
                              type="text"
                              value="110024"
                              readOnly
                              className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-500 font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Home Delivery Address (Where family will try)</label>
                          <textarea
                            rows={2}
                            required
                            value={custAddress}
                            onChange={(e) => setCustAddress(e.target.value)}
                            placeholder="House No, Street, Landmark..."
                            className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-stone-700">One-Time Password / Security PIN</label>
                        <span className="text-[10px] text-amber-600 font-bold">Demo PIN: 4829</span>
                      </div>
                      <input
                        type="password"
                        required
                        value={custPin}
                        onChange={(e) => setCustPin(e.target.value)}
                        placeholder="4829"
                        maxLength={4}
                        className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono tracking-widest text-center text-sm font-bold"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-lg shadow-amber-600/30 transition active:scale-98 flex items-center justify-center gap-2 mt-4"
                    >
                      <span>{authMode === 'login' ? 'Log In & Open Wardrobe' : 'Register & Start ₹0 Home Trial'}</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}

                {/* 2. SHOP OWNER FORM */}
                {selectedRole === 'shopkeeper' && (
                  <div className="space-y-3">
                    {authMode === 'register' && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Shop / Dukaan Name</label>
                          <input
                            type="text"
                            required
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            placeholder="e.g. Meena Vastra"
                            className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Dukaandaar Name</label>
                          <input
                            type="text"
                            required
                            value={ownerName}
                            onChange={(e) => setOwnerName(e.target.value)}
                            placeholder="Shri Rameshwar Lal"
                            className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">Registered Shop Mobile</label>
                      <input
                        type="tel"
                        required
                        value={shopPhone}
                        onChange={(e) => setShopPhone(e.target.value)}
                        placeholder="+91 98112 45890"
                        className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                      />
                    </div>

                    {authMode === 'register' && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Market / Bazaar</label>
                          <select
                            value={shopArea}
                            onChange={(e) => setShopArea(e.target.value)}
                            className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="Chandni Chowk">Chandni Chowk</option>
                            <option value="Lajpat Nagar">Lajpat Nagar</option>
                            <option value="South Extension">South Extension</option>
                            <option value="Karol Bagh">Karol Bagh</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Primary Specialty</label>
                          <input
                            type="text"
                            value={shopCategory}
                            onChange={(e) => setShopCategory(e.target.value)}
                            placeholder="Sarees & Handlooms"
                            className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-stone-700">Merchant Password / PIN</label>
                        <span className="text-[10px] text-amber-600 font-bold">Default: ••••••••</span>
                      </div>
                      <input
                        type="password"
                        required
                        value={shopPassword}
                        onChange={(e) => setShopPassword(e.target.value)}
                        className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-2xl bg-stone-900 hover:bg-amber-600 text-white font-extrabold text-xs shadow-lg transition active:scale-98 flex items-center justify-center gap-2 mt-4"
                    >
                      <span>{authMode === 'login' ? 'Log In to Shop Owner Portal' : 'Register Shop & Start Selling'}</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}

                {/* 3. DELIVERY PARTNER FORM */}
                {selectedRole === 'delivery' && (
                  <div className="space-y-3">
                    {authMode === 'register' && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Rider Full Name</label>
                          <input
                            type="text"
                            required
                            value={riderName}
                            onChange={(e) => setRiderName(e.target.value)}
                            placeholder="e.g. Vikram Yadav"
                            className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Two-Wheeler No.</label>
                          <input
                            type="text"
                            value={vehicleNo}
                            onChange={(e) => setVehicleNo(e.target.value)}
                            placeholder="DL 3S CW 8921"
                            className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">Rider Phone / Shift Mobile</label>
                      <input
                        type="tel"
                        required
                        value={riderPhone}
                        onChange={(e) => setRiderPhone(e.target.value)}
                        placeholder="+91 98100 23456"
                        className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-stone-700">Rider Shift Passcode</label>
                        <span className="text-[10px] text-sky-600 font-bold">Demo Code: 1234</span>
                      </div>
                      <input
                        type="password"
                        required
                        value={riderPin}
                        onChange={(e) => setRiderPin(e.target.value)}
                        maxLength={4}
                        placeholder="1234"
                        className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono tracking-widest text-center text-sm font-bold"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-lg shadow-sky-600/30 transition active:scale-98 flex items-center justify-center gap-2 mt-4"
                    >
                      <span>{authMode === 'login' ? 'Log In to Rider Dashboard' : 'Join as Rivaat Saathi Rider'}</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}

              </form>

              {/* Fast 1-Click Demo Login */}
              <div className="pt-4 border-t border-stone-200">
                {selectedRole === 'customer' ? (
                  <button
                    type="button"
                    onClick={() => handleFastDemoLogin('customer')}
                    className="w-full p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl font-bold text-amber-950 text-center transition flex items-center justify-center gap-2 text-xs"
                  >
                    <User size={15} className="text-amber-700" />
                    <span>⚡ Instant 1-Click Demo Login as Aarav Sharma (Customer)</span>
                  </button>
                ) : selectedRole === 'shopkeeper' ? (
                  <button
                    type="button"
                    onClick={() => handleFastDemoLogin('shopkeeper')}
                    className="w-full p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl font-bold text-amber-950 text-center transition flex items-center justify-center gap-2 text-xs"
                  >
                    <Store size={15} className="text-amber-700" />
                    <span>⚡ Instant 1-Click Demo Login as Meena Vastra (Shop Owner)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleFastDemoLogin('delivery')}
                    className="w-full p-2.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl font-bold text-sky-950 text-center transition flex items-center justify-center gap-2 text-xs"
                  >
                    <Bike size={15} className="text-sky-700" />
                    <span>⚡ Instant 1-Click Demo Login as Vikram Yadav (Rider #104)</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
