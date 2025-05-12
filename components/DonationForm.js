import { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export default function DonationForm() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [anon, setAnon] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (anon) {
      setName('Anonymous');
    } else if (name === 'Anonymous') {
      setName('');
    }
  }, [anon]);

  const formatNumber = (val) =>
    val
      .replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const handleAmountChange = (e) => {
    setAmount(formatNumber(e.target.value));
  };

  const handleDonate = async () => {
    setIsLoading(true);
    const deviceId = localStorage.getItem('deviceId') || uuidv4();
    localStorage.setItem('deviceId', deviceId);
    const order_id = uuidv4();
    try {
      const resp = await axios.post('/api/create-payment', {
        name,
        amount,
        message,
        anon,
        deviceId,
        order_id,
      });
      window.open(resp.data.qr_url, '_blank');
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('Gagal membuat pembayaran. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-full">
      <h2 className="text-2xl font-semibold mb-4">Donasi Sekarang</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nama</label>
          <input
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={anon}
            placeholder="Masukkan nama"
          />
          <div className="mt-1 flex items-center">
            <input
              type="checkbox"
              id="anon"
              checked={anon}
              onChange={(e) => setAnon(e.target.checked)}
            />
            <label htmlFor="anon" className="ml-2">Donasi Anonim</label>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Jumlah (Rp)</label>
          <input
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Pesan</label>
          <textarea
            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tuliskan pesanmu"
            rows={3}
          />
        </div>

        <button
          className="button-primary w-full text-center"
          onClick={handleDonate}
          disabled={isLoading}
        >
          {isLoading ? 'Sedang Membuat Pembayaran...' : 'Donasi Sekarang'}
        </button>
      </div>
    </div>
);
}
