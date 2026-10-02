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
  AlertCircle,
  LogOut,
  User,
  Search,
  SlidersHorizontal,
  BookmarkCheck
} from 'lucide-react';
import tokens from '../tokens';

export default function Layout({
  children,
  currentPage,
  setCurrentPage,
  user,
  onLogout,
  onOpenAuth,
  apiHealthy,
  stats
}) {
  const isRecruiter = user?.role === 'recruiter';

  return (
    <div className="app-container">
      {/* Top Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${tokens.colors.surfaceBorder}`,
        boxShadow: '0 4px 20px -2px rgba(37, 99, 235, 0.06)'
      }}>
        <div style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {/* Logo */}
          <div 
            onClick={() => setCurrentPage(isRecruiter ? 'recruiterDashboard' : 'candidateDashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: tokens.radii.md,
              background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 6px 16px rgba(37, 99, 235, 0.28)'
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: tokens.colors.primaryNavy }}>
                  Recruit<span style={{ color: tokens.colors.primaryRoyal }}>AI</span>
                </span>
                <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                  Explainable NLP
                </span>
              </div>
              <p style={{ fontSize: '0.725rem', color: tokens.colors.textMuted, fontWeight: 500 }}>
                Resume Parsing & Precision Match Engine
              </p>
            </div>
          </div>

          {/* Navigation Items based on Role */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
            {/* Candidate Navigation */}
            {!isRecruiter ? (
              <>
                <button
                  onClick={() => setCurrentPage('candidateDashboard')}
                  className="btn"
                  style={{
                    padding: '0.45rem 0.8rem',
                    fontSize: '0.825rem',
                    borderRadius: tokens.radii.sm,
                    background: currentPage === 'candidateDashboard' ? tokens.colors.primaryIce : 'transparent',
                    color: currentPage === 'candidateDashboard' ? tokens.colors.primaryRoyal : tokens.colors.textMuted,
                    fontWeight: currentPage === 'candidateDashboard' ? 700 : 500
                  }}
                >
                  Dashboard
                </button>

                <button
                  onClick={() => setCurrentPage('jobSearch')}
                  className="btn"
                  style={{
                    padding: '0.45rem 0.8rem',
                    fontSize: '0.825rem',
                    borderRadius: tokens.radii.sm,
                    background: currentPage === 'jobSearch' ? tokens.colors.primaryIce : 'transparent',
                    color: currentPage === 'jobSearch' ? tokens.colors.primaryRoyal : tokens.colors.textMuted,
                    fontWeight: currentPage === 'jobSearch' ? 700 : 500
                  }}
                >
                  <Search size={15} />
                  Find Jobs
                </button>

                <button
                  onClick={() => setCurrentPage('resumeUpload')}
                  className="btn"
                  style={{
                    padding: '0.45rem 0.8rem',
                    fontSize: '0.825rem',
                    borderRadius: tokens.radii.sm,
                    background: currentPage === 'resumeUpload' ? tokens.colors.primaryIce : 'transparent',
                    color: currentPage === 'resumeUpload' ? tokens.colors.primaryRoyal : tokens.colors.textMuted,
                    fontWeight: currentPage === 'resumeUpload' ? 700 : 500
                  }}
                >
                  <FileText size={15} />
                  Resume Parser
                </button>

                <button
                  onClick={() => setCurrentPage('candidateMatches')}
                  className="btn"
                  style={{
                    padding: '0.45rem 0.8rem',
                    fontSize: '0.825rem',
                    borderRadius: tokens.radii.sm,
                    background: currentPage === 'candidateMatches' ? tokens.colors.primaryIce : 'transparent',
                    color: currentPage === 'candidateMatches' ? tokens.colors.primaryRoyal : tokens.colors.textMuted,
                    fontWeight: currentPage === 'candidateMatches' ? 700 : 500
                  }}
                >
                  <SlidersHorizontal size={15} />
                  My Matches
                </button>

                <button
                  onClick={() => setCurrentPage('applications')}
                  className="btn"
                  style={{
                    padding: '0.45rem 0.8rem',
                    fontSize: '0.825rem',
                    borderRadius: tokens.radii.sm,
                    background: currentPage === 'applications' ? tokens.colors.primaryIce : 'transparent',
                    color: currentPage === 'applications' ? tokens.colors.primaryRoyal : tokens.colors.textMuted,
                    fontWeight: currentPage === 'applications' ? 700 : 500
                  }}
                >
                  <BookmarkCheck size={15} />
                  Applications
                </button>

                <button
                  onClick={() => setCurrentPage('candidateProfile')}
                  className="btn"
                  style={{
                    padding: '0.45rem 0.8rem',
                    fontSize: '0.825rem',
                    borderRadius: tokens.radii.sm,
                    background: currentPage === 'candidateProfile' ? tokens.colors.primaryIce : 'transparent',
                    color: currentPage === 'candidateProfile' ? tokens.colors.primaryRoyal : tokens.colors.textMuted,
                    fontWeight: currentPage === 'candidateProfile' ? 700 : 500
                  }}
                >
                  <User size={15} />
                  Profile
                </button>
              </>
            ) : (
              /* Recruiter Navigation */
              <>
                <button
                  onClick={() => setCurrentPage('recruiterDashboard')}
                  className="btn"
                  style={{
                    padding: '0.45rem 0.8rem',
                    fontSize: '0.825rem',
                    borderRadius: tokens.radii.sm,
                    background: currentPage === 'recruiterDashboard' ? tokens.colors.primaryIce : 'transparent',
                    color: currentPage === 'recruiterDashboard' ? tokens.colors.primaryRoyal : tokens.colors.textMuted,
                    fontWeight: currentPage === 'recruiterDashboard' ? 700 : 500
                  }}
                >
                  Dashboard & Analytics
                </button>

                <button
                  onClick={() => setCurrentPage('atsBoard')}
                  className="btn"
                  style={{
                    padding: '0.45rem 0.8rem',
                    fontSize: '0.825rem',
                    borderRadius: tokens.radii.sm,
                    background: currentPage === 'atsBoard' ? tokens.colors.primaryIce : 'transparent',
                    color: currentPage === 'atsBoard' ? tokens.colors.primaryRoyal : tokens.colors.textMuted,
                    fontWeight: currentPage === 'atsBoard' ? 700 : 500
                  }}
                >
                  <Layers size={15} />
                  ATS Kanban
                </button>

                <button
                  onClick={() => setCurrentPage('candidateMatches')}
                  className="btn"
                  style={{
                    padding: '0.45rem 0.8rem',
                    fontSize: '0.825rem',
                    borderRadius: tokens.radii.sm,
                    background: currentPage === 'candidateMatches' ? tokens.colors.primaryIce : 'transparent',
                    color: currentPage === 'candidateMatches' ? tokens.colors.primaryRoyal : tokens.colors.textMuted,
                    fontWeight: currentPage === 'candidateMatches' ? 700 : 500
                  }}
                >
                  <SlidersHorizontal size={15} />
                  Ranked Candidates
                </button>

                <button
                  onClick={() => setCurrentPage('applications')}
                  className="btn"
                  style={{
                    padding: '0.45rem 0.8rem',
                    fontSize: '0.825rem',
                    borderRadius: tokens.radii.sm,
                    background: currentPage === 'applications' ? tokens.colors.primaryIce : 'transparent',
                    color: currentPage === 'applications' ? tokens.colors.primaryRoyal : tokens.colors.textMuted,
                    fontWeight: currentPage === 'applications' ? 700 : 500
                  }}
                >
                  <BookmarkCheck size={15} />
                  All Applicants
                </button>

                <button
                  onClick={() => setCurrentPage('postJob')}
                  className="btn btn-primary"
                  style={{ padding: '0.45rem 0.95rem', fontSize: '0.825rem', borderRadius: tokens.radii.sm }}
                >
                  + Post New Job
                </button>
              </>
            )}

            {/* Components Section Tab */}
            <button
              onClick={() => setCurrentPage('componentsShowcase')}
              className="btn"
              style={{
                padding: '0.45rem 0.8rem',
                fontSize: '0.825rem',
                borderRadius: tokens.radii.sm,
                background: currentPage === 'componentsShowcase' ? tokens.colors.primaryRoyal : 'rgba(37, 99, 235, 0.08)',
                color: currentPage === 'componentsShowcase' ? '#ffffff' : tokens.colors.primaryRoyal,
                fontWeight: 700,
                border: `1px solid ${currentPage === 'componentsShowcase' ? tokens.colors.primaryRoyal : tokens.colors.primaryIceBorder}`
              }}
            >
              <Component size={15} />
              Components
            </button>
          </nav>

          {/* User Controls & API Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>


            {/* API Health Pill */}
            <div 
              title={apiHealthy ? "Express NLP Backend Online (Port 5000)" : "Connecting to Express Backend..."}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.7rem',
                color: apiHealthy ? tokens.colors.successEmerald : tokens.colors.textDim,
                background: apiHealthy ? tokens.colors.successBg : tokens.colors.surfaceSubtle,
                border: `1px solid ${apiHealthy ? tokens.colors.successBorder : tokens.colors.surfaceBorder}`,
                padding: '0.3rem 0.6rem',
                borderRadius: tokens.radii.full,
                fontWeight: 600
              }}
            >
              {apiHealthy ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
              {apiHealthy ? 'API Active' : 'Connecting'}
            </div>

            {/* User Details & Login/Logout Controls */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div 
                  onClick={() => setCurrentPage(isRecruiter ? 'recruiterDashboard' : 'candidateProfile')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.3rem 0.65rem 0.3rem 0.35rem',
                    background: tokens.colors.primaryIce,
                    border: `1px solid ${tokens.colors.primaryIceBorder}`,
                    borderRadius: tokens.radii.full,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title="Click to view/edit your profile"
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: tokens.radii.full,
                    background: tokens.colors.primaryRoyal,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8rem'
                  }}>
                    {user?.name ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'U'}
                  </div>
                  <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: tokens.colors.primaryNavy }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: '0.675rem', color: tokens.colors.primaryRoyal, fontWeight: 600 }}>
                      {isRecruiter ? 'Recruiter / HR' : 'Candidate'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="Sign Out / Switch Account"
                  className="btn btn-secondary"
                  style={{
                    padding: '0.4rem 0.65rem',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    color: tokens.colors.textMuted
                  }}
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="btn btn-primary"
                style={{
                  fontSize: '0.825rem',
                  padding: '0.45rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <User size={15} />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {children}
      </main>

      {/* Modern Blue & White Footer */}
      <footer style={{
        marginTop: 'auto',
        background: '#ffffff',
        borderTop: `1px solid ${tokens.colors.surfaceBorder}`,
        padding: '2rem 1.5rem',
        color: tokens.colors.textMuted,
        fontSize: '0.85rem'
      }}>
        <div style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: tokens.radii.sm,
              background: tokens.colors.primaryRoyal,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Sparkles size={16} />
            </div>
            <span style={{ fontWeight: 700, color: tokens.colors.primaryNavy }}>RecruitAI</span>
            <span>— Job Portal with Explainable Resume Parsing & Matching</span>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem' }}>
            <span>Node.js & Express (Port 5000)</span>
            <span>•</span>
            <span>React + Vite Frontend</span>
            <span>•</span>
            <span>NLP Microservice Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
