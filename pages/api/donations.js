import { getStats } from '../../server/db';

export default async function handler(req, res) {
  const { total, leaderboard } = await getStats();
  res.status(200).json({ total, leaderboard });
}
