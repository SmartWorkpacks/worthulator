import type { VerticalSlug, SourceSlug } from '../types';

// ─── Entity definition ────────────────────────────────────────────────────────

export interface EntityModel {
  canonical:  string;        // e.g. "Ninja AF101"
  patterns:   RegExp[];      // regex patterns against normalised title
  aliases:    string[];      // exact lowercase alias strings
  priceRange: {
    new?:          [number, number];
    used?:         [number, number];
    refurbished?:  [number, number];
  };
}

export interface BrandCatalog {
  brand:       string;
  category:    string;
  subcategory: string;
  models:      EntityModel[];
}

// ─── Vertical config ──────────────────────────────────────────────────────────

export interface VerticalConfig {
  slug:         VerticalSlug;
  label:        string;
  sources:      SourceSlug[];
  apifyActors:  Record<SourceSlug, string>;   // actor IDs
  catalog:      BrandCatalog[];
  /**
   * Subjective feasibility priors — used as soft priors in Phase 5.
   * These are NOT computed; they reflect domain knowledge about each vertical.
   */
  priors: {
    monetizationPotential:  number;  // 0–10
    freshnessRequirement:   'realtime' | 'daily' | 'weekly' | 'monthly';
    seoPotential:           number;  // 0–10
    scalabilityNotes:       string;
  };
}

// ─── Electronics ──────────────────────────────────────────────────────────────

const ELECTRONICS: VerticalConfig = {
  slug:    'electronics',
  label:   'Electronics',
  sources: ['amazon', 'ebay'],
  apifyActors: {
    amazon:       'apify/amazon-product-scraper',
    ebay:         'apify/ebay-scraper',
    stockx:       '',
    'google-maps': '',
    angi:         '',
    fixture:      '',
  },
  catalog: [
    {
      brand: 'Ninja', category: 'electronics', subcategory: 'kitchen-appliance',
      models: [
        { canonical: 'Ninja AF101', patterns: [/af[- ]?101/i], aliases: ['ninja af101', 'ninja 4 quart air fryer', 'ninja 4qt air fryer'], priceRange: { new: [69, 110], used: [30, 75] } },
        { canonical: 'Ninja AF161', patterns: [/af[- ]?161/i, /5\.5\s*qt/i], aliases: ['ninja af161', 'ninja xl air fryer', 'ninja 5.5 quart'], priceRange: { new: [89, 140], used: [40, 90] } },
        { canonical: 'Ninja Speedi SF301', patterns: [/speedi/i, /sf[- ]?301/i], aliases: ['ninja speedi', 'ninja sf301'], priceRange: { new: [99, 160], used: [50, 110] } },
        { canonical: 'Ninja Foodi DZ201', patterns: [/dz[- ]?201/i, /dualzone/i, /dual[- ]?zone/i], aliases: ['ninja foodi dual zone', 'ninja dz201'], priceRange: { new: [149, 250], used: [80, 150] } },
      ],
    },
    {
      brand: 'Dyson', category: 'electronics', subcategory: 'vacuum',
      models: [
        { canonical: 'Dyson V8',  patterns: [/\bv8\b/i],  aliases: ['dyson v8', 'dyson v8 absolute', 'dyson v8 animal'], priceRange: { new: [349, 450], used: [100, 250] } },
        { canonical: 'Dyson V11', patterns: [/\bv11\b/i], aliases: ['dyson v11', 'dyson v11 torque drive'], priceRange: { new: [399, 550], used: [180, 350] } },
        { canonical: 'Dyson V12 Detect Slim', patterns: [/\bv12\b/i], aliases: ['dyson v12', 'dyson v12 detect slim'], priceRange: { new: [449, 600], used: [200, 400] } },
        { canonical: 'Dyson V15 Detect', patterns: [/\bv15\b/i], aliases: ['dyson v15', 'dyson v15 detect'], priceRange: { new: [599, 750], used: [280, 500] } },
      ],
    },
    {
      brand: 'Samsung', category: 'electronics', subcategory: 'tv',
      models: [
        { canonical: 'Samsung QLED 55" Q80C', patterns: [/q80c/i, /qled.*55/i], aliases: ['samsung q80c 55', 'samsung qled 55'], priceRange: { new: [799, 1100], used: [400, 750] } },
        { canonical: 'Samsung OLED 65" S90C', patterns: [/s90c/i, /oled.*65/i], aliases: ['samsung s90c 65', 'samsung oled 65'], priceRange: { new: [1299, 2000], used: [700, 1200] } },
      ],
    },
    {
      brand: 'Apple', category: 'electronics', subcategory: 'laptop',
      models: [
        { canonical: 'MacBook Air M2 13"', patterns: [/macbook\s*air.*m2/i, /m2.*macbook\s*air/i], aliases: ['macbook air m2', 'apple macbook air m2 13'], priceRange: { new: [999, 1299], used: [650, 950] } },
        { canonical: 'MacBook Pro M3 14"', patterns: [/macbook\s*pro.*m3.*14/i, /m3.*macbook\s*pro/i], aliases: ['macbook pro m3 14', 'apple macbook pro m3'], priceRange: { new: [1599, 2000], used: [1100, 1500] } },
      ],
    },
  ],
  priors: {
    monetizationPotential:  8,
    freshnessRequirement:   'daily',
    seoPotential:           9,
    scalabilityNotes:       'Massive SKU catalog. Model numbers are highly structured — pattern matching performs well. Amazon + eBay give strong price signal. Long-tail queries (accessories, bundles) may dilute confidence.',
  },
};

// ─── Luxury ───────────────────────────────────────────────────────────────────

const LUXURY: VerticalConfig = {
  slug:    'luxury',
  label:   'Luxury',
  sources: ['ebay'],
  apifyActors: {
    amazon:       '',
    ebay:         'apify/ebay-scraper',
    stockx:       '',
    'google-maps': '',
    angi:         '',
    fixture:      '',
  },
  catalog: [
    {
      brand: 'Rolex', category: 'luxury', subcategory: 'watch',
      models: [
        { canonical: 'Rolex Submariner 126610LN', patterns: [/126610ln/i, /submariner.*black/i], aliases: ['rolex submariner black', 'rolex sub 126610ln', 'rolex sub black'], priceRange: { new: [14000, 18000], used: [11000, 15000] } },
        { canonical: 'Rolex Submariner 126610LV', patterns: [/126610lv/i, /submariner.*green/i, /submariner.*hulk/i, /submariner.*kermit/i], aliases: ['rolex submariner green', 'rolex hulk', 'rolex kermit'], priceRange: { new: [16000, 22000], used: [13000, 18000] } },
        { canonical: 'Rolex Datejust 41 126300', patterns: [/126300/i, /datejust.*41/i], aliases: ['rolex datejust 41', 'rolex dj41', 'rolex 126300'], priceRange: { new: [9000, 12000], used: [7500, 10500] } },
        { canonical: 'Rolex GMT-Master II 126710BLRO', patterns: [/126710blro/i, /gmt.*pepsi/i, /pepsi.*gmt/i], aliases: ['rolex gmt pepsi', 'rolex 126710blro'], priceRange: { new: [16000, 22000], used: [13000, 18000] } },
      ],
    },
    {
      brand: 'Omega', category: 'luxury', subcategory: 'watch',
      models: [
        { canonical: 'Omega Seamaster 300M 210.30.42.20.01.001', patterns: [/seamaster.*300m/i, /210\.30/i], aliases: ['omega seamaster 300m', 'omega seamaster diver', 'omega 300m'], priceRange: { new: [5200, 6500], used: [3800, 5200] } },
        { canonical: 'Omega Speedmaster Moonwatch 310.30.42.50.01.001', patterns: [/speedmaster.*moonwatch/i, /moonwatch/i, /310\.30/i], aliases: ['omega speedmaster moonwatch', 'omega moonwatch', 'omega speedy moonwatch'], priceRange: { new: [6300, 7800], used: [4500, 6500] } },
      ],
    },
  ],
  priors: {
    monetizationPotential:  9,
    freshnessRequirement:   'daily',
    seoPotential:           8,
    scalabilityNotes:       'Reference numbers are unique and highly structured. Price volatility is lower than sneakers but authentication complexity is high. Grey market + secondary market data is rich on eBay. Affiliate potential is very high.',
  },
};

// ─── Sneakers ─────────────────────────────────────────────────────────────────

const SNEAKERS: VerticalConfig = {
  slug:    'sneakers',
  label:   'Sneakers',
  sources: ['stockx', 'ebay'],
  apifyActors: {
    amazon:       '',
    ebay:         'apify/ebay-scraper',
    stockx:       'bebity/stockx-scraper',
    'google-maps': '',
    angi:         '',
    fixture:      '',
  },
  catalog: [
    {
      brand: 'Nike', category: 'sneakers', subcategory: 'athletic',
      models: [
        { canonical: 'Nike Air Force 1 Low White', patterns: [/air\s*force\s*1.*low.*white/i, /af1.*low.*white/i], aliases: ['af1 low white', 'nike af1 white', 'nike air force 1 low white'], priceRange: { new: [90, 120], used: [50, 90] } },
        { canonical: 'Nike Dunk Low Panda', patterns: [/dunk\s*low.*panda/i, /dunk.*low.*black.*white/i], aliases: ['nike dunk low panda', 'dunk panda', 'nike dunk panda'], priceRange: { new: [100, 180], used: [60, 130] } },
        { canonical: 'Nike Air Max 90', patterns: [/air\s*max\s*90/i], aliases: ['nike air max 90', 'am90', 'nike am90'], priceRange: { new: [110, 160], used: [50, 100] } },
      ],
    },
    {
      brand: 'Jordan', category: 'sneakers', subcategory: 'basketball',
      models: [
        { canonical: 'Air Jordan 1 Retro High OG Chicago', patterns: [/jordan\s*1.*chicago/i, /aj1.*chicago/i], aliases: ['jordan 1 chicago', 'aj1 chicago', 'air jordan 1 chicago'], priceRange: { new: [180, 400], used: [100, 300] } },
        { canonical: 'Air Jordan 4 Retro Military Black', patterns: [/jordan\s*4.*military/i, /aj4.*military/i], aliases: ['jordan 4 military black', 'aj4 military', 'jordan 4 military'], priceRange: { new: [210, 350], used: [130, 280] } },
        { canonical: 'Air Jordan 11 Retro Bred', patterns: [/jordan\s*11.*bred/i, /aj11.*bred/i], aliases: ['jordan 11 bred', 'aj11 bred', 'air jordan 11 bred'], priceRange: { new: [220, 400], used: [130, 320] } },
      ],
    },
    {
      brand: 'Yeezy', category: 'sneakers', subcategory: 'lifestyle',
      models: [
        { canonical: 'Yeezy Boost 350 V2 Zebra', patterns: [/yeezy.*350.*v2.*zebra/i, /350.*zebra/i], aliases: ['yeezy 350 zebra', 'yeezy v2 zebra', 'adidas yeezy zebra'], priceRange: { new: [220, 400], used: [130, 300] } },
        { canonical: 'Yeezy Boost 700 Wave Runner', patterns: [/yeezy.*700.*wave/i, /700.*wave\s*runner/i], aliases: ['yeezy 700 wave runner', 'yeezy waverunner'], priceRange: { new: [300, 500], used: [180, 380] } },
      ],
    },
  ],
  priors: {
    monetizationPotential:  8,
    freshnessRequirement:   'realtime',
    seoPotential:           9,
    scalabilityNotes:       'Prices are highly size-dependent — same shoe can vary $50–$200 by size. StockX provides authenticated resale data with bid/ask spreads. Entity matching is complex due to colourway naming. Very high SEO volume.',
  },
};

// ─── Home Services ────────────────────────────────────────────────────────────

const HOME_SERVICES: VerticalConfig = {
  slug:    'home-services',
  label:   'Home Services',
  sources: ['google-maps', 'angi'],
  apifyActors: {
    amazon:       '',
    ebay:         '',
    stockx:       '',
    'google-maps': 'apify/google-maps-scraper',
    angi:         'apify/website-content-crawler',
    fixture:      '',
  },
  catalog: [
    {
      brand: 'Generic', category: 'home-services', subcategory: 'roofing',
      models: [
        { canonical: 'Asphalt Shingle Roof Replacement', patterns: [/asphalt.*shingle/i, /shingle.*roof/i, /roof\s*replacement/i], aliases: ['shingle roof replacement', 'asphalt roof replacement', 'roof replacement'], priceRange: { new: [8000, 20000] } },
        { canonical: 'Metal Roof Installation', patterns: [/metal.*roof/i], aliases: ['metal roof', 'metal roofing'], priceRange: { new: [15000, 40000] } },
      ],
    },
    {
      brand: 'Generic', category: 'home-services', subcategory: 'hvac',
      models: [
        { canonical: 'Central AC Installation', patterns: [/central.*ac/i, /ac\s*install/i, /air\s*condition.*install/i], aliases: ['central ac install', 'central air conditioning', 'ac installation'], priceRange: { new: [3800, 9000] } },
        { canonical: 'Furnace Replacement', patterns: [/furnace/i], aliases: ['furnace replacement', 'furnace install', 'new furnace'], priceRange: { new: [2500, 7000] } },
        { canonical: 'Heat Pump Installation', patterns: [/heat\s*pump/i], aliases: ['heat pump install', 'heat pump replacement'], priceRange: { new: [4000, 12000] } },
      ],
    },
    {
      brand: 'Generic', category: 'home-services', subcategory: 'kitchen-remodel',
      models: [
        { canonical: 'Minor Kitchen Remodel', patterns: [/minor.*kitchen/i, /kitchen.*refresh/i, /kitchen.*update/i], aliases: ['minor kitchen remodel', 'kitchen refresh', 'kitchen update'], priceRange: { new: [10000, 25000] } },
        { canonical: 'Major Kitchen Remodel', patterns: [/major.*kitchen/i, /full.*kitchen/i, /complete.*kitchen/i], aliases: ['major kitchen remodel', 'full kitchen remodel', 'gut kitchen'], priceRange: { new: [40000, 130000] } },
      ],
    },
    {
      brand: 'Generic', category: 'home-services', subcategory: 'solar',
      models: [
        { canonical: 'Residential Solar Panel Installation 6kW', patterns: [/solar.*6\s*kw/i, /6\s*kw.*solar/i], aliases: ['6kw solar', 'solar 6kw', 'solar installation 6kw'], priceRange: { new: [14000, 22000] } },
        { canonical: 'Residential Solar Panel Installation 10kW', patterns: [/solar.*10\s*kw/i, /10\s*kw.*solar/i], aliases: ['10kw solar', 'solar 10kw'], priceRange: { new: [22000, 35000] } },
      ],
    },
  ],
  priors: {
    monetizationPotential:  9,
    freshnessRequirement:   'weekly',
    seoPotential:           8,
    scalabilityNotes:       'Prices vary enormously by region — normalization is critical. Entity resolution is simpler (fewer distinct SKUs). Monetisation via contractor lead-gen is highest of all four verticals. Freshness requirements are lower than products.',
  },
};

// ─── Registry ─────────────────────────────────────────────────────────────────

export const VERTICAL_CONFIGS: Record<VerticalSlug, VerticalConfig> = {
  electronics:      ELECTRONICS,
  luxury:           LUXURY,
  sneakers:         SNEAKERS,
  'home-services':  HOME_SERVICES,
};

export function getVertical(slug: VerticalSlug): VerticalConfig {
  return VERTICAL_CONFIGS[slug];
}

export const ALL_VERTICALS: VerticalSlug[] = ['electronics', 'luxury', 'sneakers', 'home-services'];
