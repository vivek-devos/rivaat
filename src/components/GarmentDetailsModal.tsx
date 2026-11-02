import React, { useState } from 'react';
import { Garment } from '../types';
import {
  X,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Share2,
  Store,
  MapPin,
  Star,
  ShieldCheck,
  Ruler,
  Check,
  Eye,
  Truck,
  RotateCcw
} from 'lucide-react';

interface GarmentDetailsModalProps {
  garment: Garment;
  onClose: () => void;
  onAddToTrial: (garment: Garment, size: string, color: string) => void;
  isInTrial: boolean;
}

export const GarmentDetailsModal: React.FC<GarmentDetailsModalProps> = ({
  garment,
  onClose,
  onAddToTrial,
  isInTrial,
}) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>(garment.colors[0] || '#B45309');
  const [selectedSize, setSelectedSize] = useState<string>(garment.sizes[0] || 'M');
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Sizing guide based on size
  const sizeMeasurements = {
    length: garment.category === 'Sarees' ? '5.5 Meters' : selectedSize === 'XL' ? '46 inches' : '44 inches',
    chest: selectedSize === 'S' ? '36 in' : selectedSize === 'M' ? '38 in' : selectedSize === 'L' ? '40 in' : '42 in',
    shoulder: selectedSize === 'S' ? '15.5 in' : selectedSize === 'M' ? '16.5 in' : '17.5 in',
    flare: garment.category === 'Sarees' ? 'Pleated Drape' : '64 inches',
  };

  const handleShareOnWhatsApp = () => {
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 3000);
    const text = encodeURIComponent(
      `Check out this ${garment.title} from ${garment.shopName} (${garment.shopArea}) on Rivaat! We can get it for a ₹0 Home Trial (Same-Day Delivery within 8-10 km). Tell me if you like it!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#161311] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh] border border-stone-200 dark:border-stone-800 transition-colors">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition active:scale-95 shadow-md"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ======================================================== */}
        {/* LEFT SIDE: HIGH-RES PHOTO GALLERY (50% WIDTH)            */}
        {/* ======================================================== */}
        <div className="w-full md:w-1/2 bg-stone-100 dark:bg-[#0D0B0A] relative flex flex-col justify-between p-6 overflow-hidden">
          
          {/* Main Photo View */}
          <div className="relative w-full h-[340px] sm:h-[420px] rounded-2xl overflow-hidden shadow-inner bg-stone-200 dark:bg-stone-900 group">
            <img
              src={garment.images[selectedImageIdx] || garment.images[0]}
              alt={garment.title}
              className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
            />
            
            {/* Fabric Tag Overlay */}
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-300" />
              <span>{garment.fabric}</span>
            </div>

            {/* In-Stock Badge */}
            <div className="absolute top-3 left-3 bg-emerald-600 text-white px-2.5 py-1 rounded-xl text-[11px] font-bold shadow-md flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>Ready in Store Rack</span>
            </div>
          </div>

          {/* Thumbnail Strip (if multiple photos available) */}
          <div className="flex gap-2.5 pt-4 overflow-x-auto">
            {garment.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIdx(idx)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition flex-shrink-0 ${
                  selectedImageIdx === idx
                    ? 'border-orange-600 ring-2 ring-orange-200 scale-105'
                    : 'border-white dark:border-stone-700 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Delivery SLA Note */}
          <div className="mt-4 p-3 bg-white/90 dark:bg-stone-900/90 rounded-2xl border border-stone-200/80 dark:border-stone-800 flex items-center gap-2.5 text-xs text-stone-700 dark:text-stone-300 shadow-sm">
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-4 h-4 fill-amber-200" />
            </div>
            <span>
              Direct pickup from <strong>{garment.shopName}</strong> rack • <strong>Same-Day Delivery</strong> within ~8-10 km radius (2 Days for &gt;10 km transit).
            </span>
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT SIDE: GARMENT SPECIFICATIONS & HOME TRIAL ACTION   */}
        {/* ======================================================== */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-white dark:bg-[#161311] text-stone-900 dark:text-stone-100">
          <div>
            
            {/* Shop badge with local neighborhood pride */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-xs font-bold">
                <Store className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-200" />
                <span>{garment.shopName}</span>
              </div>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500 fill-rose-100" />
                <span>{garment.shopArea}</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 dark:text-stone-100 leading-snug">
              {garment.title}
            </h2>

            {/* Price Section */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
                ₹{garment.price.toLocaleString('en-IN')}
              </span>
              <span className="text-sm line-through text-stone-400">
                ₹{garment.originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
                {Math.round(((garment.originalPrice - garment.price) / garment.originalPrice) * 100)}% OFF
              </span>
            </div>

            {/* Product Sales & Revenue Proof (User Request) */}
            <div className="mt-3 p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-950 dark:text-amber-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 block">Kitna Product Bika</span>
                <span className="text-sm font-black text-amber-800 dark:text-amber-300 font-serif">🔥 {garment.unitsSold} Verified Pieces Sold</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 block">Total Sales Generated</span>
                <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 font-serif">₹{garment.totalSalesGenerated.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Zero Advance Home Trial Highlight */}
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-stone-900 dark:to-stone-950 border border-orange-200/90 dark:border-amber-900/40 shadow-sm space-y-1">
              <div className="flex items-center gap-2 text-orange-950 dark:text-amber-200 font-extrabold text-xs">
                <ShieldCheck className="w-4 h-4 text-orange-600 dark:text-amber-400 fill-orange-200" />
                <span>₹0 Advance Payment • Try with Family at Home</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Add to your trial bag now without paying anything online. Same-Day doorstep fitting within ~8-10 km radius. Check fitting, touch the fabric, and pay only for what you keep!
              </p>
            </div>

            {/* Color Swatches */}
            <div className="mt-5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-2">
                Available Color Options
              </label>
              <div className="flex gap-2.5 items-center">
                {garment.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === c
                        ? 'scale-110 border-orange-600 ring-4 ring-orange-200 dark:ring-amber-900/60'
                        : 'border-white dark:border-stone-700 shadow-md hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                    title={`Color ${c}`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector with Measurements */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  Select Size for Doorstep Trial
                </label>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                  Length: <strong>{sizeMeasurements.length}</strong> • Chest: <strong>{sizeMeasurements.chest}</strong>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {garment.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                      selectedSize === sz
                        ? 'border-orange-600 bg-orange-600 text-white shadow-sm'
                        : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-400 dark:hover:border-stone-600 bg-stone-50 dark:bg-stone-900'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric Details & Craft Specifications */}
            <div className="mt-5 border-t border-stone-200 dark:border-stone-800 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                Fabric & Handloom Specifications
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-stone-50 dark:bg-stone-900 p-2.5 rounded-xl border border-stone-100 dark:border-stone-800">
                  <span className="text-stone-400 dark:text-stone-500 block text-[10px]">Pure Material</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{garment.fabric}</span>
                </div>
                <div className="bg-stone-50 dark:bg-stone-900 p-2.5 rounded-xl border border-stone-100 dark:border-stone-800">
                  <span className="text-stone-400 dark:text-stone-500 block text-[10px]">Traditional Weave</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{garment.fabricDetails.weave}</span>
                </div>
                <div className="bg-stone-50 dark:bg-stone-900 p-2.5 rounded-xl border border-stone-100 dark:border-stone-800">
                  <span className="text-stone-400 dark:text-stone-500 block text-[10px]">Hand Touch / Feel</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{garment.fabricDetails.feel}</span>
                </div>
                <div className="bg-stone-50 dark:bg-stone-900 p-2.5 rounded-xl border border-stone-100 dark:border-stone-800">
                  <span className="text-stone-400 dark:text-stone-500 block text-[10px]">Washing Care</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{garment.fabricDetails.care}</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Family Consultation Button */}
            <div className="mt-4 pt-2">
              <button
                onClick={handleShareOnWhatsApp}
                className="w-full py-2.5 px-3 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Ask Parents / Family on WhatsApp</span>
              </button>
              {copiedShare && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block text-center mt-1">
                  ✓ Link generated & opened in WhatsApp!
                </span>
              )}
            </div>

          </div>

          {/* Action CTA: Add to Bag at ₹0 Advance */}
          <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800">
            <button
              onClick={() => {
                onAddToTrial(garment, selectedSize, selectedColor);
              }}
              disabled={isInTrial}
              className={`w-full py-4 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition ${
                isInTrial
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-stone-900 dark:bg-amber-600 hover:bg-orange-600 dark:hover:bg-amber-700 text-white shadow-orange-600/20 active:scale-[0.98]'
              }`}
            >
              {isInTrial ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white fill-emerald-300" />
                  <span>Added to Home Trial Bag (₹0)</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5 fill-orange-200" />
                  <span>Add to Doorstep Trial Bag • ₹0 Advance</span>
                </>
              )}
            </button>
            <p className="mt-2 text-center text-[11px] text-stone-500 dark:text-stone-400">
              No online payment required. Pay only if you keep it after trying at home.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
