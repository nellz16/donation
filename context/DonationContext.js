import { createContext, useState, useContext } from 'react';

const DonationContext = createContext();

export function DonationProvider({ children }) {
  const [donations, setDonations] = useState([]);
  const [total, setTotal] = useState(0);

  return (
    <DonationContext.Provider value={{ donations, setDonations, total, setTotal }}>
      {children}
    </DonationContext.Provider>
  );
}

export function useDonations() {
  return useContext(DonationContext);
}
