import Head from 'next/head';
import DonationForm from '../components/DonationForm';
import Leaderboard from '../components/Leaderboard';
import useSWR from 'swr';
import axios from 'axios';

const fetcher = url => axios.get(url).then(res => res.data);

export default function Home() {
  const { data, error } = useSWR('/api/donations', fetcher, { refreshInterval: 5000 });

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <>
      <Head><title>ZhivLux Donation</title></Head>
      <div className="max-w-2xl mx-auto text-center p-4">
        <h1 className="text-4xl font-bold text-primary">ZhivLux</h1>
        <p className="mt-2 text-lg">Total Donasi: Rp {data.total.toLocaleString()}</p>
        <Leaderboard list={data.leaderboard} />
        <DonationForm />
      </div>
    </>
  );
}
