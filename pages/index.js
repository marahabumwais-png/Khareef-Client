// Homepage
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeletons';
import { useLanguage } from '../context/LanguageContext';
import { getProducts, getCategories } from '../lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  GiCookingPot, GiPerfumeBottle, GiDiamondTrophy, GiLipstick,
  GiSoap, GiFlowerPot, GiCandleLight,
} from 'react-icons/gi';
import {
  MdOutlineCoffee, MdOutlineFaceRetouchingNatural, MdOutlineKitchen,
  MdOutlineSpa, MdOutlineLocalFlorist,
} from 'react-icons/md';
import {
  FiGrid, FiBox, FiStar, FiHeart, FiShoppingBag,
  FiHome, FiDroplet, FiSun,
} from 'react-icons/fi';
import { BiDish, BiCabinet } from 'react-icons/bi';
import { BsFlower1, BsFlower2 } from 'react-icons/bs';

// Map icon string name → component
export const ICON_MAP = {
  GiCookingPot, GiPerfumeBottle, GiDiamondTrophy, GiLipstick,
  GiSoap, GiFlowerPot, GiCandleLight,
  MdOutlineCoffee, MdOutlineFaceRetouchingNatural, MdOutlineKitchen,
  MdOutlineSpa, MdOutlineLocalFlorist,
  FiGrid, FiBox, FiStar, FiHeart, FiShoppingBag,
  FiHome, FiDroplet, FiSun,
  BiDish, BiCabinet,
  BsFlower1, BsFlower2,
};

// Fallback icon by category name keyword
const guessIcon = (name) => {
  const n = name?.toLowerCase() || '';
  if (n.includes('cook') || n.includes('pot') || n.includes('kitchen')) return GiCookingPot;
  if (n.includes('perfume') || n.includes('fragrance') || n.includes('عطر')) return GiPerfumeBottle;
  if (n.includes('tray') || n.includes('صيني')) return GiDiamondTrophy;
  if (n.includes('cup') || n.includes('mug') || n.includes('كوب')) return MdOutlineCoffee;
  if (n.includes('cosmetic') || n.includes('beauty') || n.includes('تجميل')) return MdOutlineFaceRetouchingNatural;
  if (n.includes('soap') || n.includes('skin') || n.includes('care')) return GiSoap;
  if (n.includes('flower') || n.includes('plant')) return GiFlowerPot;
  if (n.includes('candle') || n.includes('شمع')) return GiCandleLight;
  return FiBox;
};

export default function HomePage() {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const { search } = router.query;

  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [prods, cats] = await Promise.all([
          getProducts(null, search || null),
          getCategories(),
        ]);
        setProducts(prods);
        setCategories(cats);
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    };
    load();
  }, [search]);

  return (
    <Layout>
      {/* Hero */}
      {!search && (
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10"
            style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(85,133,82,0.06) 100%)' }} />
          <div className="absolute top-10 end-10 w-64 h-64 rounded-full opacity-10 -z-10"
            style={{ background: 'radial-gradient(circle, var(--color-gold), transparent)' }} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-wider uppercase"
                style={{ background: 'rgba(201,168,76,0.12)', color: 'var(--color-gold)' }}>
                {isRTL ? '✨ مرحباً بك في خريف' : '✨ Welcome to Khareef'}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 leading-tight"
                style={{ color: 'var(--color-text)' }}>
                {isRTL
                  ? <> خريف للأدوات المنزلية<br /><span style={{ color: 'var(--color-gold)' }}>والكوزمتكس</span></>
                  : <> Khareef <span style={{ color: 'var(--color-gold)' }}>Home &</span><br />Cosmetics</>
                }
              </h1>
              <p className="text-base md:text-lg opacity-60 mb-8" style={{ color: 'var(--color-text)' }}>
                {t('brandSubtitle')}
              </p>
              <Link href="#categories" className="btn-primary">{t('shopNow')}</Link>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Search header */}
        {search && (
          <div className="mb-8 mt-4">
            <h2 className="text-xl font-display font-semibold" style={{ color: 'var(--color-text)' }}>
              {isRTL ? `نتائج البحث: "${search}"` : `Results for: "${search}"`}
            </h2>
            <p className="text-sm opacity-50 mt-1" style={{ color: 'var(--color-text)' }}>
              {products.length} {isRTL ? 'منتج' : 'products'}
            </p>
          </div>
        )}

        {/* Categories */}
        {!search && categories.length > 0 && (
          <section id="categories" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-8" style={{ color: 'var(--color-text)' }}>
              {t('categories')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categories.map((cat) => {
                // Use saved icon name, or guess from category name
                const Icon  = (cat.icon && ICON_MAP[cat.icon]) ? ICON_MAP[cat.icon] : guessIcon(cat.name);
                const color = cat.color || 'var(--color-gold)';
                const label = isRTL && cat.nameAr ? cat.nameAr : (cat.nameLabel || cat.name);
                return (
                  <Link key={cat.id} href={`/category/${cat.name}`}
                    className="group flex flex-col items-center gap-3 p-5 rounded-2xl text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"
                      style={{ background: `${color}18` }}>
                      <Icon size={28} style={{ color }} />
                    </div>
                    <p className="font-semibold text-sm leading-snug" style={{ color: 'var(--color-text)' }}>
                      {label}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Products */}
        <section>
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-8" style={{ color: 'var(--color-text)' }}>
            {search ? t('products') : t('featuredProducts')}
          </h2>
          {loading ? <ProductGridSkeleton count={8} /> : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 mb-4">{t('error')}: {error}</p>
              <button onClick={() => window.location.reload()} className="btn-primary">{t('retry')}</button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 opacity-40">
              <p className="text-lg font-medium" style={{ color: 'var(--color-text)' }}>{t('noProducts')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
