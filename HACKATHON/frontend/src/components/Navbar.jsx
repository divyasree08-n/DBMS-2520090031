import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCollege } from '../context/CollegeContext';
import { 
  LogOut, 
  FileText, 
  BarChart3, 
  Wrench, 
  PlusCircle, 
  Users,
  Building2,
  ChevronDown,
  GraduationCap
} from 'lucide-react';
import { SYSTEM_INFO } from '../data/mockData';

export function Navbar({ activeTab, setActiveTab, onOpenNewComplaint }) {
  const { user, logout } = useAuth();
  const { selectedCollege, setIsCollegeModalOpen } = useCollege();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="klh-header">
      <div className="klh-header-inner">
        {/* Brand logo & System Name */}
        <div className="brand-badge" onClick={() => setActiveTab('complaints')} style={{ cursor: 'pointer' }}>
          <div className="brand-logo-shield" style={{ background: 'var(--primary)', color: '#FFFFFF' }}>
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="brand-text-main">{SYSTEM_INFO.systemName}</div>
            <div className="brand-text-sub">{SYSTEM_INFO.tagline}</div>
          </div>
        </div>

        {/* Institution / College Selector in Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsCollegeModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: '#FEF2F2',
              borderColor: '#FECACA',
              color: 'var(--primary)',
              fontSize: '0.8rem',
              fontWeight: 700
            }}
            title="Click to switch institution"
          >
            <Building2 size={14} />
            <span>{selectedCollege.shortName}</span>
            <ChevronDown size={13} />
          </button>
        </div>

        {/* Navigation Tabs based on Role */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            id="nav-tab-complaints"
            className={`btn btn-sm ${activeTab === 'complaints' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('complaints')}
          >
            <FileText size={16} />
            <span>{user.role === 'STUDENT' || user.role === 'FACULTY' ? 'My Complaints' : 'Complaints Directory'}</span>
          </button>

          {user.role === 'ADMIN' && (
            <>
              <button
                id="nav-tab-analytics"
                className={`btn btn-sm ${activeTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart3 size={16} />
                <span>Executive Analytics</span>
              </button>

              <button
                id="nav-tab-users"
                className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('users')}
              >
                <Users size={16} />
                <span>Departments & Staff</span>
              </button>
            </>
          )}

          {user.role === 'STAFF' && (
            <button
              id="nav-tab-staff-tasks"
              className={`btn btn-sm ${activeTab === 'staff-tasks' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('staff-tasks')}
            >
              <Wrench size={16} />
              <span>Assigned Work Orders</span>
            </button>
          )}

          {/* Quick Action: Report Issue (Available for everyone) */}
          <button
            id="nav-btn-report-issue"
            className="btn btn-sm btn-primary"
            onClick={onOpenNewComplaint}
            style={{ fontWeight: 700 }}
          >
            <PlusCircle size={16} />
            <span>Report Issue</span>
          </button>
        </nav>

        {/* User Profile Pill & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'var(--primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.75rem'
            }}>
              {user.avatar || 'U'}
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>
                {user.roleLabel || user.role}
              </div>
            </div>
          </div>

          <button
            id="btn-logout"
            className="btn btn-secondary btn-sm"
            onClick={handleLogout}
            title="Sign out of system"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
