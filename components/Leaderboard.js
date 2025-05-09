export default function Leaderboard({ list }) {
  return (
    <div className="mt-4">
      <h2 className="text-2xl font-semibold">Top 10 Donatur</h2>
      <ol className="list-decimal list-inside">
        {list.map(({ name, total }, idx) => (
          <li key={idx}>{name}: Rp {total.toLocaleString()}</li>
        ))}
      </ol>
    </div>
  );
}
