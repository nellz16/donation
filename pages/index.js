import DonationForm from '../components/DonationForm';
import Leaderboard from '../components/Leaderboard';
import RecentDonations from '../components/RecentDonations';
import useSWR from 'swr';
import axios from 'axios';
import { useDonations } from '../context/DonationContext';
const fetcher = url => axios.get(url).then(r => r.data);
export default function Home() {
  const { data, error } = useSWR('/api/donations', fetcher, { refreshInterval: 5000 });
  const { setStats } = useDonations();
  if (data) setStats(data);
  return (
    <div className="container">
      <h1 className="text-5xl font-bold text-primary text-center mb-6">ZhivLux Donation</h1>
      {error && <div className="text-red-500 text-center mb-4">Gagal memuat data</div>}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Leaderboard list={data?.leaderboard || []} />
          <RecentDonations list={data?.recent || []} />
        </div>
        <DonationForm />
      </div>
      <p className="mt-12 text-sm text-center text-gray-500">© 2025 ZhivLux. All rights reserved.</p>
    </div>
  );
}
