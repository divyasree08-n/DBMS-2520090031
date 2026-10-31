import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCollege } from '../context/CollegeContext';
import { Lock, Mail, ArrowRight, AlertCircle, Building2, ChevronDown, GraduationCap, BookOpen, Check } from 'lucide-react';
import { SYSTEM_INFO, SEED_USERS } from '../data/mockData';

export function StudentLogin() {
  const [email, setEmail] = useState('aarav.sharma@campus.edu.in');
  const [password, setPassword] = useState('Password@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('student'); // 'student' or 'faculty'

  const { loginStudent } = useAuth();
  const { colleges, selectedCollege, selectCollege, setIsCollegeModalOpen } = useCollege();
  const navigate = useNavigate();

  const studentAccounts = SEED_USERS.filter(u => u.role === 'STUDENT');
  const facultyAccounts = SEED_USERS.filter(u => u.role === 'FACULTY');

  const handleQuickSelect = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your institutional email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      loginStudent(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
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
              <GraduationCap size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-heading)' }}>
                {SYSTEM_INFO.systemName}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {selectedCollege.name}
              </div>
            </div>
          </div>

          {/* College Switcher */}
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

      {/* Main Login Body */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: 500 }}>
          
          <div className="klh-card" style={{ padding: '2.25rem', boxShadow: 'var(--shadow-md)', boxSizing: 'border-box' }}>
            
            {/* Header Badge & Title */}
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
                <Building2 size={13} />
                <span>{selectedCollege.shortName} • {selectedCollege.city}</span>
              </div>

              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.35rem' }}>
                Student & Faculty Login
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Sign in to report campus issues, track resolution timelines, and submit feedback
              </p>
            </div>

            {/* Role Switcher Tabs */}
            <div style={{
              display: 'flex',
              background: '#F1F5F9',
              borderRadius: 'var(--radius-md)',
              padding: '0.3rem',
              marginBottom: '1.25rem'
            }}>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('student');
                  handleQuickSelect(studentAccounts[0]);
                }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  background: activeTab === 'student' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'student' ? 'var(--primary)' : 'var(--text-muted)',
                  boxShadow: activeTab === 'student' ? 'var(--shadow-xs)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <GraduationCap size={16} />
                <span>Students (2 accounts)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('faculty');
                  handleQuickSelect(facultyAccounts[0]);
                }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  background: activeTab === 'faculty' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'faculty' ? 'var(--primary)' : 'var(--text-muted)',
                  boxShadow: activeTab === 'faculty' ? 'var(--shadow-xs)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <BookOpen size={16} />
                <span>Faculty (2 accounts)</span>
              </button>
            </div>

            {/* Quick-Fill Sample Accounts */}
            <div style={{ marginBottom: '1.35rem' }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                Quick Demo Selection (Click to Fill):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                {(activeTab === 'student' ? studentAccounts : facultyAccounts).map(acc => {
                  const isCurrent = email.toLowerCase() === acc.email.toLowerCase();
                  return (
                    <div
                      key={acc.id}
                      onClick={() => handleQuickSelect(acc)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                        background: isCurrent ? '#FEF2F2' : '#F8FAFC',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '75px',
                        boxSizing: 'border-box',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.825rem', color: isCurrent ? 'var(--primary)' : 'var(--text-heading)' }}>
                          {acc.name}
                        </span>
                        {isCurrent && <Check size={14} color="var(--primary)" />}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-faint)', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {acc.email}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        {acc.department.split('&')[0]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
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

            {/* Login Form */}
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              
              {/* College Selector Field */}
              <div className="form-group" style={{ marginBottom: '1.1rem', width: '100%' }}>
                <label className="form-label">Selected Institution / College</label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Building2 size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                  <select
                    className="form-select"
                    value={selectedCollege.id}
                    onChange={(e) => selectCollege(e.target.value)}
                    style={{ paddingLeft: '2.6rem', width: '100%', boxSizing: 'border-box' }}
                  >
                    {colleges.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email */}
              <div className="form-group" style={{ marginBottom: '1.1rem', width: '100%' }}>
                <label className="form-label" htmlFor="student-email">Institutional Email</label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                  <input
                    id="student-email"
                    type="email"
                    className="form-input"
                    placeholder="student@campus.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: '2.6rem', width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group" style={{ marginBottom: '1.5rem', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label className="form-label" htmlFor="student-password" style={{ margin: 0 }}>Password</label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>Demo: Password@123</span>
                </div>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                  <input
                    id="student-password"
                    type="password"
                    className="form-input"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: '2.6rem', width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem', fontWeight: 800, boxSizing: 'border-box' }}
                disabled={loading}
              >
                {loading ? 'Signing in...' : (
                  <>
                    <span>Sign In to Campus Portal</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Registration link */}
            <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Don't have an institutional account yet?{' '}
              <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
                Register here
              </Link>
            </div>
          </div>

          {/* Quick links to Admin / Staff */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem', fontSize: '0.825rem' }}>
            <Link to="/admin/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>Administrator Portal</span>
              <ArrowRight size={13} />
            </Link>
            <span style={{ color: 'var(--border-dark)' }}>•</span>
            <Link to="/staff/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>Maintenance Staff Portal</span>
              <ArrowRight size={13} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
