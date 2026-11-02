import React from 'react';
import { ShoppingBag, Sparkles, MapPin, Store, Bike, LogOut, LogIn, User, Sun, Moon, Crown } from 'lucide-react';
import { UserRole, UserProfile, Shop } from '../types';

interface NavbarProps {
  currentDashboard: UserRole;
  trialItemsCount: number;
  onOpenTrialCart: () => void;
  selectedArea: string;
  onOpenLiveTrialModal: () => void;
  currentUser: UserProfile | null;
  currentShop?: Shop;
  onLogout: () => void;
  onOpenLoginPage?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentDashboard,
  trialItemsCount,
  onOpenTrialCart,
  selectedArea,
  onOpenLiveTrialModal,
  currentUser,
  currentShop,
  onLogout,
  onOpenLoginPage,
  theme = 'light',
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#120F0D]/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity with Royal Indian Couture Crest */}
        <div className="flex items-center gap-3">
          {/* Royal Rivaat Crest Logo */}
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-700 via-orange-600 to-amber-950 p-0.5 shadow-lg shadow-amber-950/20 flex-shrink-0 border border-amber-400/50">
            <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-stone-950/90 to-amber-950 flex items-center justify-center relative overflow-hidden backdrop-blur-xs">
              <span className="absolute -top-1 -right-1 text-[8px] text-amber-300">✦</span>
              <span className="absolute -bottom-1 -left-1 text-[8px] text-amber-300">✦</span>
              <Crown className="w-2.5 h-2.5 text-amber-400 absolute top-1" />
              <span className="font-serif font-black text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 mt-1">
                R
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black font-serif tracking-tight text-stone-900 dark:text-amber-100">
                Rivaat
              </span>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100/90 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 flex items-center gap-1 shadow-xs font-serif">
                <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400 fill-amber-400" />
                रिवात
              </span>
            </div>
            <p className="text-[10px] text-stone-500 dark:text-stone-400 tracking-wide font-medium">
              Aapki Local Dukaan, Ab Ghar Par • ₹0 Doorstep Trial
            </p>
          </div>
        </div>

        {/* Center: Dedicated Context for Active User with Real Shop/Partner Logos */}
        <div className="flex items-center">
          {currentDashboard === 'customer' ? (
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-950 px-3.5 py-1.5 rounded-2xl border border-amber-200 dark:border-amber-900/40 text-xs font-bold text-stone-800 dark:text-stone-200 shadow-xs">
              <div className="w-5 h-5 rounded-lg bg-amber-600/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-stone-900 dark:text-amber-100">Delivering to {selectedArea || 'Lajpat Nagar'}</span>
              <span className="text-amber-400 hidden sm:inline">•</span>
              <span className="text-stone-600 dark:text-stone-400 hidden sm:inline text-[11px]">Same-Day ₹0 Home Trial (8-10 km)</span>
            </div>
          ) : currentDashboard === 'shopkeeper' ? (
            <div className="flex items-center gap-2.5 bg-stone-900 dark:bg-stone-950 text-white px-3.5 py-1.5 rounded-2xl border border-stone-800 dark:border-amber-900/40 text-xs font-bold shadow-sm">
              {currentShop?.avatarImage ? (
                <img
                  src={currentShop.avatarImage}
                  alt={currentShop.name}
                  className="w-5 h-5 rounded-lg object-cover border border-amber-400/80 shadow-xs flex-shrink-0"
                />
              ) : (
                <Store className="w-4 h-4 text-amber-400 fill-amber-200 flex-shrink-0" />
              )}
              <span className="font-extrabold text-amber-300 font-serif">{currentShop?.name || currentUser?.shopName || 'Meena Vastra & Handlooms'}</span>
              <span className="text-stone-600 hidden sm:inline">•</span>
              <span className="text-stone-300 text-[11px] hidden sm:inline">Sub-0.1ms Catalog Sync</span>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 bg-gradient-to-r from-sky-700 to-blue-700 text-white px-3.5 py-1.5 rounded-2xl shadow-sm text-xs font-bold border border-sky-500/40">
              <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center border border-white/40">
                <Bike className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-extrabold">{currentUser?.name || 'Vikram Yadav'}</span>
              <span className="text-sky-200 hidden sm:inline">•</span>
              <span className="text-sky-100 text-[11px] hidden sm:inline">Active Shift (POS Ready)</span>
            </div>
          )}
        </div>

        {/* Right Actions: Dark Theme Toggle, User Profile / Logout & Customer Bag */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Dark / Light Theme Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800/90 dark:hover:bg-stone-700 text-stone-700 dark:text-amber-300 border border-stone-200 dark:border-stone-700 transition flex items-center justify-center shadow-xs active:scale-95"
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

          {/* Logged in User Pill */}
          {currentUser ? (
            <div className="flex items-center gap-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-1.5 sm:p-2 rounded-2xl shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-xs font-bold text-amber-800 dark:text-amber-300 overflow-hidden flex-shrink-0 border border-amber-300 dark:border-amber-700/60">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  currentUser.name[0]
                )}
              </div>
              <div className="hidden md:block text-left pr-2">
                <span className="text-xs font-black text-stone-900 dark:text-stone-100 block leading-tight truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold tracking-wider capitalize">
                  {currentUser.role === 'shopkeeper' ? 'Shop Owner' : currentUser.role === 'delivery' ? 'Delivery Saathi' : 'Customer'}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="px-2.5 py-1.5 text-stone-600 dark:text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition text-xs font-bold flex items-center gap-1 border border-transparent hover:border-red-200 dark:hover:border-red-800/40"
                title="Log Out to Landing Page"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          ) : (
            onOpenLoginPage && (
              <button
                onClick={onOpenLoginPage}
                className="px-4 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </button>
            )
          )}

          {/* Trial Wardrobe Bag Button (STRICTLY Customer Only) */}
          {currentDashboard === 'customer' && (
            <button
              onClick={onOpenTrialCart}
              data-cursor="trial"
              className="relative px-4 py-2.5 rounded-2xl bg-stone-900 dark:bg-stone-800 hover:bg-amber-600 dark:hover:bg-amber-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition active:scale-95 border border-transparent dark:border-stone-700"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400 fill-amber-300" />
              <span className="hidden sm:inline">Trial Bag</span>
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] font-black flex items-center justify-center shadow-inner">
                {trialItemsCount}
              </span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
