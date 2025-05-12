import crypto from 'crypto';
import { Redis } from '@upstash/redis';
const redis = new Redis({ url, token });
export default async function handler(req, res) {
  if (status === 'settlement') {
    const pendings = await redis.lrange('donation:pending', 0, -1);
    const obj = pendings.map(JSON.parse).find(d => d.orderId === order_id);
    if (obj) {
      await redis.lrem('donation:pending', 0, JSON.stringify(obj));
      await recordSuccess(obj);
    }
  }
  res.send('OK');
}
