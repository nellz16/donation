import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

// Key names
const TOTAL_KEY = 'donation:total';
const LEADERBOARD_KEY = 'donation:leaderboard';

export async function recordDonation({ name, amount, anon, deviceId, orderId }) {
  // 1) Simpan detail donasi (opsional, bisa push ke list atau hash)
  await redis.lpush(`donation:list`, JSON.stringify({ name, amount, anon, deviceId, orderId, ts: Date.now() }));
  // 2) Update total donasi
  await redis.incrby(TOTAL_KEY, amount);
  // 3) Update leaderboard: gunakan deviceId sebagai member, skor = tambah amount
  if (!anon) {
    await redis.zincrby(LEADERBOARD_KEY, amount, `${name}::${deviceId}`);
  }
}

export async function getStats() {
  const total = parseInt(await redis.get(TOTAL_KEY) || '0', 10);

  const raw = await redis.zrange(LEADERBOARD_KEY, 0, 9, {
    rev: true,
    withScores: true
  });
  // raw = ['Nama1::id','1000','Nama2::id','900', …]

  const leaderboard = [];
  for (let i = 0; i < raw.length; i += 2) {
    const [name] = raw[i].split('::');
    leaderboard.push({ name, total: parseInt(raw[i+1], 10) });
  }

  return { total, leaderboard };
}
