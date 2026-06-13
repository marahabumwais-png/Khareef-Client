// Cart Context - supports color + size
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart,        setCart]        = useState([]);
  const [isCartOpen,  setIsCartOpen]  = useState(false);

  useEffect(() => {
    try { const s = localStorage.getItem('khareef_cart'); if (s) setCart(JSON.parse(s)); } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('khareef_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product, selectedColor, selectedSize, quantity = 1) => {
    setCart(prev => {
      const key      = `${product.id}-${selectedColor}-${selectedSize}`;
      const existing = prev.find(i => i.cartKey === key);
      const price    = product.finalPrice ?? product.price;
      if (existing) {
        return prev.map(i => i.cartKey === key ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, {
        cartKey: key,
        id:            product.id,
        name:          product.name,
        nameAr:        product.nameAr,
        price,
        originalPrice: product.price,
        hasDiscount:   price < product.price,
        image:         product.images?.[0] || '',
        selectedColor,
        selectedSize,
        quantity,
      }];
    });
  }, []);

  const removeFromCart  = useCallback((cartKey) => setCart(p => p.filter(i => i.cartKey !== cartKey)), []);
  const updateQuantity  = useCallback((cartKey, quantity) => {
    if (quantity < 1) return;
    setCart(p => p.map(i => i.cartKey === cartKey ? { ...i, quantity } : i));
  }, []);
  const clearCart = useCallback(() => setCart([]), []);

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.reduce((s, i) => s + (i.price * i.quantity), 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, totalPrice, isCartOpen, setIsCartOpen,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};

export default CartContext;
