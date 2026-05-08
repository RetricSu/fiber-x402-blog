export const prerender = false;

const MERCHANT_FIBER_RPC_URL = (import.meta.env.MERCHANT_FIBER_RPC_URL || 'http://127.0.0.1:8230').replace(/\/$/, '');

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.text();
    const response = await fetch(`${MERCHANT_FIBER_RPC_URL}/settle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to settle payment' },
      { status: 500 },
    );
  }
}
