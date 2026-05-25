import { NextRequest, NextResponse } from 'next/server';

const RECON_API = process.env.RECON_API_URL ?? 'http://127.0.0.1:4000';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'invalid JSON body' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ success: false, error: 'body must be an object' }, { status: 400 });
  }

  const b = body as Record<string, unknown>;

  // Route to the appropriate recon estimate endpoint
  const endpoint = b.serviceType != null ? '/api/estimate/service' : '/api/estimate/product';

  try {
    const upstream = await fetch(`${RECON_API}${endpoint}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
      cache:   'no-store',
    });

    if (!upstream.ok) {
      const err = await upstream.text().catch(() => 'upstream error');
      return NextResponse.json(
        { success: false, error: 'estimation engine error' },
        { status: upstream.status },
      );
    }

    const json = await upstream.json();
    return NextResponse.json(json);
  } catch {
    return NextResponse.json(
      { success: false, error: 'estimation engine unavailable' },
      { status: 503 },
    );
  }
}
