import midtransClient from 'midtrans-client';
export default async function handler(req, res) {
  try {
    const { name, amount, message, anon, deviceId, order_id } = req.body;
    const parsed = parseInt(amount.replace(/\./g, ''), 10);
    const snap = new midtransClient.Snap({ isProduction: true, serverKey: process.env.MIDTRANS_SERVER_KEY, clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY });
    const param = { transaction_details: { order_id, gross_amount: parsed }, credit_card: { secure: true }, customer_details: { name: anon ? 'Anonymous' : name } };
    const payment = await snap.createTransaction(param);
    return res.status(200).json({ qr_url: payment.redirect_url });
  } catch (e) {
    console.error('create-payment error:', e);
    res.status(500).json({ error: 'Gagal membuat transaksi' });
  }
}
