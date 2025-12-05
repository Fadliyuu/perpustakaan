import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setChecking(false);
      return;
    }

    try {
      // Verify token is still valid by making a test request
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          // Try to access a protected endpoint to verify token
          const response = await api.get('/books', { 
            validateStatus: (status) => status < 500 // Don't throw on 401/403
          });
          
          // If successful (status 200), token is valid, redirect to dashboard
          if (response.status === 200) {
            navigate('/app', { replace: true });
            return;
          }
        } catch (err) {
          // If 401/403, token is invalid, clear it
          if (err.response?.status === 401 || err.response?.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      }
    } catch (err) {
      console.error('Auth check error:', err);
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/app');
    } catch (err) {
      setError('Login gagal. Periksa username dan password.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="login-page">
        <div className="login-bg-orb orb-1" />
        <div className="login-bg-orb orb-2" />
        <div className="login-bg-orb orb-3" />
        <div className="login-bg-morph" />
        <div className="login-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
          <div className="login-btn-spinner" style={{ width: '32px', height: '32px', marginBottom: '16px' }} />
          <p style={{ color: '#667eea', fontWeight: '500' }}>Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-bg-orb orb-1" />
      <div className="login-bg-orb orb-2" />
      <div className="login-bg-orb orb-3" />
      <div className="login-bg-morph" />
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-card-header">
          <img src="/Logo/logo.png" alt="Logo YP. Tunas Karya" className="login-logo-img" />
          <h1 className="login-title">Login Admin / Petugas</h1>
          <p className="login-subtitle">SMK Swasta Tunas Karya</p>
        </div>
        <div className="login-card-body">
          <label className="login-form-label">
            <span className="login-label-text">Username</span>
            <input
              className="login-form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              autoComplete="username"
            />
          </label>
          <label className="login-form-label">
            <span className="login-label-text">Password</span>
            <input
              type="password"
              className="login-form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              autoComplete="current-password"
            />
          </label>
          {error && <div className="login-form-error">{error}</div>}
          <button type="submit" className="login-btn-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="login-btn-spinner" />
                Memproses...
              </>
            ) : (
              'Masuk'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}


