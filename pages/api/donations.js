import { getStats } from '../../server/db';

export default async function handler(req, res) {
  const { total, leaderboard, recent } = await getStats();
  res.status(200).json({ total, leaderboard, recent });
}
