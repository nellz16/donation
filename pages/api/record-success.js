import { recordSuccess } from '../../server/db';

export default async function handler(req, res) {
  const { order_id } = req.body;
  try {
    // update Redis leaderboard & total
    await recordSuccess({ orderId: order_id, /* other details */ });
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Gagal merekam donasi sukses' });
  }
}
