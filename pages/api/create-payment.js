import midtransClient from 'midtrans-client';
import { recordDonation } from '../../server/db';

export default async function handler(req, res) {
  try {
    const { name, amount, message, anon, deviceId, order_id } = req.body;
    const parsedAmount = parseInt(amount, 10);

    // 1) Buat transaksi di Midtrans Snap
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
      credit_card: {
        secure: true,
      },
      customer_details: {
        name: anon ? 'Anonymous' : name,
      },
    };

    const payment = await snap.createTransaction(parameter);
    const qrUrl = payment.actions.find(a => a.name === 'qr-code').url;

    // 2) Simpan record pending ke Redis (opsional: bisa dipakai untuk audit/log)
    await recordDonation({
      name: anon ? 'Anonymous' : name,
      amount: parsedAmount,
      message: message || '',
      anon,
      deviceId,
      orderId: order_id,
      pending: true,       // flag kalau masih pending
    });

    // 3) Kembalikan URL QRIS ke client
    res.status(200).json({ qr_url: qrUrl });
  } catch (error) {
    console.error('Error in create-payment:', error);
    res.status(500).json({ error: 'Gagal membuat transaksi' });
  }
}
