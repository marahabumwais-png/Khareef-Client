// _app.js - Root application wrapper
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from '../context/LanguageContext';
import { CartProvider } from '../context/CartContext';
import { ThemeProvider } from '../context/ThemeContext';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CartProvider>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#c9a84c" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Component {...pageProps} />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--color-bg-card)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                fontFamily: 'inherit',
              },
              success: {
                iconTheme: { primary: '#c9a84c', secondary: '#fff' },
              },
            }}
          />
        </CartProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
