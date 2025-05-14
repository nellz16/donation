import midtransClient from 'midtrans-client';
import { recordPending } from '../../server/db'; // or adjust if using pending

export default async function handler(req, res) {
  try {
    const { name, amount, message, anon, deviceId, order_id } = req.body;
    const parsedAmount = parseInt(amount, 10);

    await recordPending({ name, amount: parsedAmount, anon, deviceId, orderId: order_id });

    const snap = new midtransClient.Snap({
      isProduction: true,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    });

    const parameter = {
      transaction_details: {
        order_id,
        gross_amount: parsedAmount,
      },
      credit_card: { secure: true },
      customer_details: { name: anon ? 'Anonymous' : name },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_CALLBACK_URL}?order_id=${order_id}`
      }
    };

    const payment = await snap.createTransaction(parameter);
    // Buka redirect_url di tab baru
    res.json({ data: { redirect_url: payment.redirect_url } });
  } catch (error) {
    console.error('Error in create-payment:', error);
    res.status(500).json({ error: 'Gagal membuat transaksi' });
  }
}
