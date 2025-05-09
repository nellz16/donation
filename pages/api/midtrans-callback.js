import crypto from 'crypto';
import { updateTransaction } from '../../server/db';

export default async function handler(req, res) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const signature = req.headers['x-callback-signature'];
  const payload = JSON.stringify(req.body);
  const expected = crypto.createHmac('sha512', serverKey).update(payload).digest('hex');

  if (signature !== expected) {
    return res.status(401).send('Invalid signature');
  }

  const { order_id, transaction_status } = req.body;
  await updateTransaction(order_id, transaction_status);
  res.status(200).send('OK');
}
