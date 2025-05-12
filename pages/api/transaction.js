import { getAllTransactions } from '../../server/db';
export default async function handler(req, res) {
  const tx = await getAllTransactions();
  res.status(200).json(tx);
}
