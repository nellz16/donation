import { Redis } from '@upstash/redis';
const redis = new Redis({ url: process.env.REDIS_URL, token: process.env.REDIS_TOKEN });
const TOTAL_KEY = 'donation:total';
const LEADERBOARD_KEY = 'donation:leaderboard';

export async function recordSuccess({ name, amount, anon, deviceId, orderId }) {
  await redis.incrby(TOTAL_KEY, amount);
  if (!anon) {
    await redis.zincrby(LEADERBOARD_KEY, amount, `${name}::${deviceId}`);
  }
  await redis.lpush('donation:list', JSON.stringify({ name, amount, anon, deviceId, orderId, ts: Date.now() }));
  await redis.ltrim('donation:list', 0, 4);
}

export async function getStats() {
  const total = parseInt(await redis.get(TOTAL_KEY) ?? '0', 10);
  const raw = await redis.zrange(LEADERBOARD_KEY, 0, 9, { rev: true, withScores: true });
  const leaderboard = [];
  for (let i = 0; i < raw.length; i += 2) {
    const [name] = raw[i].split('::');
    leaderboard.push({ name, total: parseInt(raw[i+1], 10) });
  }
  const recentRaw = await redis.lrange('donation:list', 0, 4);
  const recent = recentRaw.map(str => JSON.parse(str));
  return { total, leaderboard, recent };
}

export async function getAllTransactions() {
  const pending = await redis.lrange('donation:pending', 0, -1);
  const success = await redis.lrange('donation:list', 0, -1);
  return {
    pending: pending.map(JSON.parse),
    success: success.map(JSON.parse),
  };
}
