import { getStats } from '../../server/db';

export default async function handler(_, res) {
  try {
    const stats = await getStats();
    return res.status(200).json(stats);
  } catch (e) {
    console.error('getStats failed:', e);
    return res.status(200).json({ total: 0, leaderboard: [], recent: [] });
  }
}

export async function getStats() {
  const recentRaw = await redis.lrange('donation:list', 0, 4);
  const recent = recentRaw.map(str => {
    try { return JSON.parse(str); }
    catch { return null; }
  }).filter(x => x);
  return { total, leaderboard, recent };
}
