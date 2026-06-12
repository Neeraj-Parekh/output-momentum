import { Redis } from '@upstash/redis';
import webPush from 'web-push';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_URL_READ_ONLY_TOKEN,
});

const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const VAPID_EMAIL = process.env.VAPID_EMAIL || 'mailto:noreply@output-momentum.vercel.app';

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webPush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC, VAPID_PRIVATE);
}

function getHourUTC() {
  return new Date().getUTCHours();
}

function isReminderTime(preferences, hourUTC) {
  // 8 AM UTC = morning reminder, 9 PM UTC = evening reminder
  // Adjust for user timezone in the client-side preferences
  const morning = preferences?.morning !== false;
  const evening = preferences?.evening !== false;
  if (hourUTC === 8 && morning) return { type: 'morning', text: 'Good morning — time to log your habits.' };
  if (hourUTC === 21 && evening) return { type: 'evening', text: 'Evening check-in — what did you ship today?' };
  return null;
}

export default async function handler(req, res) {
  // Only allow GET (Vercel cron calls GET)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
    return res.status(200).json({ ok: false, reason: 'VAPID keys not configured' });
  }

  try {
    const keys = (await redis.get('sub:keys')) || [];
    const hourUTC = getHourUTC();
    let sent = 0;
    let failed = 0;
    let skipped = 0;

    for (const key of keys) {
      const sub = await redis.get(key);
      if (!sub || !sub.endpoint) {
        skipped++;
        continue;
      }

      const reminder = isReminderTime(sub.preferences, hourUTC);
      if (!reminder) {
        skipped++;
        continue;
      }

      const payload = JSON.stringify({
        title: reminder.type === 'morning' ? '☀️ Morning Check-in' : '🌙 Evening Wrap-up',
        body: reminder.text,
        url: '/',
        tag: `habit-reminder-${reminder.type}`
      });

      try {
        await webPush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          payload,
          { TTL: 3600 }
        );
        sent++;
      } catch (err) {
        failed++;
        if (err.statusCode === 404 || err.statusCode === 410) {
          await redis.del(key);
          const remaining = keys.filter((k) => k !== key);
          await redis.set('sub:keys', remaining);
        }
      }
    }

    return res.status(200).json({ ok: true, sent, failed, skipped });
  } catch (err) {
    console.error('Push error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
