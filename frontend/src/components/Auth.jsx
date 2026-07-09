import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './Auth.css';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // 'user' or 'admin'
  const [hasAdmin, setHasAdmin] = useState(true); // default true to prevent flicker
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if admin already exists
  useEffect(() => {
    const checkAdminPresence = async () => {
      try {
        const res = await api.auth.hasAdmin();
        console.log('TaskForge Auth -> hasAdmin backend response:', res);
        setHasAdmin(res.hasAdmin);
      } catch (err) {
        console.error('TaskForge Auth -> Failed checking admin presence (Check if backend server is restarted):', err);
        // Fallback to false so the user can still register an admin if the endpoint fails
        setHasAdmin(false);
      }
    };
    if (!isLogin) {
      checkAdminPresence();
    }
  }, [isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let data;
      if (isLogin) {
        data = await api.auth.login(email, password);
      } else {
        if (!name.trim()) {
          throw new Error('Name is required');
        }
        // If hasAdmin is true, force role to user
        const finalRole = hasAdmin ? 'user' : role;
        data = await api.auth.register(name, email, password, finalRole);
      }

      localStorage.setItem('token', data.token);
      onAuthSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setRole('user');
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel animate-fade-in">
        <div className="auth-header">
          <div className="auth-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5c67f2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="auth-subtitle">
            {isLogin ? 'Access your dashboard & manage tasks' : 'Get started with TaskForge today'}
          </p>
        </div>

        {error && (
          <div className="auth-error-banner animate-fade-in">
            <span className="error-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </span>
            <span className="error-text">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Elene Janashvili"
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          {!isLogin && !hasAdmin && (
            <div className="form-group animate-fade-in">
              <label>Register As</label>
              <div className="role-segment-control">
                <button
                  type="button"
                  className={`role-segment-btn ${role === 'user' ? 'active' : ''}`}
                  onClick={() => setRole('user')}
                >
                  User Account
                </button>
                <button
                  type="button"
                  className={`role-segment-btn ${role === 'admin' ? 'active' : ''}`}
                  onClick={() => setRole('admin')}
                >
                  Admin Account
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="submit-btn glow-btn-primary"
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={toggleMode} className="toggle-mode-btn">
              {isLogin ? 'Create one now' : 'Sign in here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
