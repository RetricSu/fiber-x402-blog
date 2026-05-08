export const prerender = false;

import { callMerchantRpc } from '../../lib/merchant-proxy';

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
