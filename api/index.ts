import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function (req: VercelRequest, res: VercelResponse) {
  // We import from the built output since we run nest build
  const { default: handler } = await import('../dist/src/main.js');
  return handler(req, res);
}
