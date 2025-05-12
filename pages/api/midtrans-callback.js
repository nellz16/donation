import crypto from 'crypto';
import { recordSuccess } from '../../server/db';
export default async function handler(req, res) {
  const sig = req.headers['x-callback-signature'];
  const expected = crypto.createHmac('sha512', process.env.MIDTRANS_SERVER_KEY).update(JSON.stringify(req.body)).digest('hex');
  if (sig !== expected) return res.status(401).send('Invalid signature');
  const { order_id, transaction_status, ...rest } = req.body;
  if (transaction_status === 'settlement') {
    const pendings = await redis.lrange('donation:pending', 0, -1);
    const obj = pendings.map(JSON.parse).find(d => d.orderId === order_id);
    if (obj) {
      await redis.lrem('donation:pending', 0, JSON.stringify(obj));
      await recordSuccess(obj);
    }
    const entry = pendings
     .map(str => JSON.parse(str))
     .find(d => d.orderId === order_id);
     if (entry) {
      await redis.lrem('donation:pending', 0, JSON.stringify(entry));
      await recordSuccess(entry);
     }
  }
  res.status(200).send('OK');
}
