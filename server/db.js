import { Redis } from '@upstash/redis';
const redis = new Redis({ url: process.env.REDIS_URL, token: process.env.REDIS_TOKEN });
const TOTAL_KEY       = 'donation:total';
const LEADERBOARD_KEY = 'donation:leaderboard';

const PENDING_TTL = 3600;

export async function recordPending({ name, amount, anon, deviceId, orderId }) {
  // Simpan detail di hash untuk mudah lookup dan auto-expire
  const key = `pending:${orderId}`;
  await redis.set(key, JSON.stringify({ name, amount, anon, deviceId, orderId, ts: Date.now() }), { ex: PENDING_TTL });
}

export async function recordSuccess(pendingObj) {
  const { name, amount, anon, deviceId, orderId } = pendingObj;

  // Hapus pending key
  await redis.del(`pending:${orderId}`);

  // Update total donasi
  await redis.incrby(TOTAL_KEY, amount);

  // Update leaderboard (deviceId memastikan unik)
  if (!anon) {
    await redis.zincrby(LEADERBOARD_KEY, amount, `${name}::${deviceId}`);
  }

  await redis.lpush('donation:list', JSON.stringify({ name, amount, anon, deviceId, orderId, ts: Date.now() }));
  await redis.ltrim('donation:list', 0, 4);
}

export async function getStats() {
  // Total dana
  const total = parseInt(await redis.get(TOTAL_KEY) ?? '0', 10);

  // Top 10 leaderboard
  const raw = await redis.zrange(LEADERBOARD_KEY, 0, 9, { rev: true, withScores: true });
  const leaderboard = [];
  for (let i = 0; i < raw.length; i += 2) {
    const [name] = raw[i].split('::');
    leaderboard.push({ name, total: parseInt(raw[i+1], 10) });
  }

  const recentRaw = await redis.lrange('donation:list', 0, 4);
  const recent = [];
  for (const str of recentRaw) {
    try {
      recent.push(JSON.parse(str));
    } catch {
    }
  }

  return { total, leaderboard, recent };
}
