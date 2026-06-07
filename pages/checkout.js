// Checkout Page - saves order directly to Firestore
import { useState } from 'react';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { addOrder } from '../lib/firebase';
import Link from 'next/link';
import { FiCheckCircle, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { FiFacebook } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { t, lang, isRTL } = useLanguage();
  const [form,    setForm]    = useState({ customerName: '', address: '', phone: '' });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const FACEBOOK = 'https://www.facebook.com/profile.php?id=100068186145506';
  const BackIcon = isRTL ? FiArrowRight : FiArrowLeft;

  const validate = () => {
    const errs = {};
    if (!form.customerName.trim()) errs.customerName = t('requiredField');
    if (!form.address.trim())      errs.address = t('requiredField');
    if (!form.phone.trim())        errs.phone = t('requiredField');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || cart.length === 0) return;
    try {
      setLoading(true);
      const ref = await addOrder({
        customerName: form.customerName.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        items: cart.map(item => ({
          productId: item.id, name: item.name, nameAr: item.nameAr,
          price: item.price, quantity: item.quantity,
          color: item.selectedColor, image: item.image,
        })),
        total: totalPrice,
      });
      setOrderId(ref.id);
      clearCart();
      setSuccess(true);
    } catch (err) {
      toast.error(t('orderError'));
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <Layout title={t('checkoutTitle')}>
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(85,133,82,0.1)' }}>
          <FiCheckCircle size={48} style={{ color: '#558552' }} />
        </div>
        <h1 className="text-2xl font-display font-bold mb-4" style={{ color: 'var(--color-text)' }}>
          {isRTL ? 'تم الطلب بنجاح! 🎉' : 'Order Placed! 🎉'}
        </h1>
        <p className="opacity-60 mb-6 leading-relaxed" style={{ color: 'var(--color-text)' }}>{t('orderSuccess')}</p>
        {orderId && <p className="text-xs opacity-30 mb-8 font-mono" style={{ color: 'var(--color-text)' }}>ID: {orderId}</p>}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">{t('continueShopping')}</Link>
          <a href={FACEBOOK} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white"
            style={{ background: '#1877F2' }}>
            <FiFacebook size={18} />{isRTL ? 'تواصل معنا' : 'Contact Us'}
          </a>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout title={t('checkoutTitle')}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm opacity-50 hover:opacity-100 mb-6 transition-opacity"
          style={{ color: 'var(--color-text)' }}>
          <BackIcon size={16} />{t('yourCart')}
        </Link>
        <h1 className="text-2xl md:text-3xl font-display font-bold mb-8" style={{ color: 'var(--color-text)' }}>
          {t('checkoutTitle')}
        </h1>
        {cart.length === 0 ? (
          <div className="text-center py-16">
            <p className="opacity-50 mb-4" style={{ color: 'var(--color-text)' }}>{t('emptyCart')}</p>
            <Link href="/" className="btn-primary">{t('continueShopping')}</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5 opacity-70" style={{ color: 'var(--color-text)' }}>{t('fullName')} *</label>
                <input className={`input-field ${errors.customerName ? 'border-red-400' : ''}`}
                  value={form.customerName} placeholder={isRTL ? 'الاسم الكامل' : 'Full name'}
                  onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} />
                {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 opacity-70" style={{ color: 'var(--color-text)' }}>{t('address')} *</label>
                <textarea rows={3} className={`input-field resize-none ${errors.address ? 'border-red-400' : ''}`}
                  value={form.address} placeholder={isRTL ? 'المدينة، الحي، الشارع' : 'City, district, street'}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 opacity-70" style={{ color: 'var(--color-text)' }}>{t('phoneNumber')} *</label>
                <input type="tel" dir="ltr" className={`input-field ${errors.phone ? 'border-red-400' : ''}`}
                  value={form.phone} placeholder="+966 5xx xxx xxxx"
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base mt-4 disabled:opacity-60">
                {loading ? t('processing') : t('placeOrder')}
              </button>
            </form>
            <div className="lg:col-span-1">
              <div className="p-6 rounded-2xl sticky top-24 space-y-4"
                style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                <h2 className="text-base font-display font-semibold" style={{ color: 'var(--color-text)' }}>{t('orderSummary')}</h2>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.cartKey} className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0" style={{ background: 'var(--color-bg)' }}>
                        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: 'var(--color-text)' }}>
                          {lang === 'ar' && item.nameAr ? item.nameAr : item.name}
                        </p>
                        <p className="text-xs opacity-50" style={{ color: 'var(--color-text)' }}>×{item.quantity}</p>
                      </div>
                      <span className="text-xs font-semibold flex-shrink-0" style={{ color: 'var(--color-gold)' }}>
                        {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-base font-bold pt-3 border-t"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                  <span>{t('total')}</span>
                  <span style={{ color: 'var(--color-gold)' }}>{totalPrice.toFixed(2)} {t('nis')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
