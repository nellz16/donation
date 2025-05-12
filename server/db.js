import { Redis } from '@upstash/redis';
const redis = new Redis({ url: process.env.REDIS_URL, token: process.env.REDIS_TOKEN });
const TOTAL_KEY = 'donation:total';
const LEADERBOARD_KEY = 'donation:leaderboard';

export async function recordPending(id, name, amount) {
  const key = `donation:${id}`;
  const value = JSON.stringify({
    name,
    amount,
    status: 'Pending',
    ts: Date.now()
  });

  await redis.set(key, value);
  await redis.expire(key, 3600); // 1 jam
}

export async function recordSuccess({ name, amount, anon, deviceId, orderId }) {
  await redis.incrby(TOTAL_KEY, amount);
  if (!anon) {
    await redis.zincrby(LEADERBOARD_KEY, amount, `${name}::${deviceId}`);
  }
  // keep only latest 5 entries
  await redis.lpush('donation:list', JSON.stringify({ name, amount, anon, deviceId, orderId, ts: Date.now() }));
  await redis.ltrim('donation:list', 0, 4);
}

// Get stats: total, top 10 leaderboard, recent 5 donations
export async function getStats() {
  const total = parseInt(await redis.get(TOTAL_KEY) ?? '0', 10);
  // Upstash Redis client uses zrange with options for scores
  const raw = await redis.zrange(LEADERBOARD_KEY, 0, 9, { rev: true, withScores: true });
  // raw = [member1, score1, member2, score2, ...]
  const leaderboard = [];
  for (let i = 0; i < raw.length; i += 2) {
    const [name] = raw[i].split('::');
    leaderboard.push({ name, total: parseInt(raw[i+1], 10) });
  }
  // recent donations
  const recentRaw = await redis.lrange('donation:list', 0, 4);
  const recent = recentRaw.map(str => JSON.parse(str));
  return { total, leaderboard, recent };
}
