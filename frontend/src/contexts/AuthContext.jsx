import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // attach token for all future axios requests
      try { window.axios && (window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`); } catch (_) {}
      try { const axios = require('axios'); axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; } catch (_) {}
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const API_BASE = 'https://basic-e-commerce-website-production.up.railway.app/api/v1';

  const login = async (email, password) => {
    const res = await axios.post(`${API_BASE}/users/login`, { email, password });
    const payload = res?.data?.data || res?.data || {};
    const accessToken = payload.accessToken;
    const refreshToken = payload.refreshToken;
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    // set header immediately so subsequent calls (e.g., cart merge) are authorized
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    setUser({ token: accessToken });
    return true;
  };

  const signup = async (fullName, username, email, password) => {
    await axios.post(`${API_BASE}/users/register`, { fullName, username, email, password });
    return true;
  };

  const logout = async () => {
    try { await axios.post(`${API_BASE}/users/logout`); } catch (_) {}
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

 
