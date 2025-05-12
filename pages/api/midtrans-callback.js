import crypto from 'crypto';
import { recordSuccess } from '../../server/db';
export default async function handler(req, res) {
  const sig = req.headers['x-callback-signature'];
  const expected = crypto.createHmac('sha512', process.env.MIDTRANS_SERVER_KEY).update(JSON.stringify(req.body)).digest('hex');
  if (sig !== expected) return res.status(401).send('Invalid signature');
  const { order_id, transaction_status, ...rest } = req.body;
  if (transaction_status === 'settlement') {
    const { name, amount, anon, deviceId } = JSON.parse(rest.raw_message || '{}');
    await recordSuccess({ name, amount, anon, deviceId, orderId: order_id });
  }
  res.status(200).send('OK');
}
