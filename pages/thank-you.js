import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ThankYou() {
  const { query } = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      if (!query.order_id) return;
      try {
        // ① Panggil endpoint Anda sendiri untuk cek status
        const resp = await axios.get(`/api/check-status?order_id=${query.order_id}`);
        if (resp.data.transaction_status === 'settlement') {
          alert('Pembayaran Berhasil!\nTerima Kasih🙏🏻');
        } else {
          alert(`Status: ${resp.data.transaction_status}. Jika belum successful, silakan kembali lagi nanti.`);
        }
      } catch (e) {
        console.error(e);
        alert('Gagal cek status pembayaran. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    }
    checkStatus();
  }, [query.order_id]);

  return (
    <div className="container text-center p-8">
      {loading ? <p>Memeriksa status pembayaran…</p> : <p>Terima kasih atas donasi Anda!</p>}
    </div>
  );
}
