// Navbar — fixed dark mode, no WhatsApp, Facebook + Instagram
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { FiShoppingCart, FiSearch, FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { MdLanguage } from 'react-icons/md';

export default function Navbar() {
  const { t, lang, toggleLanguage, isRTL } = useLanguage();
  const { totalItems, setIsCartOpen } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();

  const [isMenuOpen,   setIsMenuOpen]   = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [isScrolled,   setIsScrolled]   = useState(false);

  useEffect(() => {
    const h = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => { setIsMenuOpen(false); setIsSearchOpen(false); }, [router.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Only show Home in top nav — categories are on homepage
  const navLinks = [{ href: '/', label: t('home') }];

  const navBg = isScrolled
    ? isDark
      ? 'rgba(26,24,18,0.95)'
      : 'rgba(253,248,240,0.95)'
    : isDark
      ? '#1a1812'
      : '#fdf8f0';

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: navBg,
          borderBottom: isScrolled ? '1px solid var(--color-border)' : 'none',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link href="/" className="flex flex-col leading-none group">
              <span className="text-xl md:text-2xl font-display font-bold group-hover:opacity-80 transition-opacity"
                style={{ color: 'var(--color-gold)' }}>
                {isRTL ? 'خريف' : 'Khareef'}
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {isRTL ? 'أدوات منزلية وكوزمتكس' : 'Home & Cosmetics'}
              </span>
            </Link>

            {/* Desktop nav — only Home */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    color: router.pathname === link.href ? 'var(--color-gold)' : 'var(--color-text)',
                    background: router.pathname === link.href ? 'rgba(201,168,76,0.08)' : 'transparent',
                    opacity: router.pathname === link.href ? 1 : 0.7,
                  }}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Search */}
              <button onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-xl transition-all hover:opacity-70"
                style={{ color: 'var(--color-text)' }}>
                <FiSearch size={20} />
              </button>

              {/* Dark Mode */}
              <button onClick={toggleTheme}
                className="p-2 rounded-xl transition-all hover:opacity-70"
                style={{ color: 'var(--color-text)' }}>
                {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>

              {/* Language */}
              <button onClick={toggleLanguage}
                className="flex items-center gap-1 px-2 md:px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-70"
                style={{ color: 'var(--color-text)' }}>
                <MdLanguage size={18} />
                <span className="hidden md:inline">{lang === 'ar' ? 'EN' : 'ع'}</span>
              </button>

              {/* Cart */}
              <button onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-xl transition-all hover:opacity-70"
                style={{ color: 'var(--color-text)' }}>
                <FiShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                    style={{ background: 'var(--color-gold)' }}>
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              {/* Mobile menu */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-xl transition-all hover:opacity-70"
                style={{ color: 'var(--color-text)' }}>
                {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="pb-3 animate-slide-down">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')} className="input-field flex-1" autoFocus />
                <button type="submit" className="btn-primary px-4"><FiSearch size={18} /></button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t animate-slide-down"
            style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
            <div className="px-4 py-3 space-y-1">
              <Link href="/" className="block px-4 py-3 rounded-xl text-sm font-medium"
                style={{ color: 'var(--color-text)' }}>
                {t('home')}
              </Link>
            </div>
          </div>
        )}
      </nav>
      <div className="h-16 md:h-20" />
    </>
  );
}
