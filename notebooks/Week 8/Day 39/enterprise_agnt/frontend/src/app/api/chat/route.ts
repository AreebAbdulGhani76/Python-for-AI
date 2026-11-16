import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, session_id } = body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json(
        { detail: 'A non-empty query string is required.' },
        { status: 400 }
      );
    }

    if (!session_id || typeof session_id !== 'string') {
      return NextResponse.json(
        { detail: 'A valid session_id string is required.' },
        { status: 400 }
      );
    }

    const targetUrl = `${BACKEND_URL}/ai/chat`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for complex agent tool execution

    try {
      const backendResponse = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          session_id: session_id.trim(),
        }),
        signal: controller.signal,
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
        ? 'Request timed out waiting for the LangGraph agent to respond.'
        : `Unable to connect to FastAPI backend at ${BACKEND_URL}. Ensure the backend is running.`;

      console.error('[API Proxy /api/chat error]:', fetchErr);
      return NextResponse.json(
        { detail: errorMessage },
        { status: 502 }
      );
    }
  } catch (err: unknown) {
    console.error('[API Proxy /api/chat unhandled error]:', err);
    return NextResponse.json(
      { detail: 'Invalid JSON payload received.' },
      { status: 400 }
    );
  }
}
