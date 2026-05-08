export const prerender = false;

import { proxyX402Request } from '../../lib/merchant-proxy';

export async function POST({ request }: { request: Request }) {
  return proxyX402Request('settle', request);
}
