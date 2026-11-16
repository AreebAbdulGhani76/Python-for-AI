import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId || !sessionId.trim()) {
      return NextResponse.json(
        { detail: 'Missing required query parameter: session_id' },
        { status: 400 }
      );
    }

    const targetUrl = `${BACKEND_URL}/ai/history?session_id=${encodeURIComponent(sessionId.trim())}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const backendResponse = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      const data = await backendResponse.json();

      if (!backendResponse.ok) {
        return NextResponse.json(
          {
            detail: data.detail || `Backend returned error status ${backendResponse.status}`,
          },
          { status: backendResponse.status }
        );
      }

      return NextResponse.json(data, { status: 200 });
    } catch (fetchErr: unknown) {
      clearTimeout(timeoutId);
      const isAbort = (fetchErr as Error)?.name === 'AbortError';
      const errorMessage = isAbort
        ? 'Request timed out waiting for backend history.'
        : `Unable to connect to FastAPI backend at ${BACKEND_URL}. Ensure the backend is running.`;

      console.error('[API Proxy /api/history error]:', fetchErr);
      return NextResponse.json(
        { detail: errorMessage, messages: [] },
        { status: 502 }
      );
    }
  } catch (err: unknown) {
    console.error('[API Proxy /api/history unhandled error]:', err);
    return NextResponse.json(
      { detail: 'Internal server error while retrieving history.', messages: [] },
      { status: 500 }
    );
  }
}
