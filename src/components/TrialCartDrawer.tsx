import React, { useState } from 'react';
import { TrialItem, TrialOrder } from '../types';
import { X, Trash2, Sparkles, MapPin, Clock, ArrowRight, ShieldCheck, HeartHandshake, Receipt, CreditCard, Banknote, Store } from 'lucide-react';

interface TrialCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: TrialItem[];
  onRemoveItem: (id: string) => void;
  onBookTrial: (order: Partial<TrialOrder>) => void;
}

export const TrialCartDrawer: React.FC<TrialCartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onBookTrial,
}) => {
  const [address, setAddress] = useState('Flat 402, Sunshine Heights, Lajpat Nagar III, New Delhi');
  const [phone, setPhone] = useState('+91 98201 55432');
  const [name, setName] = useState('Aarav Sharma');
  const [selectedSlot, setSelectedSlot] = useState('Same-Day Delivery (Within 8-10 km • Today)');
  const [familyNote, setFamilyNote] = useState('Mom and sister will check fabric quality & drape.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const maxItems = 10;
  const totalValue = items.reduce((acc, curr) => acc + curr.price, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onBookTrial({
        customerName: name,
        customerPhone: phone,
        deliveryAddress: address,
        slot: selectedSlot,
        familyNote: familyNote,
        totalItemsCount: items.length,
      });
      setIsSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in flex justify-end">
      <div className="w-full max-w-lg bg-white dark:bg-[#161311] text-stone-900 dark:text-stone-100 h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-stone-200 dark:border-stone-800 transition-colors">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-[#161311]/95 backdrop-blur-md z-10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-serif text-stone-900 dark:text-amber-100">Rivaat Home Trial Bag</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 dark:bg-amber-950/80 text-orange-800 dark:text-amber-300 border border-orange-200 dark:border-amber-700/60">
                {items.length} / {maxItems} Clothes
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Ghar pe pehno, fir kharido • ₹0 Upfront Payment
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          
          {/* Zero payment banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200 space-y-2 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950 flex-shrink-0" />
              <span className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">
                100% Free Doorstep Trial • Zero Online Payment
              </span>
            </div>
            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              Website par abhi <strong>₹0 (zero payment)</strong> karna hai. Humara delivery partner kapde ghar leke aayega. 
              Aap family ke saath fitting aur quality check karoge. Jo pasand aayega uska <strong>wahi spot par bill banega</strong> aur payment cash ya rider ki card machine se hoga!
            </p>
            <div className="pt-1 flex flex-wrap gap-2 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
              <span className="bg-white/90 dark:bg-stone-900/90 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1.5 shadow-xs">
                <Receipt className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" /> Spot Bill Generator
              </span>
              <span className="bg-white/90 dark:bg-stone-900/90 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1.5 shadow-xs">
                <CreditCard className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" /> Portable Card Machine
              </span>
              <span className="bg-white/90 dark:bg-stone-900/90 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1.5 shadow-xs">
                <Banknote className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" /> Cash in Hand
              </span>
            </div>
          </div>

          {/* Items List */}
          {items.length === 0 ? (
            <div className="text-center py-12 text-stone-400 dark:text-stone-500">
              <HeartHandshake className="w-12 h-12 mx-auto text-stone-300 dark:text-stone-600 mb-3" />
              <p className="text-sm font-semibold text-stone-600 dark:text-stone-300">Your Home Trial bag is empty</p>
              <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">Browse nearby local shops and add up to 10 clothes to try at home!</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                  Selected Clothes ({items.length})
                </span>
                <span className="text-[10px] font-bold text-orange-700 dark:text-amber-300 bg-orange-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-orange-200 dark:border-amber-700/60">
                  From {new Set(items.map((it) => it.shopName)).size} Local Shops (Combined Bag)
                </span>
              </div>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-orange-200 dark:hover:border-amber-800/80 bg-stone-50 dark:bg-stone-900/70 flex gap-3 items-center transition"
                >
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-16 h-20 object-cover rounded-xl shadow-sm border border-stone-200 dark:border-stone-700"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/60 inline-flex items-center gap-1">
                      <Store className="w-3 motion-safe:w-3 text-amber-700 dark:text-amber-400" /> {item.shopName}
                    </span>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate mt-1">{item.title}</h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      Size: <span className="font-semibold text-stone-700 dark:text-stone-300">{item.selectedSize}</span> • Color:{' '}
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full border border-stone-300 dark:border-stone-600 align-middle ml-0.5"
                        style={{ backgroundColor: item.selectedColor }}
                      />
                    </p>
                    <p className="text-xs font-extrabold text-stone-900 dark:text-amber-100 mt-1">
                      ₹{item.price.toLocaleString('en-IN')}{' '}
                      <span className="text-[10px] font-normal text-stone-400 dark:text-stone-500">(Pay if kept)</span>
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-stone-400 hover:text-red-500 rounded-xl hover:bg-white dark:hover:bg-stone-800 transition"
                    title="Remove from trial"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Delivery & Trial Preferences */}
          {items.length > 0 && (
            <div className="space-y-4 pt-3 border-t border-stone-200 dark:border-stone-800">
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                Delivery & Family Trial Details
              </span>

              {/* Slot */}
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-600 dark:text-amber-400" /> Choose Trial Time Slot
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    'Same-Day Delivery (Within 8-10 km • Today)',
                    '2 Days Delivery (Distance >10 km Transit)',
                    'Tomorrow Morning (10 AM - 12 PM)',
                    'Tomorrow Evening (5 PM - 7 PM)',
                  ].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2 rounded-xl text-left border transition ${
                        selectedSlot === slot
                          ? 'border-orange-600 dark:border-amber-500 bg-orange-50 dark:bg-amber-950/60 font-bold text-orange-950 dark:text-amber-200'
                          : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-600 dark:text-amber-400" /> Doorstep Delivery Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-stone-600 dark:text-stone-400 block mb-1 font-semibold">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="text-stone-600 dark:text-stone-400 block mb-1 font-semibold">Phone (for Rider OTP)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Family Note */}
              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  Family Note (Optional)
                </label>
                <input
                  type="text"
                  value={familyNote}
                  onChange={(e) => setFamilyNote(e.target.value)}
                  placeholder="e.g. Trying in front of mom & sister for wedding function"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout CTA */}
        {items.length > 0 && (
          <div className="p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#120F0D]">
            <div className="flex justify-between items-center mb-3 text-xs">
              <span className="text-stone-500 dark:text-stone-400">Total Garments Value ({items.length} clothes)</span>
              <span className="font-semibold text-stone-700 dark:text-stone-300">₹{totalValue.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center mb-4 text-sm font-bold bg-white dark:bg-stone-900 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
              <span className="text-emerald-900 dark:text-emerald-300">Amount Due Right Now</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-lg">₹0 (Free Trial)</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 active:scale-[0.98] transition"
            >
              {isSubmitting ? (
                <span>Dispatching Rivaat Staff...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Confirm Free Doorstep Trial Bag
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
              💵 <strong>Payment mainly cash / card machine:</strong> No online payment now. Delivery boy bill generator leke aayega aur fitting ke baad hi bill banakar payment lega.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
