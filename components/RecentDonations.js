export default function RecentDonations({ list }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Donasi Terbaru</h2>
      <ul className="space-y-3">
        {list.map((d, i) => (
          <li key={i} className="flex justify-between items-center">
            <div>
              <p className="font-medium">{d.anon ? 'Anonymous' : d.name}</p>
              <p className="text-xs text-gray-500">{new Date(d.ts).toLocaleString('id-ID')}</p>
            </div>
            <span className="text-primary font-semibold">Rp {d.amount.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
