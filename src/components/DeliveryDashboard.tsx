import React, { useState, useMemo } from 'react';
import { TrialOrder, TrialItem } from '../types';
import confetti from 'canvas-confetti';
import {
  Bike,
  MapPin,
  Phone,
  Store,
  CheckCircle,
  Clock,
  QrCode,
  Banknote,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Package,
  AlertCircle,
  CreditCard,
  Printer,
  Receipt,
  FileText,
  Check,
  Wifi,
  Tag,
  ArrowRight,
  Truck,
  Crown,
  ShoppingBag,
  DollarSign
} from 'lucide-react';

interface DeliveryDashboardProps {
  order: TrialOrder;
  onUpdateOrderDecision: (
    orderId: string,
    keptItems: TrialItem[],
    returnedItems: TrialItem[],
    totalAmount: number,
    shopSettlements?: any[]
  ) => void;
}

export const DeliveryDashboard: React.FC<DeliveryDashboardProps> = ({
  order,
  onUpdateOrderDecision,
}) => {
  // Step in delivery: 'pickup' | 'transit' | 'doorstep_decision' | 'return_to_shop' | 'completed'
  const [deliveryStep, setDeliveryStep] = useState<'pickup' | 'transit' | 'doorstep_decision' | 'return_to_shop' | 'completed'>(
    order.riderPickupConfirmed ? 'doorstep_decision' : 'pickup'
  );

  // Checked items picked from shop
  const [pickedItemIds, setPickedItemIds] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    order.items.forEach((item) => {
      init[item.id] = true;
    });
    return init;
  });

  // Doorstep decisions by rider: 'keep' | 'return'
  const [doorstepDecisions, setDoorstepDecisions] = useState<Record<string, 'keep' | 'return'>>(() => {
    const init: Record<string, 'keep' | 'return'> = {};
    order.items.forEach((item, idx) => {
      init[item.id] = idx < Math.ceil(order.items.length / 2) ? 'keep' : 'return';
    });
    return init;
  });

  // Payment State: 'cash' (Main) | 'pos_machine' | 'upi' | 'card_web'
  const [paymentMode, setPaymentMode] = useState<'cash' | 'pos_machine' | 'upi' | 'card_web'>('cash');
  const [paymentReceived, setPaymentReceived] = useState<boolean>(false);
  const [showThermalReceipt, setShowThermalReceipt] = useState<boolean>(true);

  // Compute all scheduled shops in original order (for Step 1 pickup itinerary)
  const shopsInOrder = useMemo(() => {
    const map: Record<string, { shopId: string; shopName: string; shopArea: string; items: TrialItem[] }> = {};
    order.items.forEach((item) => {
      const sId = item.shopId || 'shop-default';
      if (!map[sId]) {
        map[sId] = {
          shopId: sId,
          shopName: item.shopName || 'Local Partner Store',
          shopArea: item.shopArea || 'Delhi NCR',
          items: [],
        };
      }
      map[sId].items.push(item);
    });
    return Object.values(map);
  }, [order.items]);

  // Only items that the rider ACTUALLY picked up from shops in Step 1
  const actuallyPickedItems = useMemo(() => {
    return order.items.filter((item) => !!pickedItemIds[item.id]);
  }, [order.items, pickedItemIds]);

  // Items that were NOT picked up (remained at shop)
  const unpickedItems = useMemo(() => {
    return order.items.filter((item) => !pickedItemIds[item.id]);
  }, [order.items, pickedItemIds]);

  // Multi-shop groups containing ONLY actually picked items (for Step 3 Doorstep & Step 4 Returns)
  const shopsInPickedOrder = useMemo(() => {
    const map: Record<string, { shopId: string; shopName: string; shopArea: string; items: TrialItem[] }> = {};
    actuallyPickedItems.forEach((item) => {
      const sId = item.shopId || 'shop-default';
      if (!map[sId]) {
        map[sId] = {
          shopId: sId,
          shopName: item.shopName || 'Local Partner Store',
          shopArea: item.shopArea || 'Delhi NCR',
          items: [],
        };
      }
      map[sId].items.push(item);
    });
    return Object.values(map);
  }, [actuallyPickedItems]);

  // Compute segregated returns & payouts by shop for ACTUALLY PICKED items only
  const returnsByShop = useMemo(() => {
    const map: Record<
      string,
      {
        shopId: string;
        shopName: string;
        shopArea: string;
        returnedItems: TrialItem[];
        keptItems: TrialItem[];
        shopSubtotal: number;
        payoutDue: number;
      }
    > = {};

    actuallyPickedItems.forEach((item) => {
      const sId = item.shopId || 'shop-default';
      if (!map[sId]) {
        map[sId] = {
          shopId: sId,
          shopName: item.shopName || 'Local Partner Store',
          shopArea: item.shopArea || 'Delhi NCR',
          returnedItems: [],
          keptItems: [],
          shopSubtotal: 0,
          payoutDue: 0,
        };
      }
      if (doorstepDecisions[item.id] === 'return') {
        map[sId].returnedItems.push(item);
      } else {
        map[sId].keptItems.push(item);
        map[sId].shopSubtotal += item.price;
        map[sId].payoutDue += item.price * 0.945; // 94.5% merchant payout (Only 5.5% Rivaat commission)
      }
    });
    return Object.values(map);
  }, [actuallyPickedItems, doorstepDecisions]);

  const togglePicked = (id: string) => {
    setPickedItemIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const setItemDecision = (id: string, decision: 'keep' | 'return') => {
    setDoorstepDecisions((prev) => ({ ...prev, [id]: decision }));
  };

  // Only actually picked items can be kept or returned by customer
  const keptItems = useMemo(() => {
    return actuallyPickedItems.filter((item) => doorstepDecisions[item.id] === 'keep');
  }, [actuallyPickedItems, doorstepDecisions]);

  const returnedItems = useMemo(() => {
    return actuallyPickedItems.filter((item) => doorstepDecisions[item.id] === 'return');
  }, [actuallyPickedItems, doorstepDecisions]);

  const totalKeptAmount = useMemo(() => {
    return keptItems.reduce((acc, curr) => acc + curr.price, 0);
  }, [keptItems]);

  // Actions
  const handleConfirmPickup = () => {
    setDeliveryStep('transit');
  };

  const handleArrivedAtDoorstep = () => {
    setDeliveryStep('doorstep_decision');
  };

  const handleFinishDoorstepCollection = () => {
    if (keptItems.length > 0 && !paymentReceived) {
      alert('Please confirm payment received before proceeding!');
      return;
    }
    const shopBreakdowns = returnsByShop.map((rb) => ({
      shopId: rb.shopId,
      shopName: rb.shopName,
      shopArea: rb.shopArea,
      keptItems: rb.keptItems,
      returnedItems: rb.returnedItems,
      shopBillAmount: rb.shopSubtotal,
      payoutAmount: rb.payoutDue,
    }));

    onUpdateOrderDecision(order.id, keptItems, returnedItems, totalKeptAmount, shopBreakdowns);
    setDeliveryStep('return_to_shop');
  };

  const handleCompleteReturnToShop = () => {
    setDeliveryStep('completed');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in font-sans">
      
      {/* ======================================================== */}
      {/* 1. TOP BOUTIQUE CONTROL BAR WITH RIDER LOGO & AVATAR     */}
      {/* ======================================================== */}
      <div className="bg-white dark:bg-[#161311] rounded-2xl border border-stone-200/90 dark:border-stone-800/80 px-4 py-2.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition-colors duration-200">
        
        {/* Left: Rider Shift Info & Assigned Zone with Avatar Logo */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-xl overflow-hidden border-2 border-sky-500 shadow-xs flex-shrink-0 bg-stone-100 dark:bg-stone-800">
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80"
                alt="Vikram Yadav"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-900" />
            </div>
            <div>
              <span className="font-bold font-serif text-stone-900 dark:text-stone-100 text-xs sm:text-sm block leading-tight">
                Vikram Yadav
              </span>
              <span className="text-[10px] text-sky-700 dark:text-sky-400 font-semibold flex items-center gap-1">
                <span>Rivaat Saathi #104</span> • <span>POS &amp; Thermal Printer Ready</span>
              </span>
            </div>
          </div>
          <span className="text-stone-300 dark:text-stone-700 hidden sm:inline">•</span>
          <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1">
            <MapPin size={12} className="text-stone-400" />
            <span>Zone: South Delhi & Central Hub (8-10 km radius)</span>
          </span>
          <span className="text-stone-300 dark:text-stone-700 hidden sm:inline">•</span>
          
          {/* Status Tag */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-bold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Doorstep Shift • Ready for Pickup</span>
          </span>
        </div>

        {/* Right: Equipment Kit Status */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 font-bold text-[11px]">
            <Printer size={12} className="text-purple-600 dark:text-purple-400" />
            <span>Portable Printer (98%)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 font-bold text-[11px]">
            <CreditCard size={12} className="text-sky-600 dark:text-sky-400" />
            <span>Wireless POS Connected</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 font-bold text-[11px]">
            <Banknote size={12} className="text-amber-600 dark:text-amber-400" />
            <span>Cash Float (₹2,500)</span>
          </span>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 2. HERO SHOWCASE BANNER (EXACT SAME AS CUSTOMER)         */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-[#1A1612] via-[#241E17] to-[#120F0D] rounded-3xl p-6 sm:p-8 text-white border border-amber-950/40 shadow-sm relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/30 flex items-center gap-1 font-serif">
                <Crown size={12} className="text-amber-400" />
                Rivaat Delivery Saathi Hub
              </span>
              <span className="text-xs text-stone-400 font-serif">Shift #412 • Same-Day Dispatch</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-white leading-tight">
              Doorstep Trial Express & Multi-Dukaan Dispatch
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
              Local dukaano se kapde collect karein, customer ke ghar par trial karwayein, spot cash/POS swipe lein, aur bache hue kapde turant respective dukaano ko return karein. Har dukaan ka stock aur bill alag segregate rehta hai.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0">
            <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/15 text-xs">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Current Target</span>
              <span className="font-bold text-amber-300 font-serif text-sm">
                Order #{order.id} • {order.customerName}
              </span>
            </div>
            <a
              href={`tel:${order.customerPhone}`}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
            >
              <Phone size={13} />
              <span>Call Customer ({order.customerPhone})</span>
            </a>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. UNIFIED 4-METRIC KPI GRID (DARK THEME SUPPORTED)      */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Shops on Route */}
        <div className="bg-white dark:bg-[#161311] p-5 rounded-2xl border border-stone-200/90 dark:border-stone-800/80 shadow-xs hover:border-amber-400/60 transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wide">
              Shops on Route
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center border border-amber-200 dark:border-amber-800/60">
              <Store size={15} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black font-serif text-stone-950 dark:text-stone-100">
              {shopsInOrder.length} Local Dukaans
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-amber-700 dark:text-amber-400">
              <span>Chandni Chowk, Lajpat & South Ex</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Picked Garments */}
        <div className="bg-white dark:bg-[#161311] p-5 rounded-2xl border border-stone-200/90 dark:border-stone-800/80 shadow-xs hover:border-amber-400/60 transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wide">
              Clothes in Bag
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/60">
              <ShoppingBag size={15} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black font-serif text-stone-950 dark:text-stone-100">
              {actuallyPickedItems.length} of {order.items.length} Picked
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
              <span>{unpickedItems.length > 0 ? `${unpickedItems.length} left safely at shop` : 'All items in bag'}</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Target Doorstep Value */}
        <div className="bg-white dark:bg-[#161311] p-5 rounded-2xl border border-stone-200/90 dark:border-stone-800/80 shadow-xs hover:border-amber-400/60 transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wide">
              Doorstep Trial Value
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center border border-sky-200 dark:border-sky-800/60">
              <DollarSign size={15} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black font-serif text-stone-950 dark:text-stone-100">
              ₹{order.items.reduce((acc, curr) => acc + curr.price, 0).toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-sky-700 dark:text-sky-400">
              <span>₹0 Advance • Pay only after trying</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Distance SLA Target */}
        <div className="bg-white dark:bg-[#161311] p-5 rounded-2xl border border-stone-200/90 dark:border-stone-800/80 shadow-xs hover:border-amber-400/60 transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wide">
              Delivery SLA Target
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center border border-purple-200 dark:border-purple-800/60">
              <Truck size={15} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-black font-serif text-stone-950 dark:text-stone-100">
              Same-Day (8-10 km)
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-purple-700 dark:text-purple-400">
              <span>Slot: {order.slot}</span>
            </div>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 4. UNIFIED CAPSULE STEPPER BAR (MATCHING CUSTOMER TABS)  */}
      {/* ======================================================== */}
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold flex-wrap">
          
          <button
            onClick={() => setDeliveryStep('pickup')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              deliveryStep === 'pickup'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-stone-900 dark:bg-stone-800 text-white text-[10px] flex items-center justify-center">1</span>
            <span>Multi-Shop Pickup ({shopsInOrder.length} Shops)</span>
          </button>

          <button
            onClick={() => setDeliveryStep('transit')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              deliveryStep === 'transit'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-stone-900 dark:bg-stone-800 text-white text-[10px] flex items-center justify-center">2</span>
            <span>Ride to Customer</span>
          </button>

          <button
            onClick={() => setDeliveryStep('doorstep_decision')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              deliveryStep === 'doorstep_decision'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-stone-900 dark:bg-stone-800 text-white text-[10px] flex items-center justify-center">3</span>
            <span>Doorstep Trial & Spot Bill</span>
          </button>

          <button
            onClick={() => setDeliveryStep('return_to_shop')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              deliveryStep === 'return_to_shop'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-stone-900 dark:bg-stone-800 text-white text-[10px] flex items-center justify-center">4</span>
            <span>Return to Respective Shops</span>
          </button>

        </div>

        <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold hidden md:inline">
          Order #{order.id} • {order.customerName}
        </span>
      </div>

      {/* ======================================================== */}
      {/* STEP 1: MULTI-SHOP PICKUP ITINERARY                      */}
      {/* ======================================================== */}
      {deliveryStep === 'pickup' && (
        <div className="bg-white dark:bg-[#161311] rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 animate-fade-in">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider font-serif">
              <Store className="w-4 h-4" /> Step 1: Multi-Shop Pickup Itinerary
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-950 dark:text-stone-100 mt-1">
              Collect {order.items.length} Clothes across {shopsInOrder.length} Local Shops
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Customer ordered from multiple shops in one trial order. Visit each shop, verify the tagged garments, and pack into the Rivaat bag. If any item is not available, leave it unchecked so it won't be returned later!
            </p>
          </div>

          {/* Shop by Shop Pickup Cards with Real Shop Logos */}
          <div className="space-y-6">
            {shopsInOrder.map((shopGroup, shopIdx) => {
              const allShopItemsPicked = shopGroup.items.every((it) => pickedItemIds[it.id]);
              return (
                <div
                  key={shopGroup.shopId}
                  className="rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden bg-stone-50/50 dark:bg-stone-900/40 space-y-4 p-5"
                >
                  {/* Shop Stop Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
                    <div className="flex items-center gap-3">
                      {/* Shop Avatar Logo Thumbnail */}
                      <div className="relative w-9 h-9 rounded-xl overflow-hidden border-2 border-amber-500/80 shadow-xs flex-shrink-0 bg-stone-100 dark:bg-stone-800">
                        <img
                          src={shopGroup.items[0]?.images[0] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'}
                          alt={shopGroup.shopName}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-600 text-white font-extrabold flex items-center justify-center text-[9px] border border-white dark:border-stone-900">
                          {shopIdx + 1}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900 dark:text-stone-100 font-serif">{shopGroup.shopName}</span>
                          <span className="text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/60">
                            {shopGroup.items.length} Clothes
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-stone-400" /> {shopGroup.shopArea}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href="tel:+919811245890"
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1.5 hover:bg-stone-50 dark:hover:bg-stone-700"
                      >
                        <Phone className="w-3 h-3 text-emerald-600" /> Call Shop
                      </a>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 ${
                        allShopItemsPicked ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60' : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                      }`}>
                        {allShopItemsPicked ? '✓ Shop Packed' : 'Pending Pickup'}
                      </span>
                    </div>
                  </div>

                  {/* Clothes for this specific shop */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {shopGroup.items.map((item) => {
                      const isChecked = !!pickedItemIds[item.id];
                      return (
                        <div
                          key={item.id}
                          onClick={() => togglePicked(item.id)}
                          className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex gap-3.5 items-center ${
                            isChecked
                              ? 'border-emerald-500 bg-white shadow-sm'
                              : 'border-stone-200 bg-stone-100 opacity-70'
                          }`}
                        >
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-14 h-18 object-cover rounded-xl shadow-sm border border-stone-200"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                TAG: {shopGroup.shopName.slice(0, 4).toUpperCase()}-{item.id.slice(-2)}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-stone-900 truncate mt-1 font-serif">{item.title}</h4>
                            <p className="text-[11px] text-stone-500">
                              Size: <strong>{item.selectedSize}</strong> • ₹{item.price.toLocaleString('en-IN')}
                            </p>
                            {!isChecked && (
                              <span className="text-[10px] font-bold text-stone-500 block mt-0.5">
                                Left at shop (Will NOT be brought to customer)
                              </span>
                            )}
                          </div>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border ${
                            isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 bg-white'
                          }`}>
                            {isChecked && <CheckCircle className="w-4 h-4" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-xs text-stone-500">
              Total <strong className="text-stone-900 font-extrabold">{actuallyPickedItems.length}</strong> of {order.items.length} clothes collected in bag across {shopsInPickedOrder.length} shops.
              {unpickedItems.length > 0 && (
                <span className="text-amber-800 font-semibold ml-1.5 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 inline-block">
                  ⚠️ {unpickedItems.length} uncollected items stay at store (will NOT show in returns)
                </span>
              )}
            </span>
            <button
              onClick={handleConfirmPickup}
              disabled={actuallyPickedItems.length === 0}
              className={`px-6 py-3 rounded-2xl font-bold text-xs shadow-lg flex items-center gap-2 transition ${
                actuallyPickedItems.length > 0
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
            >
              <span>
                {actuallyPickedItems.length > 0
                  ? `Confirm ${actuallyPickedItems.length} Picked Clothes & Ride to Customer`
                  : 'Select At Least 1 Item to Proceed'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 2: TRANSIT TO CUSTOMER                              */}
      {/* ======================================================== */}
      {deliveryStep === 'transit' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6 animate-fade-in text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-md">
            <Bike className="w-8 h-8 animate-bounce" />
          </div>

          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider font-serif">
              Multi-Shop Wardrobe in Transit
            </span>
            <h2 className="text-2xl font-bold font-serif text-stone-900 mt-1">
              Heading to {order.customerName}’s Home
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              📍 {order.deliveryAddress}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-left text-xs text-amber-900 space-y-1">
            <span className="font-bold block font-serif">Customer Note for Trial:</span>
            <p className="italic text-stone-700">"{order.familyNote || 'Family checking quality and fit'}"</p>
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <a
              href={`tel:${order.customerPhone}`}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold flex items-center gap-2 hover:bg-stone-50"
            >
              <Phone className="w-3.5 h-3.5 text-stone-600" /> Call Customer
            </a>
            <button
              onClick={handleArrivedAtDoorstep}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/30 flex items-center gap-2"
            >
              <span>Mark: Arrived at Doorstep 📍</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 3: DOORSTEP DECISION & SHOP-BRANDED THERMAL BILL   */}
      {/* ======================================================== */}
      {deliveryStep === 'doorstep_decision' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider font-serif">
                <Printer className="w-4 h-4" /> Step 3: Spot Bill Generator with Shop Branding
              </div>
              <h2 className="text-xl font-bold font-serif text-stone-900 mt-1">
                Mark Choices & Print Bill for {order.customerName}
              </h2>
              <p className="text-xs text-stone-500">
                Customer is trying clothes at home. Mark Keep or Return. The bill prominently lists the shop name for each item so customer remembers and can reorder!
              </p>
            </div>

            <div className="flex items-center gap-3 bg-stone-100 p-2.5 rounded-2xl border border-stone-200 text-xs flex-shrink-0">
              <div>
                <span className="text-stone-400 block text-[10px]">Kept by Customer</span>
                <span className="font-bold text-emerald-600 text-sm">{keptItems.length} Clothes</span>
              </div>
              <div className="w-[1px] h-6 bg-stone-300" />
              <div>
                <span className="text-stone-400 block text-[10px]">Returning to Shops</span>
                <span className="font-bold text-amber-600 text-sm">{returnedItems.length} Clothes</span>
              </div>
              {unpickedItems.length > 0 && (
                <>
                  <div className="w-[1px] h-6 bg-stone-300" />
                  <div>
                    <span className="text-stone-400 block text-[10px]">Remaining at Stores</span>
                    <span className="font-bold text-stone-500 text-sm">{unpickedItems.length} Clothes</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Garments List Grouped by Shop (STRICTLY Picked Items Only) */}
          <div className="space-y-6">
            {shopsInPickedOrder.map((shopGroup) => (
              <div key={shopGroup.shopId} className="space-y-3">
                <div className="flex items-center justify-between bg-stone-100 px-3.5 py-2 rounded-xl border border-stone-200">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-bold text-stone-900 font-serif">
                      From: {shopGroup.shopName} ({shopGroup.shopArea})
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-600 font-bold bg-white px-2 py-0.5 rounded-md border border-stone-200">
                    {shopGroup.items.length} in Delivery Bag
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {shopGroup.items.map((item) => {
                    const isKept = doorstepDecisions[item.id] === 'keep';
                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border-2 transition flex gap-3.5 items-center ${
                          isKept
                            ? 'border-emerald-500 bg-emerald-50/40'
                            : 'border-amber-300 bg-amber-50/30'
                        }`}
                      >
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-16 h-20 object-cover rounded-xl shadow-sm border border-stone-200"
                        />

                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-stone-700 bg-white px-2 py-0.5 rounded border border-stone-200">
                            TAG: {shopGroup.shopName.slice(0, 4).toUpperCase()}-{item.id.slice(-2)}
                          </span>
                          <h4 className="text-xs font-bold text-stone-900 truncate mt-1 font-serif">{item.title}</h4>
                          <p className="text-[11px] text-stone-500">
                            Size: {item.selectedSize} • Fabric: {item.fabric}
                          </p>
                          <p className="text-sm font-extrabold text-stone-900 mt-1 font-serif">
                            ₹{item.price.toLocaleString('en-IN')}
                          </p>

                          {/* Decision buttons */}
                          <div className="mt-2.5 flex gap-2">
                            <button
                              type="button"
                              onClick={() => setItemDecision(item.id, 'keep')}
                              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                                isKept
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-white border border-stone-300 text-stone-600 hover:border-emerald-500'
                              }`}
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Customer Kept
                            </button>

                            <button
                              type="button"
                              onClick={() => setItemDecision(item.id, 'return')}
                              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                                !isKept
                                  ? 'bg-amber-600 text-white shadow-sm'
                                  : 'bg-white border border-stone-300 text-stone-600 hover:border-amber-500'
                              }`}
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Returning
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Banner clarifying unpicked items stayed at stores */}
          {unpickedItems.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>{unpickedItems.length} uncollected garment(s)</strong> were not picked up in Step 1 and remained at store inventory. They are excluded from trial and returns.
                </span>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full border border-amber-200 self-start sm:self-auto">
                Not In Bag ✓
              </span>
            </div>
          )}

          {/* Spot Bill Generator Action & Thermal Receipt Display */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-300 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-stone-900 block font-serif">
                  Rivaat Multi-Shop Thermal Bill Generator (Machine #POS-104)
                </span>
                <span className="text-[11px] text-stone-500">
                  Itemized by local shop names so customer knows where each cloth was bought.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowThermalReceipt(!showThermalReceipt)}
              className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition flex items-center gap-1.5 whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" />
              {showThermalReceipt ? 'Hide Printed Receipt' : '🖨️ View Printed Multi-Shop Receipt'}
            </button>
          </div>

          {/* OFFICIAL THERMAL PRINTED RECEIPT WITH SHOP BRANDING */}
          {showThermalReceipt && (
            <div className="p-6 bg-stone-100 rounded-3xl border-2 border-dashed border-stone-400 max-w-lg mx-auto font-mono text-xs space-y-3 shadow-inner">
              <div className="text-center border-b border-stone-300 pb-2">
                <h3 className="font-black text-sm text-stone-900">RIVAAT TECHNOLOGIES</h3>
                <p className="text-[10px] text-stone-500">Aapki Local Dukaan, Ghar Par • Doorstep Trial & Buy</p>
                <p className="text-[10px] text-stone-500">INVOICE: #{order.id}-POS • GSTIN: 07AAACR9214L1Z3</p>
                <p className="text-[10px] text-stone-400">Date: {new Date().toLocaleDateString('en-IN')} {new Date().toLocaleTimeString('en-IN')}</p>
              </div>

              <div className="text-[11px] space-y-0.5 border-b border-stone-300 pb-2">
                <p><strong>Customer:</strong> {order.customerName}</p>
                <p><strong>Address:</strong> {order.deliveryAddress}</p>
                <p><strong>Rider Agent:</strong> {order.riderName}</p>
              </div>

              {/* Shop by Shop Breakdown on Receipt */}
              <div className="space-y-3 py-1">
                {returnsByShop.map((shopData) => (
                  <div key={shopData.shopId} className="space-y-1">
                    <div className="bg-stone-200/80 p-1 font-bold text-[11px] text-stone-900 flex justify-between">
                      <span>🏪 {shopData.shopName.toUpperCase()}</span>
                      <span className="text-[10px] text-stone-600">({shopData.shopArea})</span>
                    </div>

                    {shopData.keptItems.length > 0 ? (
                      shopData.keptItems.map((item, i) => (
                        <div key={item.id} className="flex justify-between text-[11px] text-stone-800 pl-2">
                          <span className="truncate max-w-[260px]">{i + 1}. {item.title} ({item.selectedSize})</span>
                          <span>₹{item.price}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-stone-400 italic pl-2">No items kept from this store</p>
                    )}

                    <div className="text-right text-[10px] font-bold text-stone-700 pr-1">
                      Shop Subtotal: ₹{shopData.shopSubtotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-b border-stone-300 py-2 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Total Clothes Kept:</span>
                  <span className="font-bold">{keptItems.length} items</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Total Clothes Returned:</span>
                  <span>{returnedItems.length} items (Routing back to shops)</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-stone-900 pt-1 border-t border-stone-300">
                  <span>TOTAL AMOUNT PAYABLE:</span>
                  <span>₹{totalKeptAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="text-center pt-2 text-[10px] text-stone-600 leading-relaxed">
                *** THANK YOU FOR SUPPORTING LOCAL MERCHANTS! ***
                <br />
                <strong>Did you love this fabric?</strong>
                <br />
                Open Rivaat app & search for these shops to order directly from them again!
              </div>
            </div>
          )}

          {/* Payment Collection Section */}
          <div className="p-5 sm:p-6 rounded-3xl bg-stone-900 text-white space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-stone-800 pb-3">
              <div>
                <span className="text-xs text-stone-400">Total Clothes Kept: {keptItems.length} across {shopsInOrder.length} shops</span>
                <div className="text-base font-bold text-white font-serif">
                  Payment Collection by Delivery Partner
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif">
                  ₹{totalKeptAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Payment Options */}
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-2">
                Select Doorstep Payment Method (Mainly Cash & Portable Card Machine)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                {/* 1. Cash */}
                <button
                  type="button"
                  onClick={() => setPaymentMode('cash')}
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 transition text-left ${
                    paymentMode === 'cash'
                      ? 'border-emerald-500 bg-emerald-600/20 text-white ring-1 ring-emerald-500'
                      : 'border-stone-700 bg-stone-800/40 text-stone-400 hover:border-stone-600'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">💵 Cash in Hand (Main Mode)</span>
                    <span className="text-[11px] text-stone-400 block mt-0.5">
                      Customer pays cash. Rider provides change from cash float.
                    </span>
                  </div>
                </button>

                {/* 2. Portable POS Card Machine */}
                <button
                  type="button"
                  onClick={() => setPaymentMode('pos_machine')}
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 transition text-left ${
                    paymentMode === 'pos_machine'
                      ? 'border-sky-500 bg-sky-600/20 text-white ring-1 ring-sky-500'
                      : 'border-stone-700 bg-stone-800/40 text-stone-400 hover:border-stone-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">💳 Portable Card Machine (POS)</span>
                    <span className="text-[11px] text-stone-400 block mt-0.5">
                      Tap / swipe Debit/Credit Card on Rider’s portable wireless POS.
                    </span>
                  </div>
                </button>

                {/* 3. Inbuilt UPI Dashboard */}
                <button
                  type="button"
                  onClick={() => setPaymentMode('upi')}
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 transition text-left ${
                    paymentMode === 'upi'
                      ? 'border-amber-500 bg-amber-600/20 text-white ring-1 ring-amber-500'
                      : 'border-stone-700 bg-stone-800/40 text-stone-400 hover:border-stone-600'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">📱 Inbuilt UPI QR (Dashboard)</span>
                    <span className="text-[11px] text-stone-400 block mt-0.5">
                      Customer scans UPI QR code from rider dashboard.
                    </span>
                  </div>
                </button>

                {/* 4. Inbuilt Website Card Backup */}
                <button
                  type="button"
                  onClick={() => setPaymentMode('card_web')}
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 transition text-left ${
                    paymentMode === 'card_web'
                      ? 'border-purple-500 bg-purple-600/20 text-white ring-1 ring-purple-500'
                      : 'border-stone-700 bg-stone-800/40 text-stone-400 hover:border-stone-600'
                  }`}
                >
                  <Wifi className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">🌐 Website Card Backup Terminal</span>
                    <span className="text-[11px] text-stone-400 block mt-0.5">
                      Fallback: Charge card via website if card machine has no signal.
                    </span>
                  </div>
                </button>

              </div>
            </div>

            {/* Checkbox */}
            <label className="flex items-center gap-3 p-3 bg-stone-800/80 rounded-xl cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={paymentReceived}
                onChange={(e) => setPaymentReceived(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
              <span className="text-stone-200">
                I have printed the shop-branded bill, collected <strong>₹{totalKeptAmount.toLocaleString('en-IN')}</strong>, and placed the <strong>{returnedItems.length} returned garments</strong> into their respective shop tags safely.
              </span>
            </label>

            <button
              onClick={handleFinishDoorstepCollection}
              disabled={keptItems.length > 0 && !paymentReceived}
              className="w-full py-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition disabled:opacity-40"
            >
              <span>Hand Over Bill to Customer & Start Multi-Shop Return Route</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 4: MULTI-SHOP RETURN ROUTING & SEGREGATED PAYOUTS    */}
      {/* ======================================================== */}
      {deliveryStep === 'return_to_shop' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6 animate-fade-in">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider font-serif">
              <RotateCcw className="w-4 h-4" /> Step 4: Multi-Shop Return Routing & Segregated Payouts
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 mt-1">
              Return Items to Respective Stores & Hand Over Payouts
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Each store only receives their own returned garments and their exact payment. Neither rider nor shopkeeper has any confusion.
            </p>
          </div>

          {/* 3-WAY INSTANT BILL DISPATCH CONFIRMATION */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-stone-900 to-teal-950 border-2 border-emerald-500 text-white space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  ⚡ 3-Way Instant Bill Synchronized (&lt; 0.05 ms)
                </span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                Triple Broadcast Confirmed ✓
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">1. Delivery Boy POS</span>
                <span className="font-bold text-white block">🖨️ Receipt Printed &amp; Saved</span>
                <span className="text-[10px] text-emerald-400">Logged in Rider Machine #POS-104 ✓</span>
              </div>

              <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">2. Customer Device</span>
                <span className="font-bold text-white block">📱 Instant Digital Bill</span>
                <span className="text-[10px] text-emerald-400">Delivered to {order.customerName} ({order.customerPhone}) ✓</span>
              </div>

              <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">3. Participating Shops</span>
                <span className="font-bold text-white block">🏪 Instant Sales Ledgers</span>
                <span className="text-[10px] text-emerald-400">Dispatched to {shopsInPickedOrder.length} local shops ✓</span>
              </div>
            </div>
          </div>

          {/* Shop-by-Shop Segregated Return Cards */}
          <div className="space-y-4">
            {returnsByShop.map((shopReturn, idx) => (
              <div
                key={shopReturn.shopId}
                className="p-5 rounded-3xl border border-stone-200 bg-stone-50/70 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-stone-900 text-white font-bold flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-stone-900 font-serif">{shopReturn.shopName}</h3>
                      <p className="text-[11px] text-stone-500">{shopReturn.shopArea}</p>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs text-right">
                    <span className="text-stone-500 text-[10px] block">Shop Payout Due:</span>
                    <span className="font-extrabold text-emerald-700 text-sm font-serif">
                      ₹{Math.round(shopReturn.payoutDue).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Returned Clothes for this shop */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-stone-700 block">
                    Garments Returning to this Shop ({shopReturn.returnedItems.length}):
                  </span>

                  {shopReturn.returnedItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {shopReturn.returnedItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-xl bg-white border border-stone-200 flex gap-2.5 items-center"
                        >
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-10 h-14 object-cover rounded-lg border border-stone-200"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                              TAG: {shopReturn.shopName.slice(0, 4).toUpperCase()}-{item.id.slice(-2)}
                            </span>
                            <h4 className="text-xs font-bold text-stone-900 truncate mt-0.5 font-serif">{item.title}</h4>
                            <p className="text-[10px] text-stone-500">Size: {item.selectedSize} • ₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>All items from this store were kept by customer! Only payout handover required.</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Banner clarifying unpicked items stayed at stores */}
          {unpickedItems.length > 0 && (
            <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 text-xs text-stone-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <Store className="w-4 h-4 text-stone-500 flex-shrink-0" />
                <span>
                  <strong>{unpickedItems.length} uncollected garment(s)</strong> remained at shop inventory in Step 1 (not collected by rider, no return trip needed).
                </span>
              </span>
              <span className="text-[10px] font-bold text-stone-700 bg-stone-200 px-2 py-0.5 rounded-full self-start sm:self-auto">
                No Return Needed ✓
              </span>
            </div>
          )}

          <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
            <span className="text-xs text-stone-500">
              Each store owner scans digital OTP to acknowledge receipt of returned stock & funds.
            </span>
            <button
              onClick={handleCompleteReturnToShop}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirm All Shops Restocked & Complete Order</span>
            </button>
          </div>
        </div>
      )}

      {/* COMPLETED SUCCESS STATE */}
      {deliveryStep === 'completed' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-4 animate-fade-in max-w-xl mx-auto">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
            <CheckCircle className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold font-serif text-emerald-950">
            Multi-Shop Order Successfully Closed!
          </h2>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Customer kept {keptItems.length} clothes across {shopsInPickedOrder.length} local shops (Total paid ₹{totalKeptAmount.toLocaleString('en-IN')}). All {returnedItems.length} unsold clothes returned to their respective shop racks with zero mix-up!
          </p>

          <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm text-xs space-y-1 text-left">
            <div className="flex justify-between">
              <span className="text-stone-500">Your Multi-Stop Delivery Earning:</span>
              <span className="font-bold text-emerald-600">₹120 (Multi-shop bonus included)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Shops Visited & Handed Over:</span>
              <span className="font-semibold text-stone-700">{shopsInOrder.length} Local Shops</span>
            </div>
          </div>

          <button
            onClick={() => setDeliveryStep('pickup')}
            className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition"
          >
            Reset / Simulate Next Order
          </button>
        </div>
      )}

    </div>
  );
};
