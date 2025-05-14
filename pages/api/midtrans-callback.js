import crypto from 'crypto';
import { recordSuccess } from '../../server/db';
import { Redis } from '@upstash/redis';

const redis = new Redis({ url: process.env.REDIS_URL, token: process.env.REDIS_TOKEN });

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

  console.log('callback signature_key:', signature_key);
  console.log('expected signature:', expected);

  if (signature_key !== expected) {
    console.error('Invalid Signature, callback rejected');
    return res.status(401).send('Invalid signature');
  }

  if (transaction_status === 'settlement') {
    const pendingStr = await redis.get(`pending:${order_id}`);
    if (pendingStr) {
      const pendingObj = JSON.parse(pendingStr);
      await recordSuccess(pendingObj);
    }
  }
  return res.status(200).send('OK');
}
