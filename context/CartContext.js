// Cart Context - Global cart state with localStorage persistence
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('khareef_cart');
      if (saved) setCart(JSON.parse(saved));
    } catch {}
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('khareef_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product, selectedColor, quantity = 1) => {
    setCart(prev => {
      const key = `${product.id}-${selectedColor}`;
      const existing = prev.find(item => item.cartKey === key);

      if (existing) {
        return prev.map(item =>
          item.cartKey === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, {
        cartKey: key,
        id: product.id,
        name: product.name,
        nameAr: product.nameAr,
        price: product.price,
        image: product.images?.[0] || '',
        selectedColor,
        quantity,
      }];
    });
  }, []);

  const removeFromCart = useCallback((cartKey) => {
    setCart(prev => prev.filter(item => item.cartKey !== cartKey));
  }, []);

  const updateQuantity = useCallback((cartKey, quantity) => {
    if (quantity < 1) return;
    setCart(prev =>
      prev.map(item => item.cartKey === cartKey ? { ...item, quantity } : item)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      isCartOpen,
      setIsCartOpen,
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
