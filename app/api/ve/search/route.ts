import { NextRequest, NextResponse } from 'next/server';
import { smartSearch } from '@/lib/value-engine/search';

const RECON_API = process.env.RECON_API_URL ?? 'http://127.0.0.1:4000';

/** Map a RegistryEntity to the EntitySearchResult shape clients expect */
function toSearchResult(e: ReturnType<typeof smartSearch>[number]) {
  return {
    id:            e.id,
    canonicalName: e.canonicalName,
    brand:         '',
    model:         '',
    category:      e.category,
    subcategory:   e.subcategory ?? '',
    vertical:      e.vertical,
    aliases:       e.aliases,
    priceRangeLow:  e.benchmark.lowUSD,
    priceRangeHigh: e.benchmark.highUSD,
  };
}

export async function GET(req: NextRequest) {
  const q     = req.nextUrl.searchParams.get('q') ?? '';
  const limit = req.nextUrl.searchParams.get('limit') ?? '8';

  if (!q.trim() || q.trim().length < 2) {
    return NextResponse.json({ success: true, data: [] });
  }

  try {
    const upstream = await fetch(
      `${RECON_API}/api/entity/search?q=${encodeURIComponent(q.trim())}&limit=${limit}`,
      { cache: 'no-store' },
    );

    if (!upstream.ok) {
      return NextResponse.json({ success: false, data: [], error: 'upstream error' }, { status: upstream.status });
    }

    const json = await upstream.json();

    // If recon returned results, use them; otherwise fall back to registry
    const data = json.data ?? [];
    if (!json.success || data.length === 0) {
      const fallback = smartSearch(q.trim(), parseInt(limit, 10) || 8).map(toSearchResult);
      return NextResponse.json({ success: true, data: fallback, source: 'registry' });
    }
    return NextResponse.json(json);
  } catch {
    // Recon API not running — fall back to registry smart search
    const fallback = smartSearch(q.trim(), parseInt(limit, 10) || 8).map(toSearchResult);
    if (fallback.length > 0) {
      return NextResponse.json({ success: true, data: fallback, source: 'registry' });
    }
    return NextResponse.json(
      { success: false, data: [], error: 'estimation engine unavailable' },
      { status: 503 },
    );
  }
}
