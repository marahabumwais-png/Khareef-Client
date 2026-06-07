// Layout - Main site layout wrapper
import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import { useLanguage } from '../context/LanguageContext';

export default function Layout({ children, title, description }) {
  const { t } = useLanguage();

  const pageTitle = title
    ? `${title} | Khareef خريف`
    : 'Khareef - Home & Cosmetics | خريف للأدوات المنزلية والكوزمتكس';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <CartDrawer />
        <main className="flex-1 page-enter">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
