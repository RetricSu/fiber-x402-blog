export const prerender = false;

const MERCHANT_FIBER_RPC_URL = (import.meta.env.MERCHANT_FIBER_RPC_URL || 'http://127.0.0.1:8230').replace(/\/$/, '');

interface JsonRpcResponse<T> {
  result?: T;
  error?: {
    code?: number;
    message?: string;
  };
}

async function callMerchantRpc<T>(method: string, params: unknown[]): Promise<T> {
  const response = await fetch(MERCHANT_FIBER_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: crypto.randomUUID(),
      method,
      params,
    }),
  });

  const data = await response.json() as JsonRpcResponse<T>;

  if (!response.ok) {
    throw new Error(data.error?.message || `Merchant RPC request failed: ${response.status}`);
  }

  if (data.error) {
    throw new Error(data.error.message || 'Merchant RPC returned an error');
  }

  if (typeof data.result === 'undefined') {
    throw new Error('Merchant RPC returned no result');
  }

  return data.result;
}

export async function POST({ request }: { request: Request }) {
  try {
    const params = await request.json();
    const result = await callMerchantRpc('new_invoice', [params]);

    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to create invoice' },
      { status: 500 },
    );
  }
}
