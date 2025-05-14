import crypto from 'crypto';
import { recordSuccess } from '@/server/db';
import { redis } from '@/lib/redis';

export const config = {
  api: {
    bodyParser: true
  }
};

export default async function handler(req, res) {
  const {
    order_id,
    status_code,
    gross_amount,
    transaction_status,
    signature_key
  } = req.body;

  const expected = crypto
    .createHash('sha512')
    .update(order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY)
    .digest('hex');

  console.log('received signature_key:', signature_key);
  console.log('expected signature:', expected);

  if (signature_key !== expected) {
    console.error('Invalid Signature, callback rejected');
    return res.status(401).send('Invalid signature');
  }

  if (transaction_status === 'settlement') {
    const pending = await redis.get(`pending:${order_id}`);
    if (pending) {
      const data = JSON.parse(pending);
      await redis.del(`pending:${order_id}`);
      await recordSuccess(data);
    }
  }

  return res.status(200).send('OK');
}
