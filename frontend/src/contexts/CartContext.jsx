import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = 'https://basic-e-commerce-website-production.up.railway.app/api/v1';


  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCartItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          const local = JSON.parse(localStorage.getItem('cart') || '[]');
          const auth = { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}` } };
          for (const c of local) {
            await axios.post(`${API_BASE}/cart/add`, { itemId: c.itemId || c.item?._id, quantity: c.quantity || 1 }, auth);
          }
          localStorage.removeItem('cart');
        } catch (_) {}
        await loadServerCart();
      })();
    }
  }, [user]);

  const loadServerCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/cart`, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}` } });
      const raw = res?.data?.cart || res?.data?.data?.cart || [];
      // Normalize: ensure itemId is a string id and keep optional populated item
      const normalized = raw.map((c) => {
        const id = typeof c.itemId === 'object' ? (c.itemId?._id || c.itemId) : c.itemId;
        const embeddedItem = (c.itemId && typeof c.itemId === 'object' && c.itemId.name) ? c.itemId : undefined;
        return { itemId: String(id), item: embeddedItem, quantity: Number(c.quantity) };
      });
      setCartItems(normalized);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item, quantity = 1) => {
    if (user) {
      await axios.post(`${API_BASE}/cart/add`, { itemId: item._id, quantity: Number(quantity) }, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}` } });
      return loadServerCart();
    }
    setCartItems(prev => {
      const ex = prev.find(i => i.itemId === item._id);
      if (ex) return prev.map(i => i.itemId === item._id ? { ...i, quantity: i.quantity + quantity } : i);
      return [...prev, { itemId: item._id, item, quantity }];
    });
  };

  const removeFromCart = async (itemId) => {
    if (user) {
      await axios.post(`${API_BASE}/cart/remove`, { itemId }, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}` } });
      return loadServerCart();
    }
    setCartItems(prev => prev.filter(i => i.itemId !== itemId));
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) return removeFromCart(itemId);
    if (user) {
      const current = cartItems.find(i => String(i.itemId) === String(itemId))?.quantity || 0;
      const delta = Number(quantity) - Number(current);
      await axios.post(`${API_BASE}/cart/add`, { itemId, quantity: delta }, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}` } });
      return loadServerCart();
    }
    setCartItems(prev => prev.map(i => i.itemId === itemId ? { ...i, quantity } : i));
  };

  const getCartItemCount = () => cartItems.reduce((a, c) => a + c.quantity, 0);
  const getCartTotal = () => cartItems.reduce((a, c) => a + (c.item?.price || 0) * c.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, loading, addToCart, removeFromCart, updateQuantity, getCartItemCount, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

 
