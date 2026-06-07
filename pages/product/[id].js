// Product Detail Page - fetches from Firestore directly
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { ProductDetailSkeleton } from '../../components/Skeletons';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { getProduct, getProducts } from '../../lib/firebase';
import ProductCard from '../../components/ProductCard';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiMinus, FiPlus, FiShoppingCart, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { FiFacebook, FiInstagram } from 'react-icons/fi';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { t, lang, isRTL } = useLanguage();
  const { addToCart, setIsCartOpen } = useCart();

  const [product,  setProduct]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [selImage, setSelImage] = useState(0);
  const [selColor, setSelColor] = useState('');
  const [qty,      setQty]      = useState(1);
  const [related,  setRelated]  = useState([]);

  const FACEBOOK  = 'https://www.facebook.com/profile.php?id=100068186145506';
  const BackIcon  = isRTL ? FiArrowRight : FiArrowLeft;

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const p = await getProduct(id);
        if (!p) { setError('Product not found'); return; }
        setProduct(p);
        if (p.colors?.length > 0) setSelColor(p.colors[0]);
        if (p.category) {
          const rel = await getProducts(p.category);
          setRelated(rel.filter(r => r.id !== id).slice(0, 4));
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, selColor, qty);
    toast.success(lang === 'ar' ? 'تمت الإضافة للسلة!' : 'Added to cart!');
    setIsCartOpen(true);
  };



  if (loading) return <Layout><ProductDetailSkeleton /></Layout>;
  if (error || !product) return (
    <Layout>
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{t('error')}</p>
        <Link href="/" className="btn-primary">{t('backToHome')}</Link>
      </div>
    </Layout>
  );

  const displayName = lang === 'ar' && product.nameAr ? product.nameAr : product.name;
  const displayDesc = lang === 'ar' && product.descriptionAr ? product.descriptionAr : product.description;

  return (
    <Layout title={displayName} description={displayDesc}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm opacity-50" style={{ color: 'var(--color-text)' }}>
          <Link href="/" className="hover:opacity-100">{t('home')}</Link>
          <span>/</span>
          <Link href={`/category/${product.category}`} className="hover:opacity-100">{product.category}</Link>
          <span>/</span>
          <span className="truncate max-w-[160px]">{displayName}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden"
              style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
              {product.images?.[selImage] ? (
                <img src={product.images[selImage]} alt={displayName}
                  className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-20">
                  <FiShoppingCart size={64} />
                </div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${selImage === i ? 'scale-105' : 'opacity-60 hover:opacity-100'}`}
                    style={{ borderColor: selImage === i ? 'var(--color-gold)' : 'var(--color-border)' }}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <span className="badge text-xs font-semibold"
              style={{ background: 'rgba(201,168,76,0.1)', color: 'var(--color-gold)' }}>
              {product.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-display font-bold leading-snug"
              style={{ color: 'var(--color-text)' }}>{displayName}</h1>
            <div className="text-3xl font-bold" style={{ color: 'var(--color-gold)' }}>
              {product.price?.toFixed(2)}<span className="text-base font-normal ms-1 opacity-70">{t('nis')}</span>
            </div>

            {displayDesc && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-2 opacity-50"
                  style={{ color: 'var(--color-text)' }}>{t('description')}</h3>
                <p className="text-sm leading-relaxed opacity-70" style={{ color: 'var(--color-text)' }}>{displayDesc}</p>
              </div>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 opacity-50"
                  style={{ color: 'var(--color-text)' }}>
                  {t('colors')} {selColor && <span className="ms-2 normal-case font-normal opacity-70">— {selColor}</span>}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button key={color} onClick={() => setSelColor(color)} title={color}
                      className={`w-9 h-9 rounded-xl border-2 transition-all hover:scale-110 ${selColor === color ? 'ring-2 ring-offset-1' : ''}`}
                      style={{ background: color, borderColor: selColor === color ? 'var(--color-gold)' : 'var(--color-border)' }} />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 opacity-50"
                style={{ color: 'var(--color-text)' }}>{t('quantity')}</h3>
              <div className="flex items-center gap-3">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-70"
                  style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                  <FiMinus size={16} />
                </button>
                <span className="text-xl font-semibold w-8 text-center" style={{ color: 'var(--color-text)' }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-70"
                  style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                  <FiPlus size={16} />
                </button>
                <span className="text-sm ms-2 opacity-50" style={{ color: 'var(--color-text)' }}>
                  {isRTL ? `المجموع: ${(product.price * qty).toFixed(2)} ${t('nis')}` : `Total: ${(product.price * qty).toFixed(2)} ${t('nis')}`}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button onClick={handleAddToCart} className="btn-primary flex-1 justify-center">
                <FiShoppingCart size={18} />{t('addToCart')}
              </button>
              <a href={FACEBOOK} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity"
                style={{ background: '#1877F2' }}>
                <FiFacebook size={20} />{isRTL ? 'تواصل معنا' : 'Contact Us'}
              </a>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-display font-bold mb-8" style={{ color: 'var(--color-text)' }}>
              {t('relatedProducts')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
