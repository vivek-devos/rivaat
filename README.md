# Rivaat (रिवात) — Aapki Local Dukaan, Ghar Par

> **Hyperlocal Clothing Commerce with Doorstep Trial Room (Try First, Pay Later) & 3D/AR Visualization**

---

## 🌟 The Core Vision

Post-COVID, traditional footfall in local clothing shops dropped drastically due to global e-commerce. However, buying ethnic and high-quality clothes online presents major problems:
1. **High Return Rates (30-40%)** for global players due to incorrect fit and fabric mismatch.
2. **Loss of Touch & Feel**: Customers (especially parents and elders) want to touch fabrics and verify quality in person.
3. **No Family Consensus**: Buying bridal, ethnic, or festive clothes requires family approval before spending money.

**Rivaat solves this with a revolutionary "Try at Home" model:**
- **Zero Upfront Payment**: Customers order up to 10 garments from nearby neighborhood shops for ₹0 advance.
- **Rivaat Staff Doorstep Delivery**: In 45-60 mins, a Rivaat delivery partner picks up the garments from local stores and brings them to the customer’s house.
- **Doorstep Trial Room**: The customer tries the clothes comfortably in front of their mirror with family.
- **Split Settlement**: Suppose the customer ordered 10 clothes and liked 5 — they keep those 5, pay only for those 5 on the spot (UPI/Cash), and hand the other 5 back to the Rivaat staff.
- **Instant Return & Payout**: The staff returns the 5 unkept items back to the shopkeeper within an hour and remits the payment.
- **Fair Commission**: Rivaat takes a small monthly cut (e.g. 8-10%) on realized sales, while the local retailer keeps 90-92% (compared to 30%+ commissions on traditional e-commerce).

---

## 🖥️ Two Interactive Dashboards

The app includes **2 dedicated dashboards** with an instant toggle at the top (login page deferred as requested):

### 1. 🛍️ Customer Dashboard
- **Hyperlocal Shop Discovery**: Explore verified local stores (Meena Vastra, Royal Heritage Menswear, Kashish Boutique, etc.) filtered by neighborhood (Chandni Chowk, Lajpat Nagar, Karol Bagh).
- **Interactive 3D Garment Inspection**: Real-time 360-degree Three.js 3D garment rotation, zoom, and showroom/daylight/warm lighting presets.
- **Live AR Mirror Try-On**: Uses your device camera/webcam to overlay the garment with customizable size, alignment, and WhatsApp family sharing snapshot.
- **Room Placement AR**: Preview how clothes look hanging in a warm home room environment.
- **Home Trial Bag**: Select up to 10 clothes with ₹0 advance.
- **Interactive Doorstep Trial Simulator**: Simulate the moment the Rivaat rider arrives at the door, mark clothes as "Keep" or "Return", calculate dynamic doorstep billing, and pay via UPI QR or Cash.

### 2. 🏪 Shop Owner Dashboard ("Rivaat Dukandar")
- **Performance & Payout Analytics**: Track monthly doorstep trials dispatched, home conversion rates (65%+), net sales, and Rivaat platform fee (8%).
- **Upload Clothes & AI 3D Mesh Generator**: Shopkeepers snap/upload photos from their store racks; the engine simulates 3D mesh and AR reconstruction, making items immediately live.
- **Live Trial Orders Queue**: View incoming trial requests from nearby customers, verify rider assignment, and pack orders.
- **Inventory & Catalog Management**: Live list of digitized products with real-time stock and price controls.

---

## 🚀 How to Run

Project location:
```bash
cd /Users/vivekdalmia/Desktop/Rivaat
npm run dev
```

Server URL:
- **Local:** `http://localhost:5173`
- **Network:** `http://10.100.68.152:5173`

---

## 🛠️ Tech Stack
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + Custom Indian Luxury Palette
- **3D Graphics:** Three.js (WebGL rendering, 360-degree orbit, dynamic lighting)
- **Icons:** Lucide React
- **Celebration:** Canvas Confetti
