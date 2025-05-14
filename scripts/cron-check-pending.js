import { Redis } from '@upstash/redis';
import midtransClient from 'midtrans-client';
import { recordSuccess } from '../server/db';

async function run() {
  const redis = new Redis({...});
  const core = new midtransClient.CoreApi({...});
  const keys = await redis.keys('pending:*');
  for (const key of keys) {
    const pendingStr = await redis.get(key);
    const { orderId } = JSON.parse(pendingStr);
    const status = await core.transactions.status(orderId);
    if (status.transaction_status === 'settlement') {
      const pendingObj = JSON.parse(pendingStr);
      await redis.del(key);
      await recordSuccess(pendingObj);
    }
  }
}

run();
