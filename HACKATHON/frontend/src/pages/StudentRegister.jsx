import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCollege } from '../context/CollegeContext';
import { User, Lock, Mail, Hash, ArrowRight, AlertCircle, Building2, GraduationCap } from 'lucide-react';
import { SYSTEM_INFO } from '../data/mockData';

export function StudentRegister() {
  const { colleges, selectedCollege } = useCollege();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    idNumber: '',
    role: 'STUDENT',
    department: 'Computer Science & Engineering',
    collegeId: selectedCollege.id,
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { registerStudent } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    if (!formData.name.trim() || formData.name.trim().length < 3) {
      setError('Please enter your full name (at least 3 characters).');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid institutional email address.');
      return false;
    }
    if (!formData.idNumber.trim()) {
      setError('Please enter your Roll Number / Student ID or Faculty Employee Code.');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      registerStudent(formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      {/* Top Header */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid var(--border-light)', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="brand-logo-shield" style={{ background: 'var(--primary)', color: '#FFFFFF' }}>
              <GraduationCap size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-heading)' }}>
                {SYSTEM_INFO.systemName}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {SYSTEM_INFO.tagline}
              </div>
            </div>
          </div>
          <Link to="/login" className="btn btn-secondary btn-sm">
            Existing User? Sign In
          </Link>
        </div>
      </div>

      {/* Main Registration Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <div className="klh-card" style={{ padding: '2rem', boxShadow: 'var(--shadow-md)' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.35rem' }}>
                Create Complainant Account
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Register as a Student or Faculty member to lodge campus complaints
              </p>
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

            <form onSubmit={handleSubmit}>
              {/* College Selection */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">College / University</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                  <select
                    className="form-select"
                    value={formData.collegeId}
                    onChange={(e) => setFormData({ ...formData, collegeId: e.target.value })}
                    style={{ paddingLeft: '2.5rem', width: '100%', boxSizing: 'border-box' }}
                  >
                    {colleges.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Role: Student vs Faculty */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Account Category</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    type="button"
                    className={`btn ${formData.role === 'STUDENT' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFormData({ ...formData, role: 'STUDENT' })}
                    style={{ justifyContent: 'center' }}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={`btn ${formData.role === 'FACULTY' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFormData({ ...formData, role: 'FACULTY' })}
                    style={{ justifyContent: 'center' }}
                  >
                    Faculty Member
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Aarav Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ paddingLeft: '2.5rem', width: '100%', boxSizing: 'border-box' }}
                    required
                  />
                </div>
              </div>

              {/* Email & ID */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                    <input
                      type="email"
                      className="form-input"
                      placeholder="student@campus.edu.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ paddingLeft: '2.5rem', width: '100%', boxSizing: 'border-box' }}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {formData.role === 'STUDENT' ? 'Roll / Reg Number' : 'Employee Code'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Hash size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                    <input
                      type="text"
                      className="form-input"
                      placeholder={formData.role === 'STUDENT' ? '2024-CS-1029' : 'FAC-042'}
                      value={formData.idNumber}
                      onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                      style={{ paddingLeft: '2.5rem', width: '100%', boxSizing: 'border-box' }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Department */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Department / Branch</label>
                <select
                  className="form-select"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box' }}
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Electronics & Communication Engg">Electronics & Communication Engg</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Electrical & Electronics Engg">Electrical & Electronics Engg</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Sciences & Humanities">Sciences & Humanities</option>
                </select>
              </div>

              {/* Password & Confirm */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Min 6 chars"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      style={{ paddingLeft: '2.5rem', width: '100%', boxSizing: 'border-box' }}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      style={{ paddingLeft: '2.5rem', width: '100%', boxSizing: 'border-box' }}
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem', fontWeight: 800, boxSizing: 'border-box' }}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Already registered?{' '}
              <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
                Log in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
