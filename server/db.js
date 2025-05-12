import { Redis } from '@upstash/redis';
const redis = new Redis({ url: process.env.REDIS_URL, token: process.env.REDIS_TOKEN });
const TOTAL_KEY = 'donation:total';
const LEADERBOARD_KEY = 'donation:leaderboard';

export async function recordSuccess({ name, amount, anon, deviceId, orderId }) {
  // only called on successful payment
  await redis.incrby(TOTAL_KEY, amount);
  if (!anon) {
    await redis.zincrby(LEADERBOARD_KEY, amount, `${name}::${deviceId}`);
  }
  // also push to recent list
  await redis.lpush('donation:list', JSON.stringify({ name, amount, anon, deviceId, orderId, ts: Date.now() }));
  await redis.ltrim('donation:list', 0, 4);
}

export async function getStats() {
  const total = parseInt(await redis.get(TOTAL_KEY) ?? '0', 10);
  const entries = await redis.zrangeWithScores(LEADERBOARD_KEY, 0, 9, { rev: true });
  const leaderboard = entries.map(({ member, score }) => ({ name: member.split('::')[0], total: parseInt(score, 10) }));
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
