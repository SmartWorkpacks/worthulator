// ─── WVE Entity Registry — Bootstrap & Public API — Phase 13 ─────────────────
// Initialises the singleton registry and re-exports the full public API.
// Import from this file for all registry operations.

export { EntityRegistry } from "./registry";
export type {
  RegistryEntity,
  BenchmarkProfile,
  RegionalProfile,
  MonetizationProfile,
  SeoProfile,
  QualityProfile,
  RegistryQueryFilters,
} from "./types";

import { EntityRegistry } from "./registry";
import { HOME_SERVICES_ENTITIES } from "./entries/homeServices";
import { ELECTRONICS_ENTITIES } from "./entries/electronics";
import { LUXURY_ENTITIES } from "./entries/luxury";
import { SNEAKERS_ENTITIES } from "./entries/sneakers";

// ── Singleton ─────────────────────────────────────────────────────────────
const registry = new EntityRegistry();

registry.registerAll([
  ...HOME_SERVICES_ENTITIES,
  ...ELECTRONICS_ENTITIES,
  ...LUXURY_ENTITIES,
  ...SNEAKERS_ENTITIES,
]);

export { registry };
