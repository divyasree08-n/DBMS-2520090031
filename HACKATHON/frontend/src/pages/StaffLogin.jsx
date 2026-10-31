import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCollege } from '../context/CollegeContext';
import { Lock, Mail, ArrowRight, AlertCircle, Wrench, Building2, ChevronDown } from 'lucide-react';
import { SYSTEM_INFO } from '../data/mockData';

export function StaffLogin() {
  const [email, setEmail] = useState('rajesh.kumar@campus.edu.in');
  const [password, setPassword] = useState('Staff@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginStaff } = useAuth();
  const { colleges, selectedCollege, selectCollege, setIsCollegeModalOpen } = useCollege();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter technician credentials.');
      return;
    }

    setLoading(true);
    try {
      loginStaff(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      {/* Top Header */}
      <header className="klh-header" style={{ padding: '0.85rem 1.5rem', background: '#FFFFFF', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="brand-logo-shield" style={{ background: 'var(--primary)', color: '#FFFFFF', width: 38, height: 38 }}>
              <Wrench size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-heading)' }}>
                {SYSTEM_INFO.systemName}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Maintenance & Technical Staff Portal • {selectedCollege.shortName}
              </div>
            </div>
          </div>

          <button 
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsCollegeModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Building2 size={15} color="var(--primary)" />
            <span style={{ fontWeight: 700 }}>{selectedCollege.shortName}</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </header>

      {/* Main Login Card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          <div className="klh-card" style={{ padding: '2.25rem', boxShadow: 'var(--shadow-md)', boxSizing: 'border-box' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: 'var(--primary)',
                padding: '0.25rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '0.75rem'
              }}>
                <Wrench size={13} />
                <span>Field Maintenance & Engineering Teams</span>
              </div>

              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.35rem' }}>
                Maintenance Staff Login
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Access assigned work orders, update repair progress, and record resolutions
              </p>
            </div>

            {/* Demo Hint Banner */}
            <div 
              onClick={() => { setEmail('rajesh.kumar@campus.edu.in'); setPassword('Staff@123'); setError(''); }}
              style={{
                background: '#F8FAFC',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 0.85rem',
                marginBottom: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.775rem'
              }}
            >
              <div>
                <span style={{ color: 'var(--text-faint)', fontWeight: 600 }}>Demo Staff:</span>{' '}
                <strong style={{ color: 'var(--primary)' }}>rajesh.kumar@campus.edu.in</strong>
              </div>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.7rem' }}>Click to fill</span>
            </div>

            {error && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#B91C1C',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.825rem',
                marginBottom: '1.25rem'
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <div className="form-group" style={{ marginBottom: '1.1rem', width: '100%' }}>
                <label className="form-label">Active Campus / College</label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Building2 size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                  <select
                    className="form-select"
                    value={selectedCollege.id}
                    onChange={(e) => selectCollege(e.target.value)}
                    style={{ paddingLeft: '2.6rem', width: '100%', boxSizing: 'border-box' }}
                  >
                    {colleges.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.1rem', width: '100%' }}>
                <label className="form-label" htmlFor="staff-email">Technician Email</label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                  <input
                    id="staff-email"
                    type="email"
                    className="form-input"
                    placeholder="rajesh.kumar@campus.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: '2.6rem', width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label className="form-label" htmlFor="staff-password" style={{ margin: 0 }}>Staff Password</label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>Demo: Staff@123</span>
                </div>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                  <input
                    id="staff-password"
                    type="password"
                    className="form-input"
                    placeholder="Enter technician password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: '2.6rem', width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem', fontWeight: 800, boxSizing: 'border-box' }}
                disabled={loading}
              >
                {loading ? 'Authenticating...' : (
                  <>
                    <span>Sign In to Work Orders</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.35rem', fontSize: '0.85rem' }}>
              <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                ← Return to Student / Faculty Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
