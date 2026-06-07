// ProductCard - Reusable product card component
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { t, lang } = useLanguage();
  const { addToCart } = useCart();

  const displayName = lang === 'ar' && product.nameAr ? product.nameAr : product.name;
  const mainImage = product.images?.[0];

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const color = product.colors?.[0] || '';
    addToCart(product, color, 1);
    toast.success(lang === 'ar' ? 'تمت الإضافة للسلة' : 'Added to cart');
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="card overflow-hidden h-full">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden"
          style={{ background: 'var(--color-bg)' }}>
          {mainImage ? (
            <img
              src={mainImage}
              alt={displayName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-20">
              <FiShoppingCart size={48} />
            </div>
          )}

          {/* Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-3 inset-x-3 py-2 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            style={{ background: 'rgba(201,168,76,0.92)', backdropFilter: 'blur(4px)' }}
          >
            <FiShoppingCart size={16} />
            {t('addToCart')}
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3
            className="font-semibold text-sm leading-snug line-clamp-2 mb-2"
            style={{ color: 'var(--color-text)' }}
          >
            {displayName}
          </h3>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1.5 mb-2 flex-wrap">
              {product.colors.slice(0, 5).map((color, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full border-2"
                  style={{
                    background: color,
                    borderColor: 'var(--color-border)',
                  }}
                  title={color}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-xs opacity-50" style={{ color: 'var(--color-text)' }}>
                  +{product.colors.length - 5}
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <p className="text-base font-bold" style={{ color: 'var(--color-gold)' }}>
            {product.price?.toFixed(2)} <span className="text-xs font-normal">{t('nis')}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
