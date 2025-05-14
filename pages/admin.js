import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Admin() {
  const [pendingList, setPendingList] = useState([]);
  const [successList, setSuccessList] = useState([]);

  useEffect(() => {
    axios.get('/api/transactions').then(res => {
      setPendingList(res.data.pending || []);
      setSuccessList(res.data.success || []);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold">Pending Transactions</h2>
        <table className="min-w-full bg-white mb-4">
          <thead>
            <tr>
              <th>Order ID</th><th>Name</th><th>Amount</th><th>Message</th><th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {pendingList.map((t, i) => (
              <tr key={i}>
                <td>{t.orderId}</td>
                <td>{t.anon ? 'Anonymous' : t.name}</td>
                <td>Rp {t.amount.toLocaleString()}</td>
                <td>{t.message || '-'}</td>
                <td>{new Date(t.ts).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Successful Transactions</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th>Order ID</th><th>Name</th><th>Amount</th><th>Message</th><th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {successList.map((t, i) => (
              <tr key={i}>
                <td>{t.orderId}</td>
                <td>{t.anon ? 'Anonymous' : t.name}</td>
                <td>Rp {t.amount.toLocaleString()}</td>
                <td>{t.message || '-'}</td>
                <td>{new Date(t.ts).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
