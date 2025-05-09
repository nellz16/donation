import { getDonations } from '../../server/db';

export default async function handler(req, res) {
  const { total, leaderboard } = await getDonations();
  res.status(200).json({ total, leaderboard });
}
