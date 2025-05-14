import crypto from 'crypto';
import { recordSuccess } from '../../server/db';
import { Redis } from '@upstash/redis';

const redis = new Redis({ url: process.env.REDIS_URL, token: process.env.REDIS_TOKEN });

export default async function handler(req, res) {
  const sig      = req.headers['x-callback-signature'];
  const expected = crypto.createHmac('sha512', process.env.MIDTRANS_SERVER_KEY)
                        .update(JSON.stringify(req.body))
                        .digest('hex');
  if (sig !== expected) return res.status(401).send('Invalid signature');

  const { order_id, transaction_status } = req.body;
  if (transaction_status === 'settlement') {
    const pendingStr = await redis.get(`pending:${order_id}`);
    if (pendingStr) {
      const pendingObj = JSON.parse(pendingStr);
      await recordSuccess(pendingObj);
    }
  }
  return res.status(200).send('OK');
}
