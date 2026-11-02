import React, { useState } from 'react';
import { TrialOrder, TrialItem } from '../types';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle,
  XCircle,
  QrCode,
  Banknote,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Bike,
  Store,
  Receipt,
  RotateCcw
} from 'lucide-react';

interface DoorstepTrialModalProps {
  order: TrialOrder;
  onClose: () => void;
  onSettled: (orderId: string, keptItems: TrialItem[], returnedItems: TrialItem[], totalAmount: number) => void;
}

export const DoorstepTrialModal: React.FC<DoorstepTrialModalProps> = ({
  order,
  onClose,
  onSettled,
}) => {
  // Decision state for each item: 'keep' | 'return'
  const [decisions, setDecisions] = useState<Record<string, 'keep' | 'return'>>(() => {
    const initial: Record<string, 'keep' | 'return'> = {};
    // By default, let's mark first 3 kept and rest returned as a realistic demo
    order.items.forEach((item, index) => {
      initial[item.id] = index < Math.ceil(order.items.length / 2) ? 'keep' : 'return';
    });
    return initial;
  });

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card_machine' | 'upi' | 'card_web'>('cash');
  const [isSettled, setIsSettled] = useState<boolean>(false);

  const shopsInOrder = React.useMemo(() => {
    const map: Record<string, { shopId: string; shopName: string; shopArea: string; items: TrialItem[] }> = {};
    order.items.forEach((item) => {
      const sId = item.shopId || 'shop-default';
      if (!map[sId]) {
        map[sId] = {
          shopId: sId,
          shopName: item.shopName || 'Local Store',
          shopArea: item.shopArea || 'Delhi NCR',
          items: [],
        };
      }
      map[sId].items.push(item);
    });
    return Object.values(map);
  }, [order.items]);

  const toggleDecision = (itemId: string, choice: 'keep' | 'return') => {
    setDecisions((prev) => ({
      ...prev,
      [itemId]: choice,
    }));
  };

  const keptItems = order.items.filter((item) => decisions[item.id] === 'keep');
  const returnedItems = order.items.filter((item) => decisions[item.id] === 'return');
  const totalKeptAmount = keptItems.reduce((acc, curr) => acc + curr.price, 0);
  const totalReturnedAmount = returnedItems.reduce((acc, curr) => acc + curr.price, 0);

  const handleCompleteSettlement = () => {
    setIsSettled(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onSettled(order.id, keptItems, returnedItems, totalKeptAmount);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#161311] border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col transition-colors">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-white/20 backdrop-blur-md uppercase tracking-wider">
                Live Doorstep Trial Room
              </span>
              <span className="text-orange-200 text-xs">Order #{order.id}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif mt-1">
              {order.customerName}’s Home Trial Decision
            </h2>
            <p className="text-xs text-orange-100 flex items-center gap-1.5 mt-0.5">
              <Bike className="w-3.5 h-3.5 text-orange-200 fill-orange-200" /> Delivered by {order.riderName || 'Vikram Yadav (Rivaat Saathi)'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Explanation Alert */}
          <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="text-xs text-stone-700 dark:text-stone-300">
              <span className="font-bold text-stone-900 dark:text-amber-100 flex items-center gap-1.5 text-sm">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Try at home with family, keep only what you love!
              </span>
              Select which items you are keeping. The Rivaat delivery partner will take back the returned items immediately to the local shopkeeper.
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-stone-800 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 flex-shrink-0 text-xs">
              <div>
                <span className="text-stone-400 dark:text-stone-400 block text-[10px]">Kept</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{keptItems.length} clothes</span>
              </div>
              <div className="w-[1px] h-6 bg-stone-200 dark:bg-stone-700" />
              <div>
                <span className="text-stone-400 dark:text-stone-400 block text-[10px]">Returning</span>
                <span className="font-bold text-amber-600 text-sm">{returnedItems.length} clothes</span>
              </div>
            </div>
          </div>

          {/* Garments Decision List Grouped by Shop */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Select Keep or Return for each garment ({order.items.length} items from {shopsInOrder.length} local shops)
              </h3>
              <span className="text-[11px] font-semibold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                Multi-Shop Order
              </span>
            </div>

            {shopsInOrder.map((shopGroup) => (
              <div key={shopGroup.shopId} className="space-y-2.5">
                <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
                  <Store className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-stone-900">
                    From Shop: {shopGroup.shopName} ({shopGroup.shopArea})
                  </span>
                  <span className="text-[10px] text-stone-500 ml-auto">
                    {shopGroup.items.length} clothes
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {shopGroup.items.map((item) => {
                    const isKeep = decisions[item.id] === 'keep';
                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border-2 transition-all flex gap-3.5 items-center ${
                          isKeep
                            ? 'border-emerald-500 bg-emerald-50/40 shadow-sm'
                            : 'border-stone-200 bg-stone-50/70 opacity-90'
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
                          <h4 className="text-xs font-bold text-stone-900 truncate mt-1">{item.title}</h4>
                          <p className="text-[11px] text-stone-500">
                            Size: {item.selectedSize} • Fabric: {item.fabric}
                          </p>
                          <p className="text-sm font-extrabold text-stone-900 mt-1">
                            ₹{item.price.toLocaleString('en-IN')}
                          </p>

                          {/* Action buttons */}
                          <div className="mt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => toggleDecision(item.id, 'keep')}
                              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                                isKeep
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-white border border-stone-300 text-stone-600 hover:border-emerald-500'
                              }`}
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Keep Item
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleDecision(item.id, 'return')}
                              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                                !isKeep
                                  ? 'bg-amber-600 text-white shadow-sm'
                                  : 'bg-white border border-stone-300 text-stone-600 hover:border-amber-500'
                              }`}
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Return to Shop
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

          {/* Settlement Summary & Payment */}
          {!isSettled ? (
            <div className="p-5 rounded-2xl bg-stone-900 text-white space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-stone-800 pb-3">
                <div>
                  <span className="text-xs text-stone-400">Doorstep Final Settlement</span>
                  <div className="text-xl font-bold font-serif text-white">
                    Pay Only for Kept Clothes ({keptItems.length} of {order.items.length})
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-400">Total Amount to Pay</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-orange-400">
                    ₹{totalKeptAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Returned info */}
              <div className="flex items-center justify-between text-xs text-stone-400 bg-stone-800/60 p-3 rounded-xl">
                <span>Returned Garments Handed to Rider:</span>
                <span className="font-semibold text-amber-300">
                  {returnedItems.length} items (₹{totalReturnedAmount.toLocaleString('en-IN')} returned to shop)
                </span>
              </div>

              {/* Doorstep Bill Generator Notice */}
              <div className="p-3 bg-stone-800 rounded-xl border border-stone-700 flex items-center gap-3 text-xs">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300 flex-shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block">Portable Bill Generator on Spot</span>
                  <span className="text-[11px] text-stone-300">
                    Rider Vikram will print the final physical bill once you confirm the {keptItems.length} clothes. Zero advance payment on website!
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-2">
                  Select How You Want to Pay at Doorstep (Mainly Cash & Card Machine)
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  
                  {/* Cash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 transition text-left ${
                      paymentMethod === 'cash'
                        ? 'border-emerald-500 bg-emerald-600/20 text-white font-bold'
                        : 'border-stone-700 bg-stone-800/40 text-stone-400 hover:border-stone-600'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div>
                      <span className="block text-white">💵 Cash to Rider (Main)</span>
                      <span className="text-[10px] text-stone-400">Hand over cash in hand</span>
                    </div>
                  </button>

                  {/* Card Machine POS */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card_machine')}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 transition text-left ${
                      paymentMethod === 'card_machine'
                        ? 'border-sky-500 bg-sky-600/20 text-white font-bold'
                        : 'border-stone-700 bg-stone-800/40 text-stone-400 hover:border-stone-600'
                    }`}
                  >
                    <span className="text-base">💳</span>
                    <div>
                      <span className="block text-white">Rider Card Machine</span>
                      <span className="text-[10px] text-stone-400">Tap / Swipe card on POS</span>
                    </div>
                  </button>

                  {/* UPI QR */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 transition text-left ${
                      paymentMethod === 'upi'
                        ? 'border-orange-500 bg-orange-600/20 text-white font-bold'
                        : 'border-stone-700 bg-stone-800/40 text-stone-400 hover:border-stone-600'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-orange-400 flex-shrink-0" />
                    <div>
                      <span className="block text-white">UPI QR (Dashboard)</span>
                      <span className="text-[10px] text-stone-400">Scan via GPay/PhonePe</span>
                    </div>
                  </button>

                  {/* Inbuilt Web Card Backup */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card_web')}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 transition text-left ${
                      paymentMethod === 'card_web'
                        ? 'border-purple-500 bg-purple-600/20 text-white font-bold'
                        : 'border-stone-700 bg-stone-800/40 text-stone-400 hover:border-stone-600'
                    }`}
                  >
                    <span className="text-base">🌐</span>
                    <div>
                      <span className="block text-white">Website Card (Backup)</span>
                      <span className="text-[10px] text-stone-400">If POS machine offline</span>
                    </div>
                  </button>

                </div>
              </div>

              {/* Complete settlement button */}
              <button
                onClick={handleCompleteSettlement}
                disabled={keptItems.length === 0}
                className="w-full py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-600/30 transition active:scale-[0.99] disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                Complete Doorstep Settlement (₹{totalKeptAmount.toLocaleString('en-IN')})
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Settlement Success State */
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold font-serif text-emerald-950">
                  Doorstep Trial & Settlement Completed!
                </h3>
                <p className="text-xs text-emerald-800 mt-1 max-w-lg mx-auto">
                  You kept {keptItems.length} clothes and paid ₹{totalKeptAmount.toLocaleString('en-IN')} via{' '}
                  {paymentMethod.toUpperCase()}.
                </p>
              </div>

              {/* What happens next flow */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto text-left text-xs pt-2">
                <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-sm">
                  <div className="flex items-center gap-2 font-bold text-stone-900 mb-1">
                    <Bike className="w-4 h-4 text-orange-600" />
                    <span>Rider Handover to Shop</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    Rider Vikram is returning the {returnedItems.length} clothes back to the local shopkeeper in pristine condition.
                  </p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-sm">
                  <div className="flex items-center gap-2 font-bold text-stone-900 mb-1">
                    <Store className="w-4 h-4 text-emerald-600" />
                    <span>Instant Shop Payout</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    The shopkeeper receives ₹{(totalKeptAmount * 0.92).toFixed(0)} directly into their UPI account.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition"
                >
                  Done & Back to Shopping
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
