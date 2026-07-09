import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.auth.me();
        setUser(data.user);
      } catch (err) {
        console.error('Session expired or invalid token');
        localStorage.removeItem('token'); // clear stale token
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'Outfit, sans-serif',
        color: '#1e293b',
        background: '#f1f3f6'
      }}>
        <div className="spinner" style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #5c67f2',
          borderRadius: '50%',
          marginBottom: '16px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <h3>Initializing TaskForge...</h3>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Auth onAuthSuccess={handleAuthSuccess} />
      )}
    </>
  );
}

export default App;
