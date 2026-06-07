// Footer — Facebook + Instagram instead of WhatsApp
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { FiFacebook, FiInstagram } from 'react-icons/fi';

const FACEBOOK  = 'https://www.facebook.com/profile.php?id=100068186145506';
const INSTAGRAM = 'https://www.instagram.com/khareef_home/';

export default function Footer() {
  const { t, isRTL } = useLanguage();

  return (
    <footer className="mt-16 border-t" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <span className="text-2xl font-display font-bold" style={{ color: 'var(--color-gold)' }}>
              {isRTL ? 'خريف' : 'Khareef'}
            </span>
            <p className="text-sm mt-0.5 mb-4 opacity-60" style={{ color: 'var(--color-text)' }}>
              {t('brandTagline')}
            </p>
            <p className="text-sm leading-relaxed opacity-60 mb-6" style={{ color: 'var(--color-text)' }}>
              {t('brandSubtitle')}
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              <a href={FACEBOOK} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-80 hover:scale-110"
                style={{ background: 'rgba(24,119,242,0.12)', color: '#1877F2' }}>
                <FiFacebook size={20} />
              </a>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-80 hover:scale-110"
                style={{ background: 'rgba(225,48,108,0.12)', color: '#E1306C' }}>
                <FiInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-50"
              style={{ color: 'var(--color-text)' }}>
              {isRTL ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--color-text)' }}>
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--color-text)' }}>
                  {t('cart')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-50"
              style={{ color: 'var(--color-text)' }}>
              {isRTL ? 'تابعنا' : 'Follow Us'}
            </h4>
            <p className="text-sm opacity-60 mb-4" style={{ color: 'var(--color-text)' }}>
              {isRTL
                ? 'تابعنا على وسائل التواصل الاجتماعي لأحدث المنتجات والعروض'
                : 'Follow us on social media for the latest products and offers'}
            </p>
            <div className="flex gap-3">
              <a href={FACEBOOK} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                style={{ background: 'rgba(24,119,242,0.1)', color: '#1877F2' }}>
                <FiFacebook size={16} /> Facebook
              </a>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                style={{ background: 'rgba(225,48,108,0.1)', color: '#E1306C' }}>
                <FiInstagram size={16} /> Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-40"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
          <span>© {new Date().getFullYear()} Khareef خريف. All rights reserved.</span>
          <span>Made with ❤️ for quality living</span>
        </div>
      </div>
    </footer>
  );
}
