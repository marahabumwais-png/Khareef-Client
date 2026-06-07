// Category Page - fetches from Firestore directly
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import { ProductGridSkeleton } from '../../components/Skeletons';
import { useLanguage } from '../../context/LanguageContext';
import { getProducts, getCategories } from '../../lib/firebase';
import Link from 'next/link';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { GiCookingPot, GiPerfumeBottle, GiDiamondTrophy } from 'react-icons/gi';
import { MdOutlineCoffee, MdOutlineFaceRetouchingNatural } from 'react-icons/md';
import { FiGrid } from 'react-icons/fi';

const ICON_MAP = {
  cookware:  GiCookingPot,
  perfumes:  GiPerfumeBottle,
  trays:     GiDiamondTrophy,
  cups:      MdOutlineCoffee,
  cosmetics: MdOutlineFaceRetouchingNatural,
};

export default function CategoryPage() {
  const router = useRouter();
  const { id } = router.query;
  const { t, lang, isRTL } = useLanguage();

  const [products,  setProducts]  = useState([]);
  const [catMeta,   setCatMeta]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [sortIdx,   setSortIdx]   = useState(0);

  const BackIcon = isRTL ? FiArrowRight : FiArrowLeft;

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const [prods, cats] = await Promise.all([
          getProducts(id),
          getCategories(),
        ]);
        setProducts(prods);
        const found = cats.find(c => c.name === id);
        setCatMeta(found || null);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const sorted = [...products].sort((a, b) => {
    if (sortIdx === 1) return a.price - b.price;
    if (sortIdx === 2) return b.price - a.price;
    return 0;
  });

  const Icon  = ICON_MAP[id] || FiGrid;
  const color = catMeta?.color || '#c9a84c';
  const label = isRTL && catMeta?.nameAr ? catMeta.nameAr : (catMeta?.nameLabel || id || '');

  const sortOptions = isRTL
    ? ['الافتراضي', 'السعر: من الأقل', 'السعر: من الأعلى']
    : ['Default', 'Price: Low to High', 'Price: High to Low'];

  return (
    <Layout title={label}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: 'var(--color-text)' }}>
            <BackIcon size={16} />{t('home')}
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}18` }}>
            <Icon size={28} style={{ color }} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold" style={{ color: 'var(--color-text)' }}>
              {label}
            </h1>
            {!loading && (
              <p className="text-sm opacity-50 mt-0.5" style={{ color: 'var(--color-text)' }}>
                {products.length} {isRTL ? 'منتج' : 'products'}
              </p>
            )}
          </div>
          <div className="ms-auto">
            <select value={sortIdx} onChange={e => setSortIdx(parseInt(e.target.value))}
              className="input-field text-sm py-2" style={{ minWidth: 160 }}>
              {sortOptions.map((o, i) => <option key={i} value={i}>{o}</option>)}
            </select>
          </div>
        </div>

        {loading ? <ProductGridSkeleton count={8} /> : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={() => router.reload()} className="btn-primary">{t('retry')}</button>
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg opacity-40 mb-4" style={{ color: 'var(--color-text)' }}>{t('noProducts')}</p>
            <Link href="/" className="btn-primary">{t('backToHome')}</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {sorted.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
