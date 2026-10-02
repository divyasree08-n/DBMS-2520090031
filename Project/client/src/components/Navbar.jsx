import React from 'react';
import { 
  Briefcase, 
  FileText, 
  Layers, 
  Calendar, 
  BarChart3, 
  Component, 
  Sparkles, 
  UserCheck, 
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  userRole, 
  setUserRole, 
  apiHealthy,
  onOpenNewJobModal
}) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.90)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--surface-border)',
      boxShadow: '0 4px 20px -2px rgba(37, 99, 235, 0.06)'
    }}>
      <div style={{
        maxWidth: '1320px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('jobs')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 6px 16px rgba(37, 99, 235, 0.3)'
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
                Recruit<span style={{ color: 'var(--primary-royal)' }}>AI</span>
              </span>
              <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                NLP Explainable
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Resume Parsing & Match Scoring
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('jobs')}
            className="btn"
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.825rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'jobs' ? 'var(--primary-ice)' : 'transparent',
              color: activeTab === 'jobs' ? 'var(--primary-royal)' : 'var(--text-muted)',
              fontWeight: activeTab === 'jobs' ? 700 : 500
            }}
          >
            <Briefcase size={16} />
            Browse Jobs
          </button>

          <button
            onClick={() => setActiveTab('parser')}
            className="btn"
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.825rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'parser' ? 'var(--primary-ice)' : 'transparent',
              color: activeTab === 'parser' ? 'var(--primary-royal)' : 'var(--text-muted)',
              fontWeight: activeTab === 'parser' ? 700 : 500
            }}
          >
            <FileText size={16} />
            Resume Parser
          </button>

          <button
            onClick={() => setActiveTab('ats')}
            className="btn"
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.825rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'ats' ? 'var(--primary-ice)' : 'transparent',
              color: activeTab === 'ats' ? 'var(--primary-royal)' : 'var(--text-muted)',
              fontWeight: activeTab === 'ats' ? 700 : 500
            }}
          >
            <Layers size={16} />
            ATS Pipeline
          </button>

          <button
            onClick={() => setActiveTab('interviews')}
            className="btn"
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.825rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'interviews' ? 'var(--primary-ice)' : 'transparent',
              color: activeTab === 'interviews' ? 'var(--primary-royal)' : 'var(--text-muted)',
              fontWeight: activeTab === 'interviews' ? 700 : 500
            }}
          >
            <Calendar size={16} />
            Interviews
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className="btn"
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.825rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'analytics' ? 'var(--primary-ice)' : 'transparent',
              color: activeTab === 'analytics' ? 'var(--primary-royal)' : 'var(--text-muted)',
              fontWeight: activeTab === 'analytics' ? 700 : 500
            }}
          >
            <BarChart3 size={16} />
            Analytics
          </button>

          {/* Explicit Components Section requested by user */}
          <button
            onClick={() => setActiveTab('components')}
            className="btn"
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.825rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'components' ? 'var(--primary-royal)' : 'rgba(37, 99, 235, 0.08)',
              color: activeTab === 'components' ? '#ffffff' : 'var(--primary-royal)',
              fontWeight: 700,
              boxShadow: activeTab === 'components' ? '0 2px 8px rgba(37,99,235,0.3)' : 'none'
            }}
          >
            <Component size={16} />
            Components
          </button>
        </nav>

        {/* Right Controls: Post Job (if recruiter), Role Switcher & API Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {userRole === 'recruiter' && (
            <button 
              onClick={onOpenNewJobModal}
              className="btn btn-primary"
              style={{ padding: '0.45rem 0.95rem', fontSize: '0.825rem' }}
            >
              + Post Job
            </button>
          )}

          {/* Role Toggle Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--surface-subtle)',
            borderRadius: '9999px',
            padding: '3px',
            border: '1px solid var(--surface-border)'
          }}>
            <button
              onClick={() => setUserRole('candidate')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                border: 'none',
                background: userRole === 'candidate' ? '#ffffff' : 'transparent',
                color: userRole === 'candidate' ? 'var(--primary-royal)' : 'var(--text-muted)',
                fontWeight: userRole === 'candidate' ? 700 : 500,
                fontSize: '0.75rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                cursor: 'pointer',
                boxShadow: userRole === 'candidate' ? '0 2px 5px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <UserCheck size={14} />
              Candidate
            </button>
            <button
              onClick={() => setUserRole('recruiter')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                border: 'none',
                background: userRole === 'recruiter' ? '#ffffff' : 'transparent',
                color: userRole === 'recruiter' ? 'var(--primary-royal)' : 'var(--text-muted)',
                fontWeight: userRole === 'recruiter' ? 700 : 500,
                fontSize: '0.75rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                cursor: 'pointer',
                boxShadow: userRole === 'recruiter' ? '0 2px 5px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Building2 size={14} />
              Recruiter
            </button>
          </div>

          {/* API Health Pill */}
          <div 
            title={apiHealthy ? "Express NLP Backend Online (Port 5000)" : "Connecting to Backend..."}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.7rem',
              color: apiHealthy ? 'var(--success-emerald)' : 'var(--text-dim)',
              background: apiHealthy ? 'var(--success-bg)' : 'var(--surface-subtle)',
              border: `1px solid ${apiHealthy ? 'var(--success-border)' : 'var(--surface-border)'}`,
              padding: '0.3rem 0.6rem',
              borderRadius: '9999px',
              fontWeight: 600
            }}
          >
            {apiHealthy ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
            {apiHealthy ? 'API Active' : 'Connecting'}
          </div>
        </div>
      </div>
    </header>
  );
}
