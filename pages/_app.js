import '../styles/globals.css';
import { DonationProvider } from '../context/DonationContext';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <DonationProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </DonationProvider>
  );
}
export default MyApp;
