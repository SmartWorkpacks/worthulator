// ─── Intent Router — maps entity results to estimation routes ─────────────────
// Economic-model aware: routing resolves entity class, economic model, and
// lifecycle type alongside the URL intent slug.
// Pure deterministic logic, no async, no side-effects, SSR-safe.

import type {
  EntitySearchResult,
  IntentRoute,
  EstimationType,
  EconomicEntityClass,
  EconomicModel,
  LifecycleType,
  EconomicInterpretation,
} from './types';

// Maps canonical-name patterns → formula engine serviceType slugs
const SERVICE_TYPE_PATTERNS: [RegExp, string][] = [
  [/metal\s*roof/i,                          'metal-roof'],
  [/asphalt|shingle/i,                       'asphalt-shingle-roof'],
  [/roof(?!ing cost)/i,                      'asphalt-shingle-roof'],
  [/central\s*a[\s.]*c|air\s*cond/i,        'central-ac'],
  [/furnace/i,                               'furnace'],
  [/heat\s*pump/i,                           'heat-pump'],
  [/hvac/i,                                  'central-ac'],
  [/kitchen.*major|major.*kitchen/i,         'kitchen-remodel'],
  [/kitchen/i,                               'kitchen-remodel-minor'],
  [/solar.*10\s*kw|10\s*kw.*solar/i,        'solar-10kw'],
  [/solar/i,                                 'solar-6kw'],
  [/roofing/i,                               'asphalt-shingle-roof'],
];

export function deriveServiceType(name: string): string {
  for (const [pattern, type] of SERVICE_TYPE_PATTERNS) {
    if (pattern.test(name)) return type;
  }
  return 'asphalt-shingle-roof'; // safe default — home services vertical
}

function estimationTypeFor(entity: EntitySearchResult): EstimationType {
  if (entity.vertical === 'home-services') return 'service-estimate';
  if (entity.vertical === 'luxury') return 'appreciation';
  return 'market-value';
}

// ── Economic interpretation resolver ──────────────────────────────────────
// Maps vertical + estimationType to the correct economic interpretation model.
// Future: registry entityClass/economicModel fields will override these defaults.

const VERTICAL_CLASS: Record<string, EconomicEntityClass> = {
  'home-services': 'services',
  'electronics':   'products',
  'luxury':        'investments',   // luxury = investment-grade assets
  'sneakers':      'products',
};

const ESTIMATION_TYPE_MODEL: Record<EstimationType, EconomicModel> = {
  'service-estimate': 'project-economics',
  'market-value':     'resale-value',
  'appreciation':     'appreciation',
};

const ESTIMATION_TYPE_LIFECYCLE: Record<EstimationType, LifecycleType> = {
  'service-estimate': 'project-based',
  'market-value':     'one-time-purchase',
  'appreciation':     'lifecycle-asset',
};

export function resolveEconomicInterpretation(
  entity: EntitySearchResult,
  type: EstimationType,
): EconomicInterpretation {
  return {
    entityClass:   VERTICAL_CLASS[entity.vertical] ?? 'products',
    economicModel: ESTIMATION_TYPE_MODEL[type],
    lifecycleType: ESTIMATION_TYPE_LIFECYCLE[type],
  };
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function buildLabel(
  entity: EntitySearchResult,
  type: EstimationType,
  interpretation: EconomicInterpretation,
): string {
  if (type === 'service-estimate') return `${entity.canonicalName} Cost Estimate`;
  if (type === 'appreciation')     return `${entity.canonicalName} Value & Appreciation`;
  if (interpretation.economicModel === 'depreciation') return `${entity.canonicalName} Depreciation & Value`;
  if (interpretation.entityClass === 'investments')    return `${entity.canonicalName} Investment Value`;
  return `${entity.canonicalName} Resale Value`;
}

export function routeIntent(entity: EntitySearchResult): IntentRoute {
  const type           = estimationTypeFor(entity);
  const interpretation = resolveEconomicInterpretation(entity, type);
  const serviceType    = type === 'service-estimate'
    ? deriveServiceType(entity.canonicalName)
    : undefined;

  // URL slug: service types use their slug; market/appreciation use canonical name slug
  const intentSlug = serviceType ?? toSlug(entity.canonicalName);

  const params = new URLSearchParams({
    type,
    entityId:      entity.id,
    name:          entity.canonicalName,
    vertical:      entity.vertical,
    category:      entity.category,
    entityClass:   interpretation.entityClass,
    economicModel: interpretation.economicModel,
  });
  if (serviceType) params.set('serviceType', serviceType);

  return {
    type,
    label:          buildLabel(entity, type, interpretation),
    entityId:       entity.id,
    serviceType,
    canonicalName:  entity.canonicalName,
    category:       entity.category,
    vertical:       entity.vertical,
    href:           `/value-engine/result/${intentSlug}?${params.toString()}`,
    interpretation,
  };
}

// ── Vertical display metadata ──────────────────────────────────────────────
export const VERTICAL_META: Record<string, {
  emoji: string;
  label: string;
  color: string;
  entityClass: EconomicEntityClass;
  economicModel: EconomicModel;
}> = {
  electronics:     { emoji: '🔌', label: 'Electronics',    color: 'bg-sky-50 text-sky-700 border-sky-200',             entityClass: 'products',     economicModel: 'resale-value'       },
  luxury:          { emoji: '⌚', label: 'Luxury',         color: 'bg-amber-50 text-amber-700 border-amber-200',       entityClass: 'investments',  economicModel: 'appreciation'       },
  sneakers:        { emoji: '👟', label: 'Sneakers',       color: 'bg-purple-50 text-purple-700 border-purple-200',    entityClass: 'products',     economicModel: 'resale-value'       },
  'home-services': { emoji: '🏠', label: 'Home Services',  color: 'bg-emerald-50 text-emerald-700 border-emerald-200', entityClass: 'services',     economicModel: 'project-economics' },
};

// ── Economic model display labels ──────────────────────────────────────────
export const ECONOMIC_MODEL_LABELS: Record<EconomicModel, string> = {
  'project-economics':    'Project Cost',
  'depreciation':         'Depreciation',
  'appreciation':         'Appreciation',
  'resale-value':         'Resale Value',
  'recurring-burden':     'Recurring Cost',
  'ownership-burden':     'Ownership Cost',
  'future-value':         'Investment Value',
  'timeline-economics':   'Timeline Cost',
  'operational-economics':'Operational Cost',
};

// ── Entity class display labels ────────────────────────────────────────────
export const ENTITY_CLASS_LABELS: Record<EconomicEntityClass, string> = {
  'services':             'Service',
  'products':             'Product',
  'assets':               'Asset',
  'utilities':            'Utility',
  'ownership-economics':  'Ownership',
  'investments':          'Investment',
  'life-events':          'Life Event',
  'business-economics':   'Business',
};
