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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="bg-white rounded-xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <select className="border rounded-md px-3 py-2" value={filters.category} onChange={(e)=>setFilters(f=>({...f,category:e.target.value}))}>
          <option value="">All Categories</option>
          {[...new Set(items.map(i=>i.category))].map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
        <input className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Min Price" type="number" value={filters.minPrice} onChange={(e)=>setFilters(f=>({...f,minPrice:e.target.value}))}/>
        <input className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Max Price" type="number" value={filters.maxPrice} onChange={(e)=>setFilters(f=>({...f,maxPrice:e.target.value}))}/>
        <button onClick={()=>setFilters({category:'',minPrice:'',maxPrice:''})} className="bg-gray-700 text-white rounded-md px-3 py-2 hover:bg-gray-800 transition-colors">Clear</button>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-500">No products found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item._id} className="bg-white rounded-xl shadow p-4 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
              <img src={getItemImageUrl(item)} alt={item.name} className="h-36 w-full object-cover rounded-lg mb-4" />
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.category}</p>
              <p className="text-xl font-bold text-blue-600 mt-2">{formatINR(item.price)}</p>
              <button onClick={() => addToCart(item, 1)} className="w-full mt-4 bg-blue-600 text-white rounded-md px-3 py-2 hover:bg-blue-700 active:scale-[0.98] transition-all">Add to Cart</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

 
