import Head from 'next/head';
import DonationForm from '../components/DonationForm';
import Leaderboard from '../components/Leaderboard';
import useSWR from 'swr';
import axios from 'axios';
import { useDonations } from '../context/DonationContext';

const fetcher = url => axios.get(url).then(res => res.data);
export default function Home() {
  const { data, error } = useSWR('/api/donations', fetcher, { refreshInterval: 5000 });
  const { setStats } = useDonations();
  if (error) return <div className="text-center p-4">Gagal memuat data</div>;
  if (data) setStats(data);
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-primary text-center mb-2">ZhivLux</h1>
      <p className="text-center text-lg mb-4">Total Donasi: <span className="font-semibold">Rp {data?.total.toLocaleString()}</span></p>
      <div className="grid gap-6 md:grid-cols-2">
        <Leaderboard list={data?.leaderboard || []} />
        <DonationForm />
      </div>
    </div>
  );
}
