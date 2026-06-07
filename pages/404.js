// 404 Not Found Page
import Layout from '../components/Layout';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function NotFoundPage() {
  const { isRTL, t } = useLanguage();
  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-8xl font-display font-bold mb-4" style={{ color: 'var(--color-gold)', opacity: 0.3 }}>
          404
        </p>
        <h1 className="text-2xl font-display font-bold mb-3" style={{ color: 'var(--color-text)' }}>
          {isRTL ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </h1>
        <p className="opacity-50 mb-8" style={{ color: 'var(--color-text)' }}>
          {isRTL
            ? 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'
            : 'The page you are looking for does not exist or has been moved.'}
        </p>
        <Link href="/" className="btn-primary">{t('backToHome')}</Link>
      </div>
    </Layout>
  );
}
