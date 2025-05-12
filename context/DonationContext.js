import { createContext, useState, useContext } from 'react';
const DonationContext = createContext();
export function DonationProvider({ children }) {
  const [stats, setStats] = useState({ total: 0, leaderboard: [], recent: [] });
  return <DonationContext.Provider value={{ stats, setStats }}>{children}</DonationContext.Provider>;
}
export function useDonations() { return useContext(DonationContext); }
