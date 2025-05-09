import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Admin() {
  const [auth, setAuth] = useState({ username: '', password: '' });
  const [loggedIn, setLoggedIn] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const handleLogin = () => {
    if (auth.username === 'admin' && auth.password === 'SuperSecret123') {
      setLoggedIn(true);
    } else {
      alert('Creds salah!');
    }
  };

  useEffect(() => {
    if (loggedIn) {
      axios.get('/api/donations')
        .then(res => {
          // untuk demo, kita fetch leaderboard & total,
          // idealnya buat endpoint khusus untuk full list transaksi
          setTransactions(res.data.leaderboard);
        });
    }
  }, [loggedIn]);

  return loggedIn ? (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Total Donasi</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t,i) => (
            <tr key={i}>
              <td>{t.name}</td>
              <td>Rp {t.total.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="max-w-sm mx-auto mt-20 p-4 border rounded">
      <input
        className="w-full p-2 mb-2 border rounded"
        placeholder="Username"
        onChange={e => setAuth({ ...auth, username: e.target.value })}
      />
      <input
        type="password"
        className="w-full p-2 mb-2 border rounded"
        placeholder="Password"
        onChange={e => setAuth({ ...auth, password: e.target.value })}
      />
      <button
        className="w-full p-2 bg-primary text-white rounded"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}
