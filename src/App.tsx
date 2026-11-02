import React, { useState } from 'react';
import { Garment, Shop, TrialItem, TrialOrder, UserRole, LiveSettlementEvent, ShopSettlementSummary, UserProfile } from './types';
import { MOCK_GARMENTS, MOCK_SHOPS, INITIAL_ACTIVE_ORDER } from './data/mockData';
import { Navbar } from './components/Navbar';
import { CustomerDashboard } from './components/CustomerDashboard';
import { ShopOwnerDashboard } from './components/ShopOwnerDashboard';
import { DeliveryDashboard } from './components/DeliveryDashboard';
import { GarmentDetailsModal } from './components/GarmentDetailsModal';
import { TrialCartDrawer } from './components/TrialCartDrawer';
import { DoorstepTrialModal } from './components/DoorstepTrialModal';
import { LoginPage } from './components/LoginPage';
import { LandingPage } from './components/LandingPage';
import { CustomCursor } from './components/CustomCursor';

export const App: React.FC = () => {
  // Dashboards: 'customer' | 'shopkeeper' | 'delivery'
  const [currentDashboard, setCurrentDashboard] = useState<UserRole>('customer');

  // Active Logged-in User (null by default so visitors start on the Landing Page)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoginPageOpen, setIsLoginPageOpen] = useState<boolean>(false);

  const handleUserLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentDashboard(user.role);
    if (user.role === 'shopkeeper' && user.shopId) {
      const found = shops.find((s) => s.id === user.shopId);
      if (found) setCurrentShop(found);
    }
    setIsLoginPageOpen(false);
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
  };

  // Shared Data States
  const [garments, setGarments] = useState<Garment[]>(MOCK_GARMENTS);
  const [shops] = useState<Shop[]>(MOCK_SHOPS);
  const [currentShop, setCurrentShop] = useState<Shop>(MOCK_SHOPS[0]);

  // Theme State: 'light' | 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('rivaat_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('rivaat_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Customer Cart & Orders
  const [trialItems, setTrialItems] = useState<TrialItem[]>([
    {
      ...MOCK_GARMENTS[0],
      selectedSize: 'Free Size',
      selectedColor: '#800020'
    },
    {
      ...MOCK_GARMENTS[1],
      selectedSize: 'M',
      selectedColor: '#047857'
    },
    {
      ...MOCK_GARMENTS[2],
      selectedSize: '40',
      selectedColor: '#D97706'
    }
  ]);

  const [activeOrder, setActiveOrder] = useState<TrialOrder | null>(INITIAL_ACTIVE_ORDER);

  // Multi-Shop Settlement Event State
  const [latestSettlementEvent, setLatestSettlementEvent] = useState<LiveSettlementEvent | null>({
    orderId: 'RVT-89241',
    customerName: 'Aarav Sharma & Family',
    totalAmount: 5698,
    paymentMethod: 'Cash & Card Machine',
    timestamp: Date.now(),
    shopBreakdowns: [
      {
        shopId: 'shop-1',
        shopName: 'Meena Vastra & Handlooms',
        shopArea: 'Chandni Chowk',
        keptItems: [{ ...MOCK_GARMENTS[0], selectedSize: 'Free Size', selectedColor: '#800020' }],
        returnedItems: [],
        shopBillAmount: 3499,
        payoutAmount: 3219,
      },
      {
        shopId: 'shop-2',
        shopName: 'Royal Heritage Menswear',
        shopArea: 'South Extension',
        keptItems: [{ ...MOCK_GARMENTS[2], selectedSize: '40', selectedColor: '#D97706' }],
        returnedItems: [{ ...MOCK_GARMENTS[3], selectedSize: '40', selectedColor: '#FFFFFF' }],
        shopBillAmount: 2199,
        payoutAmount: 2023,
      }
    ]
  });

  // Real-time Sub-0.1ms Sync State
  const [latestSyncNotification, setLatestSyncNotification] = useState<{
    title: string;
    shopName: string;
    latencyMs: string;
    timestamp: number;
  } | null>(null);

  // Cross-tab BroadcastChannel for multi-window ultra-low latency sync
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.BroadcastChannel) return;
    const channel = new BroadcastChannel('rivaat_live_sync');
    channel.onmessage = (event) => {
      if (event.data?.type === 'GARMENT_UPLOADED') {
        const { garment, latencyMs } = event.data;
        setGarments((prev) => [garment, ...prev]);
        setLatestSyncNotification({
          title: garment.title,
          shopName: garment.shopName,
          latencyMs: latencyMs,
          timestamp: Date.now(),
        });
      }
    };
    return () => {
      channel.close();
    };
  }, []);

  // Modals
  const [selectedGarmentForDetails, setSelectedGarmentForDetails] = useState<Garment | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isTrialRoomOpen, setIsTrialRoomOpen] = useState<boolean>(false);
  const [selectedArea, setSelectedArea] = useState<string>('All Areas');

  // Actions
  const handleAddToTrial = (garment: Garment, size?: string, color?: string) => {
    if (trialItems.some((item) => item.id === garment.id)) return;
    if (trialItems.length >= 10) {
      alert('You can select a maximum of 10 clothes for a single Home Trial session!');
      return;
    }

    const newItem: TrialItem = {
      ...garment,
      selectedSize: size || garment.sizes[0] || 'M',
      selectedColor: color || garment.colors[0] || '#B45309',
    };

    setTrialItems((prev) => [...prev, newItem]);
  };

  const handleRemoveFromTrial = (id: string) => {
    setTrialItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleBookTrial = (orderData: Partial<TrialOrder>) => {
    const newOrder: TrialOrder = {
      id: `RVT-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: orderData.customerName || 'Aarav Sharma',
      customerPhone: orderData.customerPhone || '+91 98201 55432',
      deliveryAddress: orderData.deliveryAddress || 'Flat 402, Sunshine Heights, Lajpat Nagar, New Delhi',
      slot: orderData.slot || 'Same-Day Delivery (Within 8-10 km • Today)',
      createdAt: 'Just now',
      totalItemsCount: trialItems.length,
      familyNote: orderData.familyNote,
      riderName: 'Vikram Yadav (Rivaat Saathi #104)',
      riderPhone: '+91 98100 23456',
      status: 'at_doorstep_trying',
      items: [...trialItems],
    };

    setActiveOrder(newOrder);
    setTrialItems([]);
    setIsTrialRoomOpen(true);
  };

  const handleAddGarmentByShop = (newGarment: Garment) => {
    const t0 = performance.now();
    setGarments((prev) => [newGarment, ...prev]);
    const t1 = performance.now();
    const elapsed = Math.max(0.015, t1 - t0).toFixed(3);
    newGarment.syncLatency = `${elapsed} ms`;

    setLatestSyncNotification({
      title: newGarment.title,
      shopName: newGarment.shopName,
      latencyMs: `${elapsed} ms`,
      timestamp: Date.now(),
    });

    try {
      if (typeof window !== 'undefined' && window.BroadcastChannel) {
        const channel = new BroadcastChannel('rivaat_live_sync');
        channel.postMessage({
          type: 'GARMENT_UPLOADED',
          garment: newGarment,
          latencyMs: `${elapsed} ms`,
        });
        channel.close();
      }
    } catch {
      // fallback
    }
  };

  const handleSettledOrder = (
    orderId: string,
    kept: TrialItem[],
    returned: TrialItem[],
    totalAmount: number,
    shopSettlements?: ShopSettlementSummary[]
  ) => {
    const settlementEvent: LiveSettlementEvent = {
      orderId,
      customerName: activeOrder?.customerName || 'Aarav Sharma & Family',
      totalAmount,
      paymentMethod: 'Cash & Portable Card Machine',
      timestamp: Date.now(),
      shopBreakdowns: shopSettlements || [
        {
          shopId: 'shop-1',
          shopName: 'Meena Vastra & Handlooms',
          shopArea: 'Chandni Chowk',
          keptItems: kept.filter((it) => it.shopId === 'shop-1'),
          returnedItems: returned.filter((it) => it.shopId === 'shop-1'),
          shopBillAmount: kept.filter((it) => it.shopId === 'shop-1').reduce((a, b) => a + b.price, 0),
          payoutAmount: kept.filter((it) => it.shopId === 'shop-1').reduce((a, b) => a + b.price, 0) * 0.92,
        },
        {
          shopId: 'shop-2',
          shopName: 'Royal Heritage Menswear',
          shopArea: 'South Extension',
          keptItems: kept.filter((it) => it.shopId === 'shop-2'),
          returnedItems: returned.filter((it) => it.shopId === 'shop-2'),
          shopBillAmount: kept.filter((it) => it.shopId === 'shop-2').reduce((a, b) => a + b.price, 0),
          payoutAmount: kept.filter((it) => it.shopId === 'shop-2').reduce((a, b) => a + b.price, 0) * 0.92,
        }
      ],
    };

    setLatestSettlementEvent(settlementEvent);

    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder({
        ...activeOrder,
        status: 'settled',
        keptItems: kept,
        returnedItems: returned,
        totalKeptAmount: totalAmount,
        shopSettlements: settlementEvent.shopBreakdowns,
      });
    }

    try {
      if (typeof window !== 'undefined' && window.BroadcastChannel) {
        const channel = new BroadcastChannel('rivaat_live_sync');
        channel.postMessage({
          type: 'MULTI_SHOP_SETTLEMENT',
          event: settlementEvent,
        });
        channel.close();
      }
    } catch {}
  };

  // If visitor is not logged in, show the comprehensive Rivaat Clothing Storefront directly
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] dark:bg-[#0D0B0A] text-stone-900 dark:text-stone-100 flex flex-col justify-between selection:bg-amber-600 selection:text-white transition-colors duration-200">
        <CustomCursor />
        <LandingPage
          onLogin={handleUserLogin}
          garments={garments}
          shops={shops}
          trialItems={trialItems}
          onAddToTrial={handleAddToTrial}
          onOpenDetailsModal={(garment) => setSelectedGarmentForDetails(garment)}
          onOpenTrialCart={() => setIsCartOpen(true)}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Garment Details & High-Res Inspection Modal */}
        {selectedGarmentForDetails && (
          <GarmentDetailsModal
            garment={selectedGarmentForDetails}
            onClose={() => setSelectedGarmentForDetails(null)}
            onAddToTrial={handleAddToTrial}
            isInTrial={trialItems.some((item) => item.id === selectedGarmentForDetails.id)}
          />
        )}

        {/* Trial Cart Drawer */}
        <TrialCartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={trialItems}
          onRemoveItem={handleRemoveFromTrial}
          onBookTrial={handleBookTrial}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] dark:bg-[#0D0B0A] text-stone-900 dark:text-stone-100 flex flex-col justify-between selection:bg-amber-600 selection:text-white transition-colors duration-200">
      <CustomCursor />
      
      {/* Top Header Navbar */}
      <Navbar
        currentDashboard={currentDashboard}
        trialItemsCount={trialItems.length}
        onOpenTrialCart={() => setIsCartOpen(true)}
        selectedArea={selectedArea}
        onOpenLiveTrialModal={() => setIsTrialRoomOpen(true)}
        currentUser={currentUser}
        currentShop={currentShop}
        onLogout={handleUserLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex-1 w-full">
        {currentDashboard === 'customer' ? (
          <CustomerDashboard
            garments={garments}
            shops={shops}
            trialItems={trialItems}
            activeOrder={activeOrder}
            onOpenDetailsModal={(garment) => setSelectedGarmentForDetails(garment)}
            onAddToTrial={handleAddToTrial}
            onOpenTrialCart={() => setIsCartOpen(true)}
            onOpenTrialRoom={() => setIsTrialRoomOpen(true)}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            latestSyncNotification={latestSyncNotification}
            latestSettlementEvent={latestSettlementEvent}
          />
        ) : currentDashboard === 'shopkeeper' ? (
          <ShopOwnerDashboard
            currentShop={currentShop}
            garments={garments}
            onAddGarment={handleAddGarmentByShop}
            activeOrders={activeOrder ? [activeOrder] : []}
            latestSettlementEvent={latestSettlementEvent}
          />
        ) : (
          /* Delivery Boy Dashboard */
          <DeliveryDashboard
            order={activeOrder || INITIAL_ACTIVE_ORDER}
            onUpdateOrderDecision={handleSettledOrder}
          />
        )}
      </main>

      {/* Garment Details & High-Res Inspection Modal */}
      {selectedGarmentForDetails && (
        <GarmentDetailsModal
          garment={selectedGarmentForDetails}
          onClose={() => setSelectedGarmentForDetails(null)}
          onAddToTrial={handleAddToTrial}
          isInTrial={trialItems.some((item) => item.id === selectedGarmentForDetails.id)}
        />
      )}

      {/* Home Trial Drawer */}
      <TrialCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={trialItems}
        onRemoveItem={handleRemoveFromTrial}
        onBookTrial={handleBookTrial}
      />

      {/* Doorstep Trial & Settlement Simulator Modal */}
      {isTrialRoomOpen && activeOrder && (
        <DoorstepTrialModal
          order={activeOrder}
          onClose={() => setIsTrialRoomOpen(false)}
          onSettled={handleSettledOrder}
        />
      )}

      {/* Role-Based Authentication & Login Modal (if opened while logged in) */}
      {isLoginPageOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl animate-fade-in">
            <LoginPage
              onLogin={handleUserLogin}
              onClose={() => setIsLoginPageOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-serif font-black text-xl shadow-md">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold font-serif text-lg tracking-tight">Rivaat</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  रिवात
                </span>
              </div>
              <p className="text-xs text-stone-500">Reviving Local Clothing Shops Through Doorstep Trials & Express Delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-stone-400">
              Logged in as <strong className="text-white">{currentUser.name}</strong> ({currentDashboard === 'customer' ? 'Customer' : currentDashboard === 'shopkeeper' ? 'Shop Owner' : 'Delivery Saathi'})
            </span>
            <button
              onClick={handleUserLogout}
              className="text-orange-400 hover:text-orange-300 font-bold underline underline-offset-4"
            >
              Log Out to Landing Page
            </button>
          </div>

          <div className="text-xs text-stone-500 text-center md:text-right">
            © {new Date().getFullYear()} Rivaat Technologies. Empowering India's Local Fabric Retailers.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
