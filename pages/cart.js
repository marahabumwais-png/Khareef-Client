// Cart Page - /cart
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import Link from 'next/link';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const { t, lang, isRTL } = useLanguage();

  return (
    <Layout title={t('yourCart')}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h1 className="text-2xl md:text-3xl font-display font-bold mb-8" style={{ color: 'var(--color-text)' }}>
          {t('yourCart')}
          {totalItems > 0 && (
            <span className="text-lg font-normal opacity-50 ms-3">({totalItems} {t('items')})</span>
          )}
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center gap-5">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(201,168,76,0.08)' }}
            >
              <FiShoppingBag size={40} style={{ color: 'var(--color-gold)' }} />
            </div>
            <p className="text-lg font-medium opacity-50" style={{ color: 'var(--color-text)' }}>
              {t('emptyCart')}
            </p>
            <p className="text-sm opacity-40" style={{ color: 'var(--color-text)' }}>
              {t('emptyCartDesc')}
            </p>
            <Link href="/" className="btn-primary mt-2">{t('continueShopping')}</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.cartKey}
                  className="flex gap-4 p-4 rounded-2xl"
                  style={{
                    background: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {/* Image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0"
                    style={{ background: 'var(--color-bg)' }}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-20">
                        <FiShoppingBag size={32} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 truncate" style={{ color: 'var(--color-text)' }}>
                      {lang === 'ar' && item.nameAr ? item.nameAr : item.name}
                    </h3>
                    {item.selectedColor && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ background: item.selectedColor, borderColor: 'var(--color-border)' }}
                        />
                        <span className="text-xs opacity-50" style={{ color: 'var(--color-text)' }}>
                          {item.selectedColor}
                        </span>
                      </div>
                    )}
                    <p className="font-bold text-sm" style={{ color: 'var(--color-gold)' }}>
                      {item.price.toFixed(2)} {t('sar')} {isRTL ? 'للقطعة' : 'each'}
                    </p>

                    {/* Quantity + Remove */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center rounded-xl overflow-hidden border"
                        style={{ borderColor: 'var(--color-border)' }}>
                        <button
                          onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center transition-all hover:opacity-70"
                          style={{ color: 'var(--color-text)' }}
                        >
                          <FiMinus size={14} />
                        </button>
                        <span
                          className="w-10 h-9 flex items-center justify-center text-sm font-semibold border-x"
                          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center transition-all hover:opacity-70"
                          style={{ color: 'var(--color-text)' }}
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>

                      <span className="text-sm font-semibold ms-auto" style={{ color: 'var(--color-gold)' }}>
                        {(item.price * item.quantity).toFixed(2)} {t('sar')}
                      </span>

                      <button
                        onClick={() => removeFromCart(item.cartKey)}
                        className="p-2 rounded-xl transition-all hover:opacity-70"
                        style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)' }}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div
                className="p-6 rounded-2xl sticky top-24 space-y-4"
                style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
              >
                <h2 className="text-lg font-display font-semibold" style={{ color: 'var(--color-text)' }}>
                  {t('orderSummary')}
                </h2>
                <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  {cart.map((item) => (
                    <div key={item.cartKey} className="flex justify-between text-sm opacity-60"
                      style={{ color: 'var(--color-text)' }}>
                      <span className="truncate max-w-[60%]">
                        {lang === 'ar' && item.nameAr ? item.nameAr : item.name} ×{item.quantity}
                      </span>
                      <span>{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div
                  className="flex justify-between text-lg font-bold pt-3 border-t"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  <span>{t('total')}</span>
                  <span style={{ color: 'var(--color-gold)' }}>
                    {totalPrice.toFixed(2)} {t('sar')}
                  </span>
                </div>
                <Link href="/checkout" className="btn-primary w-full text-center block">
                  {t('checkout')}
                </Link>
                <Link href="/" className="btn-secondary w-full text-center block text-sm">
                  {t('continueShopping')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
