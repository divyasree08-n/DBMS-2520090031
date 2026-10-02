import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, Building2, ArrowRight, AlertCircle, X } from 'lucide-react';
import tokens from '../tokens';

const API_BASE_URL = '';

export default function AuthPage({ onLogin, onClose }) {
  const [role, setRole] = useState('candidate');
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      const body = isSignUp
        ? { name: name.trim(), email: email.trim(), password, role }
        : { email: email.trim(), password, role };

      let res;
      try {
        res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      } catch (proxyErr) {
        res = await fetch(`http://127.0.0.1:5000${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      }

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || 'Something went wrong. Please try again.');
        return;
      }

      // Store the JWT token and user info in localStorage
      localStorage.setItem('recruitai_token', json.token);
      localStorage.setItem('recruitai_user', JSON.stringify(json.user));

      onLogin(json.user);
    } catch (err) {
      setError('Cannot connect to server. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCandidate = (demoName, demoEmail, demoRole = 'candidate') => {
    // Demo profiles bypass real auth — they set a mock user directly
    const demoUser = { name: demoName, email: demoEmail, role: demoRole };
    localStorage.setItem('recruitai_user', JSON.stringify(demoUser));
    onLogin(demoUser);
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', padding: '2.5rem', position: 'relative' }}>
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '1.5rem',
              top: '1.5rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: tokens.colors.textDim
            }}
          >
            <X size={20} />
          </button>
        )}

        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: tokens.radii.lg,
            background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: tokens.shadows.md,
            marginBottom: '0.85rem'
          }}>
            <Sparkles size={26} />
          </div>
          <h2 style={{ fontSize: '1.55rem', fontWeight: 800, color: tokens.colors.primaryNavy }}>
            {isSignUp ? 'Create your Account' : 'Welcome Back'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: tokens.colors.textMuted, marginTop: '0.35rem' }}>
            Enter your details to view your personalized matches &amp; applications
          </p>
        </div>

        {/* Account / Portal Role Selector — active on both Login and Sign Up */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: tokens.colors.textMuted, marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {isSignUp ? '1. Select Account Type' : '1. Select Portal to Log In'}
          </div>
          <div style={{
            display: 'flex',
            background: tokens.colors.surfaceSubtle,
            padding: '4px',
            borderRadius: tokens.radii.full,
            border: `1px solid ${tokens.colors.surfaceBorder}`
          }}>
            <button
              type="button"
              onClick={() => { setRole('candidate'); setError(''); }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.55rem',
                borderRadius: tokens.radii.full,
                border: 'none',
                background: role === 'candidate' ? '#ffffff' : 'transparent',
                color: role === 'candidate' ? tokens.colors.primaryRoyal : tokens.colors.textMuted,
                fontWeight: role === 'candidate' ? 700 : 500,
                fontSize: '0.825rem',
                cursor: 'pointer',
                boxShadow: role === 'candidate' ? tokens.shadows.sm : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <User size={15} />
              {isSignUp ? 'Job Candidate' : 'Candidate Portal'}
            </button>
            <button
              type="button"
              onClick={() => { setRole('recruiter'); setError(''); }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.55rem',
                borderRadius: tokens.radii.full,
                border: 'none',
                background: role === 'recruiter' ? '#ffffff' : 'transparent',
                color: role === 'recruiter' ? tokens.colors.primaryRoyal : tokens.colors.textMuted,
                fontWeight: role === 'recruiter' ? 700 : 500,
                fontSize: '0.825rem',
                cursor: 'pointer',
                boxShadow: role === 'recruiter' ? tokens.shadows.sm : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Building2 size={15} />
              {isSignUp ? 'Recruiter / HR' : 'Recruiter Portal'}
            </button>
          </div>
        </div>


        {/* Error Banner */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: tokens.radii.md,
            padding: '0.65rem 0.85rem',
            marginBottom: '1rem',
            color: '#dc2626',
            fontSize: '0.825rem',
            fontWeight: 500
          }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Name field — Sign Up only */}
          {isSignUp && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.35rem' }}>
                Your Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe, Alex Morgan..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                    borderRadius: tokens.radii.md,
                    border: `1px solid ${tokens.colors.surfaceBorder}`,
                    fontSize: '0.875rem'
                  }}
                />
                <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: tokens.colors.textDim }} />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.35rem' }}>
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                  borderRadius: tokens.radii.md,
                  border: `1px solid ${tokens.colors.surfaceBorder}`,
                  fontSize: '0.875rem'
                }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: tokens.colors.textDim }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.35rem' }}>
              Password *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                  borderRadius: tokens.radii.md,
                  border: `1px solid ${tokens.colors.surfaceBorder}`,
                  fontSize: '0.875rem'
                }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: tokens.colors.textDim }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '0.5rem',
              padding: '0.75rem',
              fontSize: '0.9rem',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Please wait…' : isSignUp ? 'Sign Up & Continue' : 'Sign In'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div style={{ margin: '1.5rem 0 1rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div style={{ flex: 1, height: '1px', background: tokens.colors.surfaceBorder }} />
            <span style={{ fontSize: '0.75rem', color: tokens.colors.textDim, fontWeight: 600 }}>OR DEMO PROFILES</span>
            <div style={{ flex: 1, height: '1px', background: tokens.colors.surfaceBorder }} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => handleDemoCandidate('Rahul Verma', 'rahul.verma@example.com', 'candidate')}
              className="btn btn-secondary"
              style={{ flex: 1, fontSize: '0.75rem', padding: '0.45rem' }}
            >
              <User size={13} color={tokens.colors.primaryRoyal} />
              AI Candidate Demo
            </button>
            <button
              type="button"
              onClick={() => handleDemoCandidate('Priya Nair', 'priya.nair@techcorp.io', 'recruiter')}
              className="btn btn-secondary"
              style={{ flex: 1, fontSize: '0.75rem', padding: '0.45rem' }}
            >
              <Building2 size={13} color={tokens.colors.primaryRoyal} />
              Recruiter Demo
            </button>
          </div>
        </div>

        {/* Toggle Sign In / Sign Up */}
        <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.825rem', color: tokens.colors.textMuted }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            type="button"
            onClick={switchMode}
            style={{
              border: 'none',
              background: 'none',
              color: tokens.colors.primaryRoyal,
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up free'}
          </button>
        </div>
      </div>
    </div>
  );
}
