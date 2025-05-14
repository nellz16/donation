import midtransClient from 'midtrans-client';
import { recordPending } from '../../server/db';

export default async function handler(req, res) {
  try {
    const { name, amount, message, anon, deviceId, order_id } = req.body;
    const parsed = parseInt(amount, 10);

    await recordPending({ name, amount: parsed, anon, deviceId, orderId: order_id });

    const snap = new midtransClient.Snap({
      isProduction: true,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    });

    const parameter = {
      transaction_details: { order_id, gross_amount: parsed },
      credit_card: { secure: true },
      customer_details: { name: anon ? 'Anonymous' : name },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_CALLBACK_URL}?order_id=${order_id}`
      }
    };

    const payment = await snap.createTransaction(parameter);
    return res.status(200).json({ redirect_url: payment.redirect_url });
  } catch (e) {
    console.error('Error create-payment:', e);
    return res.status(500).json({ error: 'Gagal membuat transaksi' });
  }
}
