import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      await signup(form.fullName, form.username, form.email, form.password);
      nav('/login');
    } catch (err) { setError(err?.message || 'Signup failed'); }
    setLoading(false);
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={submit} className="bg-white rounded-xl shadow p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>
        <input className="w-full border rounded-md px-3 py-2 mb-3" placeholder="Full Name" value={form.fullName} onChange={set('fullName')} required />
        <input className="w-full border rounded-md px-3 py-2 mb-3" placeholder="Username" value={form.username} onChange={set('username')} required />
        <input className="w-full border rounded-md px-3 py-2 mb-3" placeholder="Email" type="email" value={form.email} onChange={set('email')} required />
        <input className="w-full border rounded-md px-3 py-2 mb-3" placeholder="Password" type="password" value={form.password} onChange={set('password')} required />
        <input className="w-full border rounded-md px-3 py-2 mb-3" placeholder="Confirm Password" type="password" value={form.confirm} onChange={set('confirm')} required />
        {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
        <button disabled={loading} className="w-full bg-blue-600 text-white rounded-md px-3 py-2 hover:bg-blue-700 active:scale-[0.98] transition-all">{loading? 'Creating...' : 'Create Account'}</button>
        <p className="text-sm text-gray-600 mt-3">Have an account? <Link to="/login" className="text-blue-600">Sign in</Link></p>
      </form>
    </div>
  );
};

export default Signup;

 
