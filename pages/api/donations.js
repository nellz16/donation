import { getStats } from '../../server/db';

export default async function handler(req, res) {
  try {
    const stats = await getStats();
    return res.status(200).json(stats);
  } catch (e) {
    console.error('getStats failed:', e);
    return res.status(200).json({
      total: 0,
      leaderboard: [],
      recent: []
    });
  }
}
