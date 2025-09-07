import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await login(email, password); nav('/'); }
    catch (err) { setError(err?.message || 'Login failed'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={submit} className="bg-white rounded-xl shadow p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <input className="w-full border rounded-md px-3 py-2 mb-3" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input className="w-full border rounded-md px-3 py-2 mb-3" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
        <button disabled={loading} className="w-full bg-blue-600 text-white rounded-md px-3 py-2 hover:bg-blue-700 active:scale-[0.98] transition-all">{loading? 'Signing in...' : 'Sign In'}</button>
        <p className="text-sm text-gray-600 mt-3">No account? <Link to="/signup" className="text-blue-600">Create one</Link></p>
      </form>
    </div>
  );
};

export default Login;

 
