import { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
export default function DonationForm() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [anon, setAnon] = useState(false);
  const [qrUrl, setQrUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (anon) setName('Anonymous');
    else if (name === 'Anonymous') setName('');
  }, [anon]);

  function formatNumber(val) {
    return val.replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const handleAmount = e => {
    const formatted = formatNumber(e.target.value);
    setAmount(formatted);
  };

  const handleDonate = async () => {
    const deviceId = localStorage.getItem('deviceId') || uuidv4();
    localStorage.setItem('deviceId', deviceId);
    const order_id = uuidv4();
    const resp = await axios.post('/api/create-payment', { name, amount, message, anon, deviceId, order_id });
console.log('create-payment response:', resp.data);
const url = resp.data.redirect_url || resp.data.qr_url;
if (!url) {
  alert('Gagal mendapatkan URL pembayaran. Coba lagi nanti.');
  return;
}
window.open(url, '_blank');
    setTimeout(() => { setQrUrl(null); alert('Waktu Pembayaran sudah habis, silakan buat transaksi ulang 😊'); }, 3600000);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Donasi Sekarang</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-1">Nama</label>
          <input
            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={anon}
            placeholder="Masukkan nama"
          />
          <div className="mt-1">
            <input
              type="checkbox"
              id="anon"
              checked={anon}
              onChange={e => setAnon(e.target.checked)}
            />
            <label htmlFor="anon" className="ml-2">Donasi Anonim</label>
          </div>
        </div>
        <div>
          <label className="block mb-1">Jumlah (Rp)</label>
          <input
            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
            value={amount}
            onChange={handleAmount}
            placeholder="0"
          />
        </div>
        <div>
          <label className="block mb-1">Pesan</label>
          <textarea
            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Tuliskan pesanmu"
          />
        </div>
        <button className="button-primary w-full" onClick={handleDonate}disabled={isLoading}>{isLoading ? 'Sedang Membuat Pembayaran...' : 'Donasi Sekarang'}</button>
      </div>
      {qrUrl && (
        <div className="mt-6 text-center">
          <img src={qrUrl} alt="QRIS" loading="lazy" className="mx-auto mb-2" />
          <p className="text-gray-700">Scan QR di atas untuk bayar dalam 1 jam.</p>
        </div>
      )}
    </div>
  );
}
