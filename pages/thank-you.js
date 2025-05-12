import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function ThankYou() {
  const { query } = useRouter();

  useEffect(() => {
    if (query.transaction_status === 'settlement') {
      // 1) Tampilkan notifikasi pop-up
      alert('Pembayaran Berhasil!\nTerima Kasih🙏🏻');
      // 2) Panggil API recordSuccess di front-end agar langsung masuk leaderboard
      axios.post('/api/record-success', { order_id: query.order_id });
    }
  }, [query]);

  return <div>Terima Kasih atas donasi Anda!</div>;
}
