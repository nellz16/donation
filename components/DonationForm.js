import { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export default function DonationForm() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [anon, setAnon] = useState(false);
  const [qrUrl, setQrUrl] = useState(null);

  useEffect(() => {
    let id = localStorage.getItem('deviceId');
    if (!id) { id = uuidv4(); localStorage.setItem('deviceId', id); }
  }, []);

  const handleDonate = async () => {
    const deviceId = localStorage.getItem('deviceId');
    const order_id = uuidv4();
    const resp = await axios.post('/api/create-payment', { name, amount, message, anon, deviceId, order_id });
    setQrUrl(resp.data.qr_url);
    setTimeout(() => { setQrUrl(null); alert('Waktu Pembayaran sudah habis, silakan buat transaksi ulang 😊'); }, 3600000);
  };

  return (
    <div className="mt-6 p-4 bg-secondary rounded-xl shadow-lg">
      <input className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Nama" value={name} onChange={e => setName(e.target.value)} />
      <div className="flex items-center mb-2">
        <input type="checkbox" id="anon" checked={anon} onChange={e => setAnon(e.target.checked)} />
        <label htmlFor="anon" className="ml-2">Donasi Anonim</label>
      </div>
      <input type="number" className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Jumlah (Rp)" value={amount} onChange={e => setAmount(e.target.value)} />
      <textarea className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Pesan" value={message} onChange={e => setMessage(e.target.value)} />
      <button className="w-full p-2 bg-primary text-white rounded transition-transform transform hover:scale-105 active:scale-95" onClick={handleDonate}>Donasi Sekarang</button>
      {qrUrl && (
        <div className="mt-4 text-center">
          <img src={qrUrl} alt="QRIS" loading="lazy" width={200} height={200} className="inline-block" />
          <p className="mt-2">Scan QR di atas untuk bayar dalam 1 jam.</p>
        </div>
      )}
    </div>
  );
}
