// CartDrawer - Slide-in cart panel
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice, isCartOpen, setIsCartOpen } = useCart();
  const { t, isRTL, lang } = useLanguage();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 bottom-0 z-50 w-full sm:w-96 flex flex-col animate-slide-down`}
        style={{
          [isRTL ? 'left' : 'right']: 0,
          background: 'var(--color-bg-card)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-lg font-display font-semibold" style={{ color: 'var(--color-text)' }}>
            {t('yourCart')} {totalItems > 0 && <span className="text-sm font-normal opacity-60">({totalItems})</span>}
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-xl transition-all hover:opacity-70"
            style={{ color: 'var(--color-text)' }}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(201,168,76,0.1)' }}
              >
                <FiShoppingBag size={32} style={{ color: 'var(--color-gold)' }} />
              </div>
              <p className="font-medium opacity-60" style={{ color: 'var(--color-text)' }}>
                {t('emptyCart')}
              </p>
              <p className="text-sm opacity-40" style={{ color: 'var(--color-text)' }}>
                {t('emptyCartDesc')}
              </p>
              <button onClick={() => setIsCartOpen(false)} className="btn-primary mt-2">
                {t('continueShopping')}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartKey}
                className="flex gap-3 p-3 rounded-2xl"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
              >
                {/* Image */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={lang === 'ar' ? item.nameAr : item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ background: 'var(--color-border)' }}>
                      <FiShoppingBag size={24} className="opacity-40" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: 'var(--color-text)' }}>
                    {lang === 'ar' && item.nameAr ? item.nameAr : item.name}
                  </p>
                  {item.selectedColor && (
                    <p className="text-xs mt-0.5 opacity-60" style={{ color: 'var(--color-text)' }}>
                      {item.selectedColor}
                    </p>
                  )}
                  <p className="text-sm font-semibold mt-1" style={{ color: 'var(--color-gold)' }}>
                    {(item.price * item.quantity).toFixed(2)} {t('sar')}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-70"
                      style={{ background: 'var(--color-border)', color: 'var(--color-text)' }}
                    >
                      <FiMinus size={12} />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center" style={{ color: 'var(--color-text)' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-70"
                      style={{ background: 'var(--color-border)', color: 'var(--color-text)' }}
                    >
                      <FiPlus size={12} />
                    </button>

                    <button
                      onClick={() => removeFromCart(item.cartKey)}
                      className="ms-auto p-1.5 rounded-lg transition-all hover:opacity-70"
                      style={{ color: '#ef4444' }}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div
            className="px-5 py-4 border-t space-y-3"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium opacity-70" style={{ color: 'var(--color-text)' }}>
                {t('total')}
              </span>
              <span className="text-xl font-bold" style={{ color: 'var(--color-gold)' }}>
                {totalPrice.toFixed(2)} {t('sar')}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="btn-primary w-full text-center"
            >
              {t('checkout')}
            </Link>
            <button
              onClick={() => setIsCartOpen(false)}
              className="btn-secondary w-full text-sm"
            >
              {t('continueShopping')}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
