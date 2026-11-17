import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';
const BACKEND_API_KEY = process.env.BACKEND_API_KEY;

export async function GET() {
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${BACKEND_URL}/`, {
      method: 'GET',
      headers: BACKEND_API_KEY ? { 'X-API-KEY': BACKEND_API_KEY } : undefined,
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json({
        status: 'ok',
        message: data.message || 'FastAPI backend is responsive.',
        backendUrl: BACKEND_URL,
        latencyMs: Date.now() - startTime,
        timestamp: Date.now(),
      });
    }

    return NextResponse.json(
      {
        status: 'error',
        message: `Backend returned status ${res.status}`,
        backendUrl: BACKEND_URL,
        timestamp: Date.now(),
      },
      { status: res.status }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      {
        status: 'error',
        message: `Unable to reach backend at ${BACKEND_URL}`,
        backendUrl: BACKEND_URL,
        error: (err as Error)?.message || 'Connection error',
        timestamp: Date.now(),
      },
      { status: 503 }
    );
  }
}
