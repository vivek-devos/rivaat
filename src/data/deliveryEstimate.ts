// Delivery Distance & SLA Calculator based on PIN Code and Neighborhood Area
// SLA Rules:
// - Around 8 to 10 km (or less): Same-Day Delivery
// - Greater than 10 km: 2 Days Delivery (Inter-zone transit delay)

export interface DeliverySLA {
  distanceKm: number;
  deliveryType: 'Same-Day' | '2 Days';
  slaLabel: string;
  badgeText: string;
  description: string;
  isDelayed: boolean;
  colorClass: string;
  bgClass: string;
}

export const AREA_PIN_MAP: Record<string, { pin: string; distanceToShops: Record<string, number> }> = {
  'Lajpat Nagar': {
    pin: '110024',
    distanceToShops: {
      'shop-1': 8.6, // Chandni Chowk (8-10 km range) -> Same-Day
      'shop-2': 2.4, // South Extension (<8 km) -> Same-Day
      'shop-3': 1.2, // Lajpat Nagar (<8 km) -> Same-Day
      'shop-4': 9.4, // Karol Bagh (8-10 km range) -> Same-Day
    },
  },
  'South Extension': {
    pin: '110049',
    distanceToShops: {
      'shop-1': 9.8, // Chandni Chowk (8-10 km) -> Same-Day
      'shop-2': 1.0, // South Extension (<8 km) -> Same-Day
      'shop-3': 2.5, // Lajpat Nagar (<8 km) -> Same-Day
      'shop-4': 8.9, // Karol Bagh (8-10 km) -> Same-Day
    },
  },
  'Chandni Chowk': {
    pin: '110006',
    distanceToShops: {
      'shop-1': 0.8, // Chandni Chowk (<8 km) -> Same-Day
      'shop-2': 9.8, // South Extension (8-10 km) -> Same-Day
      'shop-3': 8.6, // Lajpat Nagar (8-10 km) -> Same-Day
      'shop-4': 4.2, // Karol Bagh (<8 km) -> Same-Day
    },
  },
  'Karol Bagh': {
    pin: '110005',
    distanceToShops: {
      'shop-1': 4.2, // Chandni Chowk (<8 km) -> Same-Day
      'shop-2': 8.9, // South Extension (8-10 km) -> Same-Day
      'shop-3': 9.4, // Lajpat Nagar (8-10 km) -> Same-Day
      'shop-4': 1.0, // Karol Bagh (<8 km) -> Same-Day
    },
  },
  'Rohini / Pitampura': {
    pin: '110085',
    distanceToShops: {
      'shop-1': 16.4, // >10 km -> 2 Days
      'shop-2': 21.0, // >10 km -> 2 Days
      'shop-3': 22.5, // >10 km -> 2 Days
      'shop-4': 13.8, // >10 km -> 2 Days
    },
  },
  'Noida Sector 62': {
    pin: '201301',
    distanceToShops: {
      'shop-1': 17.8, // >10 km -> 2 Days
      'shop-2': 15.2, // >10 km -> 2 Days
      'shop-3': 14.0, // >10 km -> 2 Days
      'shop-4': 19.5, // >10 km -> 2 Days
    },
  },
  'Gurgaon Cyber City': {
    pin: '122002',
    distanceToShops: {
      'shop-1': 28.5, // >10 km -> 2 Days
      'shop-2': 18.2, // >10 km -> 2 Days
      'shop-3': 21.4, // >10 km -> 2 Days
      'shop-4': 24.0, // >10 km -> 2 Days
    },
  },
};

/**
 * Calculates delivery SLA based on customer location and shop.
 * Rule:
 * - Around 8-10 km (or under 10 km): Same-Day Delivery
 * - Above 10 km: 2 Days Delay / Transit
 */
export function getDeliverySLA(customerArea: string, shopId: string, shopAreaFallback?: string): DeliverySLA {
  const areaData = AREA_PIN_MAP[customerArea] || AREA_PIN_MAP['Lajpat Nagar'];
  let distance = areaData.distanceToShops[shopId];

  // If shopId not explicitly mapped, compute estimate
  if (distance === undefined) {
    if (customerArea === shopAreaFallback) {
      distance = 2.5;
    } else if (
      (customerArea.includes('Rohini') || customerArea.includes('Noida') || customerArea.includes('Gurgaon'))
    ) {
      distance = 18.0;
    } else {
      distance = 8.5; // default 8-10 km gap between central Delhi markets
    }
  }

  const isSameDay = distance <= 10.0;

  if (isSameDay) {
    return {
      distanceKm: distance,
      deliveryType: 'Same-Day',
      slaLabel: `⚡ Same-Day Delivery (~${distance.toFixed(1)} km)`,
      badgeText: `Same-Day (${distance.toFixed(1)} km)`,
      description: `Delivery location and shop are within ~8-10 km gap (${distance.toFixed(1)} km). Guaranteed Same-Day doorstep fitting!`,
      isDelayed: false,
      colorClass: 'text-emerald-700 border-emerald-300',
      bgClass: 'bg-emerald-50 text-emerald-800',
    };
  } else {
    return {
      distanceKm: distance,
      deliveryType: '2 Days',
      slaLabel: `🚚 2 Days Delivery (${distance.toFixed(1)} km - Inter-zone Transit)`,
      badgeText: `2 Days (${distance.toFixed(1)} km)`,
      description: `Gap between delivery PIN (${areaData.pin}) and shop is >10 km (${distance.toFixed(1)} km). Inter-zone transit requires 2 days delivery window.`,
      isDelayed: true,
      colorClass: 'text-amber-700 border-amber-300',
      bgClass: 'bg-amber-50 text-amber-900',
    };
  }
}
