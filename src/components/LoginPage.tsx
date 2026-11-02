import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import {
  User,
  Store,
  Bike,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Phone,
  Key,
  CheckCircle2,
  Lock,
  ShoppingBag,
  Crown
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
  onClose?: () => void;
  initialRole?: UserRole;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onClose, initialRole = 'customer' }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);

  // Customer Form State
  const [customerPhone, setCustomerPhone] = useState('+91 98201 55432');
  const [customerName, setCustomerName] = useState('Aarav Sharma');
  const [customerOtp, setCustomerOtp] = useState('4829');

  // Shopkeeper Form State
  const [shopId, setShopId] = useState('STORE-MEENA-01');
  const [shopName, setShopName] = useState('Meena Vastra & Handlooms');
  const [shopPassword, setShopPassword] = useState('••••••••');

  // Delivery Boy Form State
  const [riderId, setRiderId] = useState('RIDER-104');
  const [riderName, setRiderName] = useState('Vikram Yadav');
  const [riderPin, setRiderPin] = useState('1234');

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: 'cust-1',
      name: customerName,
      role: 'customer',
      phone: customerPhone,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    });
  };

  const handleShopLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: 'shop-1',
      name: 'Shri Rameshwar Lal',
      role: 'shopkeeper',
      shopId: 'shop-1',
      shopName: shopName,
      phone: '+91 98112 45890',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    });
  };

  const handleRiderLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: 'rider-104',
      name: riderName,
      role: 'delivery',
      riderId: riderId,
      phone: '+91 98100 23456',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    });
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#0D0B0A] text-stone-900 dark:text-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        {/* Royal Rivaat Crest Logo */}
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-700 via-orange-600 to-amber-950 p-0.5 shadow-xl shadow-amber-950/20 mx-auto border border-amber-400/50">
          <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-stone-950/90 to-amber-950 flex items-center justify-center relative overflow-hidden backdrop-blur-xs">
            <span className="absolute -top-1 -right-1 text-[8px] text-amber-300">✦</span>
            <span className="absolute -bottom-1 -left-1 text-[8px] text-amber-300">✦</span>
            <Crown className="w-3.5 h-3.5 text-amber-400 absolute top-1" />
            <span className="font-serif font-black text-3xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 mt-1">
              R
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-3xl font-extrabold font-serif text-stone-900 dark:text-amber-100 tracking-tight">Rivaat</h1>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-amber-950/80 text-orange-800 dark:text-amber-300 border border-orange-200 dark:border-amber-700/60 font-serif">
            रिवात
          </span>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Aapki Local Dukaan, Ghar Par • Doorstep Trial &amp; Buy Network
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white dark:bg-[#161311] py-8 px-6 shadow-2xl sm:rounded-3xl border border-stone-200 dark:border-stone-800 space-y-6 relative transition-colors">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs font-bold p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              title="Close and continue as guest"
            >
              ✕ Close
            </button>
          )}
          
          {/* Active Portal Header Badge (No Role Switcher Capsule) */}
          <div className="flex justify-center">
            <div className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 border ${
              selectedRole === 'customer'
                ? 'bg-orange-50 text-orange-900 border-orange-200'
                : selectedRole === 'shopkeeper'
                ? 'bg-stone-900 text-white border-stone-800'
                : 'bg-sky-600 text-white border-sky-500'
            }`}>
              {selectedRole === 'customer' ? (
                <>
                  <User className="w-4 h-4 text-orange-600 fill-orange-200" />
                  <span>Customer Login • ₹0 Doorstep Trial</span>
                </>
              ) : selectedRole === 'shopkeeper' ? (
                <>
                  <Store className="w-4 h-4 text-amber-400 fill-amber-200" />
                  <span>Shop Owner Portal • Live Merchant</span>
                </>
              ) : (
                <>
                  <Bike className="w-4 h-4 text-white fill-sky-200" />
                  <span>Delivery Saathi Portal • Rider Shift</span>
                </>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* 1. CUSTOMER LOGIN FORM                                  */}
          {/* ======================================================== */}
          {selectedRole === 'customer' && (
            <form onSubmit={handleCustomerLogin} className="space-y-4 animate-fade-in text-xs">
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-2xl text-orange-950 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <span>
                  <strong>Customer Login:</strong> Order up to 10 clothes to try at home with family. Receive instant digital bills on your phone!
                </span>
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-stone-500" /> Mobile Number (for Instant Bill Delivery)
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-stone-500" /> 4-Digit OTP
                </label>
                <input
                  type="password"
                  value={customerOtp}
                  onChange={(e) => setCustomerOtp(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono tracking-widest text-center text-sm"
                  maxLength={4}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition active:scale-[0.98]"
              >
                <span>Enter Customer Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* 2. SHOP OWNER LOGIN FORM                                */}
          {/* ======================================================== */}
          {selectedRole === 'shopkeeper' && (
            <form onSubmit={handleShopLogin} className="space-y-4 animate-fade-in text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950 flex items-center gap-2.5">
                <Store className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>Shop Owner Portal:</strong> Receive instant doorstep sale alerts, multi-shop bill summaries & direct UPI payouts.
                </span>
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">Registered Shop Name</label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">Store License / Partner ID</label>
                <input
                  type="text"
                  value={shopId}
                  onChange={(e) => setShopId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-stone-500" /> Password
                </label>
                <input
                  type="password"
                  value={shopPassword}
                  onChange={(e) => setShopPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition active:scale-[0.98]"
              >
                <span>Enter Shop Owner Dashboard</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* 3. DELIVERY AGENT LOGIN FORM                            */}
          {/* ======================================================== */}
          {selectedRole === 'delivery' && (
            <form onSubmit={handleRiderLogin} className="space-y-4 animate-fade-in text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 flex items-center gap-2.5">
                <Bike className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>Rider Portal:</strong> Multi-shop pickup itineraries, portable bill generator, spot POS card swipes & returns.
                </span>
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">Rider Agent Name</label>
                <input
                  type="text"
                  value={riderName}
                  onChange={(e) => setRiderName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">Rivaat Saathi Rider ID</label>
                <input
                  type="text"
                  value={riderId}
                  onChange={(e) => setRiderId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-stone-500" /> Secret Device PIN
                </label>
                <input
                  type="password"
                  value={riderPin}
                  onChange={(e) => setRiderPin(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono tracking-widest text-center text-sm"
                  maxLength={4}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition active:scale-[0.98]"
              >
                <span>Enter Delivery Boy Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick 1-Click Demo Login Shortcut (Role Specific) */}
          <div className="pt-4 border-t border-stone-200">
            {selectedRole === 'customer' ? (
              <button
                type="button"
                onClick={() => {
                  onLogin({
                    id: 'cust-1',
                    name: 'Aarav Sharma',
                    role: 'customer',
                    phone: '+91 98201 55432',
                  });
                }}
                className="w-full p-2.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl font-bold text-orange-950 text-center transition flex items-center justify-center gap-2 text-xs"
              >
                <span>⚡ 1-Click Fast Login as Aarav Sharma (Customer)</span>
              </button>
            ) : selectedRole === 'shopkeeper' ? (
              <button
                type="button"
                onClick={() => {
                  onLogin({
                    id: 'shop-1',
                    name: 'Shri Rameshwar Lal',
                    role: 'shopkeeper',
                    shopId: 'shop-1',
                    shopName: 'Meena Vastra & Handlooms',
                  });
                }}
                className="w-full p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl font-bold text-amber-950 text-center transition flex items-center justify-center gap-2 text-xs"
              >
                <span>⚡ 1-Click Fast Login as Meena Vastra (Shop Owner)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onLogin({
                    id: 'rider-104',
                    name: 'Vikram Yadav',
                    role: 'delivery',
                    riderId: 'RIDER-104',
                  });
                }}
                className="w-full p-2.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl font-bold text-sky-950 text-center transition flex items-center justify-center gap-2 text-xs"
              >
                <span>⚡ 1-Click Fast Login as Vikram Yadav (Delivery Saathi)</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
