import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatINR } from '../utils/currency';
import { getItemImageUrl } from '../utils/images';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, loading } = useCart();
  const { user } = useAuth();
  const [details, setDetails] = useState({});

  const API_BASE = 'https://basic-e-commerce-website-production.up.railway.app/api/v1';


  useEffect(() => {
    const load = async () => {
      const res = await axios.get(`${API_BASE}/items`);
      const items = res?.data?.items || res?.data?.data?.items || res?.data?.data || [];
      const map = {}; items.forEach(i => map[i._id] = i); setDetails(map);
    };
    if (cartItems.length) load();
  }, [cartItems]);

  const get = (id) => details[id] || { name: '...', price: 0, category: '' };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 py-20 border rounded-lg shadow-sm">Your cart is empty</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-100 divide-y">
            {cartItems.map(ci => (
              <div key={ci.itemId} className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={getItemImageUrl(get(ci.itemId))} alt={get(ci.itemId).name} className="w-20 h-16 object-cover rounded-lg border" />
                  <div>
                    <h3 className="font-semibold text-gray-800">{get(ci.itemId).name}</h3>
                    <p className="text-sm text-gray-500">{get(ci.itemId).category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-indigo-600 font-bold">{formatINR(get(ci.itemId).price)}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(ci.itemId, ci.quantity - 1)} className="w-8 h-8 bg-gray-100 rounded hover:bg-gray-200">-</button>
                    <span className="w-8 text-center font-semibold">{ci.quantity}</span>
                    <button onClick={() => updateQuantity(ci.itemId, ci.quantity + 1)} className="w-8 h-8 bg-gray-100 rounded hover:bg-gray-200">+</button>
                  </div>
                  <button onClick={() => removeFromCart(ci.itemId)} className="text-red-600 hover:text-red-700 font-medium">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 h-max">
            <div className="flex justify-between mb-3">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">{formatINR(getCartTotal())}</span>
            </div>
            <div className="border-t pt-4 mt-3 flex justify-between text-lg font-bold text-gray-800">
              <span>Total</span>
              <span>{formatINR(getCartTotal())}</span>
            </div>
            <button className="w-full mt-6 bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition">
              Checkout
            </button>
            {!user && (
              <p className="text-xs text-gray-500 mt-3">Login to save your cart across devices.</p>
            )}
          </div>
        </div>
      )}
    </div>

  );
};

export default Cart;


