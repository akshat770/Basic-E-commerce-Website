import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatINR } from '../utils/currency';
import { getItemImageUrl } from '../utils/images';
import { useCart } from '../contexts/CartContext';

const Home = () => {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '' });
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => { fetchItems(); }, [filters]);

  const API_BASE = 'https://basic-e-commerce-website-production.up.railway.app/api/v1';


  const fetchItems = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    const res = await axios.get(`${API_BASE}/items?${params.toString()}`);
    const list = res?.data?.items || res?.data?.data?.items || res?.data?.data || [];
    setItems(list);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-end justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <span className="text-sm text-gray-500">{items.length} items</span>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500">
          ...
        </select>
        <input className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" placeholder="Min Price" />
        <input className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" placeholder="Max Price" />
        <button className="bg-gray-800 text-white rounded-lg px-3 py-2 hover:bg-gray-900 transition">Clear</button>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center text-gray-500">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-500 py-20 border rounded-lg shadow-sm">No products found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item._id} className="bg-white rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition">
              <img src={getItemImageUrl(item)} alt={item.name} className="h-40 w-full object-cover rounded-lg mb-3" />
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.category}</p>
              <p className="text-xl font-bold text-indigo-600 mt-2">{formatINR(item.price)}</p>
              <button onClick={() => addToCart(item, 1)} className="w-full mt-4 bg-indigo-600 text-white rounded-lg px-3 py-2 hover:bg-indigo-700 transition">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

  );
};

export default Home;


