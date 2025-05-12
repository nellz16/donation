export default function Leaderboard({ list }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Top 10 Donatur</h2>
      <ol className="list-decimal list-inside space-y-2">
        {list.map(({ name, total }, idx) => (
          <li key={idx} className="flex justify-between">
            <span>{name}</span>
            <span className="font-medium">Rp {total.toLocaleString()}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
