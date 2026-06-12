import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_URL_READ_ONLY_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { endpoint } = req.body;
    if (!endpoint) {
      return res.status(400).json({ error: 'Missing endpoint' });
    }

    const key = `sub:${endpoint.slice(-32)}`;
    await redis.del(key);

    const existingKeys = (await redis.get('sub:keys')) || [];
    await redis.set('sub:keys', existingKeys.filter((k) => k !== key));

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Unsubscribe error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
