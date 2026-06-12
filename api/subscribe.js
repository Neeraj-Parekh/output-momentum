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
    const { subscription, preferences } = req.body;
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Invalid subscription' });
    }

    const key = `sub:${subscription.endpoint.slice(-32)}`;
    const record = {
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      preferences: preferences || { morning: true, evening: true },
      createdAt: Date.now()
    };

    await redis.set(key, record);

    const existingKeys = (await redis.get('sub:keys')) || [];
    if (!existingKeys.includes(key)) {
      await redis.set('sub:keys', [...existingKeys, key]);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
