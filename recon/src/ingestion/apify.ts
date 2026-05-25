// ─── Apify client wrapper ─────────────────────────────────────────────────────
// Thin wrapper around apify-client so all other modules stay decoupled from it.
// Falls back gracefully when APIFY_TOKEN is absent (--mock mode).

import { ApifyClient } from 'apify-client';

let _client: ApifyClient | null = null;

export function getApifyClient(): ApifyClient {
  if (!_client) {
    const token = process.env.APIFY_TOKEN;
    if (!token) {
      throw new Error(
        'APIFY_TOKEN is not set. Run with --mock to use fixture data instead of live Apify calls.',
      );
    }
    _client = new ApifyClient({ token });
  }
  return _client;
}

export function hasApifyToken(): boolean {
  return Boolean(process.env.APIFY_TOKEN);
}

/**
 * Run an Apify actor and return its dataset items.
 * Caller is responsible for shaping the input object per actor requirements.
 */
export async function runActor<T = Record<string, unknown>>(
  actorId:  string,
  input:    Record<string, unknown>,
  memoryMb: number = 1024,
): Promise<T[]> {
  const client = getApifyClient();
  console.log(`  [apify] running actor ${actorId}...`);

  const run = await client.actor(actorId).call(input, { memory: memoryMb });

  if (!run.defaultDatasetId) {
    throw new Error(`Actor ${actorId} did not produce a dataset`);
  }

  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  console.log(`  [apify] actor ${actorId} returned ${items.length} items`);
  return items as T[];
}
