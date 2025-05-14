import midtransClient from 'midtrans-client';

export default async function handler(req, res) {
  const { order_id } = req.query;
  if (!order_id) return res.status(400).json({ error: 'order_id required' });

  // Inisialisasi Midtrans Core API
  const core = new midtransClient.CoreApi({
    isProduction: true,  // Production mode
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
  });

  try {
    // ② Panggil endpoint status transaksi
    const status = await core.transactions.status(order_id);
    // Jika sudah settlement, rekam sukses seperti webhook
    if (status.transaction_status === 'settlement') {
      const pendingStr = await redis.get(`pending:${order_id}`);
      if (pendingStr) {
        const pendingObj = JSON.parse(pendingStr);
        await redis.del(`pending:${order_id}`);
        await recordSuccess(pendingObj);
      }
    }
    // Kembalikan status lengkap ke front‑end
    return res.status(200).json(status);
  } catch (err) {
    console.error('check-status error:', err);
    return res.status(500).json({ error: 'Failed fetch status' });
  }
}
