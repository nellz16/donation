export default function Leaderboard({ list }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Top 10 Donatur</h2>
      <ol className="list-decimal list-inside space-y-1">
        {list.map(({ name, total }, i) => (
          <li key={i} className="flex justify-between">
            <span>{name}</span>
            <span className="font-medium">Rp {total.toLocaleString()}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
