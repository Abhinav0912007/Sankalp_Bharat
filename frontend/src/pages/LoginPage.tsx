import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

// ============================================================
// Login Page
// ============================================================
// Premium dark-themed login screen for CarbonLens.
// Calls authStore.login() which hits POST /api/auth/login.
// ============================================================

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch {
      // Error is already set in the store
    }
  };

  return (
    <div className="login-page">
      {/* Animated background orbs */}
      <div className="login-bg-orb login-bg-orb--1" />
      <div className="login-bg-orb login-bg-orb--2" />
      <div className="login-bg-orb login-bg-orb--3" />

      <div className="login-card">
        {/* Logo & Branding */}
        <div className="login-brand">
          <div className="login-logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" stroke="url(#logo-grad)" strokeWidth="2.5" fill="none"/>
              <path d="M14 26 L17 18 L20 22 L23 14 L26 20" stroke="url(#logo-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="var(--accent-teal)"/>
                  <stop offset="100%" stopColor="var(--accent-emerald)"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="login-title">CarbonLens</h1>
          <p className="login-subtitle">ESG Intelligence Platform</p>
        </div>

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="login-error" role="alert">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.5a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0v-4zM8 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </svg>
              <span>{error}</span>
              <button type="button" className="login-error-dismiss" onClick={clearError}>×</button>
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="login-password" className="form-label">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {/* Submit Button */}
          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary login-submit"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <span className="btn-spinner" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="login-footer">
          Secure ESG data management for manufacturing SMEs
        </p>
      </div>
    </div>
  );
}
