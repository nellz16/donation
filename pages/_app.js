import '../styles/globals.css';
import { DonationProvider } from '../context/DonationContext';

function MyApp({ Component, pageProps }) {
  return (
    <DonationProvider>
      <Component {...pageProps} />
    </DonationProvider>
  );
}

export default MyApp;
