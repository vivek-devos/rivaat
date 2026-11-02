import React from 'react';
import { LiveSettlementEvent } from '../types';
import { X, Printer, CheckCircle, Store, Share2, Download, ShieldCheck, Receipt } from 'lucide-react';

interface CustomerBillModalProps {
  settlement: LiveSettlementEvent;
  onClose: () => void;
}

export const CustomerBillModal: React.FC<CustomerBillModalProps> = ({
  settlement,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Receipt className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-orange-200">
                Official Digital Invoice
              </span>
              <h3 className="font-bold text-sm text-white">Delivered Instantly to Your Device</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thermal / Digital Receipt Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-950">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>Delivered in 0.04 ms:</strong> This bill was generated at your doorstep by Rider Vikram and synchronized simultaneously across you, the rider, and the local stores!
            </span>
          </div>

          {/* Receipt Body */}
          <div className="p-5 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-300 font-mono text-xs space-y-3">
            <div className="text-center border-b border-stone-300 pb-2">
              <h4 className="font-black text-sm text-stone-900">RIVAAT TECHNOLOGIES</h4>
              <p className="text-[10px] text-stone-500">Hyperlocal Fashion Doorstep Trial & Buy</p>
              <p className="text-[10px] text-stone-500">INVOICE: #{settlement.orderId}-DIGITAL • GSTIN: 07AAACR9214L1Z3</p>
              <p className="text-[10px] text-stone-400">
                Date: {new Date(settlement.timestamp).toLocaleDateString('en-IN')}{' '}
                {new Date(settlement.timestamp).toLocaleTimeString('en-IN')}
              </p>
            </div>

            <div className="text-[11px] space-y-0.5 border-b border-stone-300 pb-2">
              <p><strong>Customer:</strong> {settlement.customerName}</p>
              <p><strong>Payment Mode:</strong> {settlement.paymentMethod}</p>
              <p><strong>Settlement:</strong> Verified by Doorstep Rider</p>
            </div>

            {/* Shop by Shop Section */}
            <div className="space-y-3 py-1">
              {settlement.shopBreakdowns.map((shop) => (
                <div key={shop.shopId} className="space-y-1">
                  <div className="bg-stone-200/80 p-1 font-bold text-[11px] text-stone-900 flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><Store className="w-3.5 h-3.5 text-stone-700 inline" /> {shop.shopName.toUpperCase()}</span>
                    <span className="text-[10px] text-stone-600">({shop.shopArea})</span>
                  </div>

                  {shop.keptItems.length > 0 ? (
                    shop.keptItems.map((item, i) => (
                      <div key={item.id} className="flex justify-between text-[11px] text-stone-800 pl-2">
                        <span className="truncate max-w-[260px]">{i + 1}. {item.title} ({item.selectedSize})</span>
                        <span>₹{item.price}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-stone-400 italic pl-2">No items kept</p>
                  )}

                  <div className="text-right text-[10px] font-bold text-stone-700 pr-1">
                    Shop Subtotal: ₹{shop.shopBillAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-b border-stone-300 py-2 space-y-1 text-[11px]">
              <div className="flex justify-between font-bold text-sm text-stone-900 pt-1">
                <span>TOTAL AMOUNT PAID:</span>
                <span className="text-emerald-700">₹{settlement.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="text-center pt-2 text-[10px] text-stone-600 leading-relaxed">
              *** LOCAL SHOPS REVIVED THROUGH YOUR PURCHASE ***
              <br />
              Save this digital copy for fabric warranty & easy alterations at the stores!
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => window.print()}
              className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-800 font-bold hover:bg-stone-50 transition flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-stone-600" /> Print PDF Receipt
            </button>
            <button
              onClick={() => alert('Receipt link copied! You can share on WhatsApp.')}
              className="flex-1 py-2.5 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" /> Share on WhatsApp
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
