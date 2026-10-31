import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCollege } from '../context/CollegeContext';
import { Navigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  Layers, 
  CheckCircle2, 
  Clock,
  Building2,
  FileText,
  AlertTriangle,
  Star,
  ChevronDown,
  BarChart3,
  Users
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { ComplaintCard } from '../components/ComplaintCard';
import { ComplaintForm } from '../components/ComplaintForm';
import { ComplaintDetailModal } from '../components/ComplaintDetailModal';
import { AdminAnalytics } from '../components/AdminAnalytics';
import { AdminUsersManagement } from '../components/AdminUsersManagement';
import { StaffTaskQueue } from '../components/StaffTaskQueue';
import { AssignModal, ResolveModal, FeedbackModal, ReopenModal } from '../components/Modals/WorkflowModals';
import { INITIAL_COMPLAINTS, CATEGORIES } from '../data/mockData';
import { getCurrentISTString } from '../utils/timeUtils';

export function PortalHome() {
  const { user, isAuthenticated } = useAuth();
  const { selectedCollege, setIsCollegeModalOpen } = useCollege();

  // Active Main Tab:
  // - Students/Faculty default to 'complaints'
  // - Admins can view 'complaints', 'analytics', 'users'
  // - Staff default to 'staff-tasks'
  const [activeTab, setActiveTab] = useState(() => {
    if (user?.role === 'STAFF') return 'staff-tasks';
    return 'complaints';
  });

  // Student / Faculty Sub-View: 'my' (My Complaints) vs 'campus' (All Campus Issues)
  const [studentViewMode, setStudentViewMode] = useState('my');

  // Load complaints from localStorage or initial seed
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('ccms_complaints');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse complaints', e);
      }
    }
    return INITIAL_COMPLAINTS;
  });

  const saveComplaints = (updated) => {
    setComplaints(updated);
    localStorage.setItem('ccms_complaints', JSON.stringify(updated));
  };

  // Search & Filter controls
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modals state
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [assignModalComplaint, setAssignModalComplaint] = useState(null);
  const [resolveModalComplaint, setResolveModalComplaint] = useState(null);
  const [feedbackModalComplaint, setFeedbackModalComplaint] = useState(null);
  const [reopenModalComplaint, setReopenModalComplaint] = useState(null);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  // Check auth AFTER hooks
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // 1. Submit Complaint
  const handleCreateComplaint = (complaintData) => {
    const nextId = complaints.length + 1;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingNumber = `CCMS-2026-${randomSuffix}`;
    const timestampIST = getCurrentISTString();

    const newEntry = {
      ...complaintData,
      id: nextId,
      collegeId: selectedCollege.id,
      trackingNumber,
      status: 'SUBMITTED',
      createdAt: timestampIST,
      updatedAt: timestampIST,
      assignedToId: null,
      assignedToName: null,
      history: [
        {
          id: 1,
          timestamp: timestampIST,
          from: null,
          to: 'SUBMITTED',
          actor: `${user.name} (${user.roleLabel || user.role})`,
          remarks: `Complaint registered at ${selectedCollege.shortName} with AI priority recommendation: ${complaintData.priority}.`
        }
      ]
    };

    const updated = [newEntry, ...complaints];
    saveComplaints(updated);
    setIsNewComplaintOpen(false);
    addToast(`Complaint ${trackingNumber} filed successfully! Priority: ${newEntry.priority}`);
  };

  // 2. Admin Assigns Staff
  const handleAssignStaff = (complaintId, staff, instructions) => {
    const timestampIST = getCurrentISTString();
    const updated = complaints.map(c => {
      if (c.id === complaintId) {
        const newHistory = [
          ...c.history,
          {
            id: c.history.length + 1,
            timestamp: timestampIST,
            from: c.status,
            to: 'ASSIGNED',
            actor: `${user.name} (Dean of Infrastructure)`,
            remarks: `Assigned to ${staff.name} (${staff.role}). Notes: ${instructions || 'Attend as per campus SLA.'}`
          }
        ];
        return {
          ...c,
          status: 'ASSIGNED',
          assignedToId: staff.id,
          assignedToName: staff.name,
          updatedAt: timestampIST,
          history: newHistory
        };
      }
      return c;
    });

    saveComplaints(updated);
    if (selectedComplaint?.id === complaintId) {
      setSelectedComplaint(updated.find(c => c.id === complaintId));
    }
    setAssignModalComplaint(null);
    addToast(`Assigned to ${staff.name} (${staff.role})`);
  };

  // 3. Staff Acknowledges Work
  const handleSetInProgress = (complaintId) => {
    const timestampIST = getCurrentISTString();
    const updated = complaints.map(c => {
      if (c.id === complaintId) {
        const newHistory = [
          ...c.history,
          {
            id: c.history.length + 1,
            timestamp: timestampIST,
            from: c.status,
            to: 'IN_PROGRESS',
            actor: `${user.name} (Staff)`,
            remarks: 'Technician acknowledged work order and commenced on-site repair.'
          }
        ];
        return {
          ...c,
          status: 'IN_PROGRESS',
          updatedAt: timestampIST,
          history: newHistory
        };
      }
      return c;
    });

    saveComplaints(updated);
    if (selectedComplaint?.id === complaintId) {
      setSelectedComplaint(updated.find(c => c.id === complaintId));
    }
    addToast('Work acknowledged. Status updated to IN PROGRESS');
  };

  // 4. Staff Resolves Complaint
  const handleResolveComplaint = (complaintId, remarks) => {
    const timestampIST = getCurrentISTString();
    const updated = complaints.map(c => {
      if (c.id === complaintId) {
        const newHistory = [
          ...c.history,
          {
            id: c.history.length + 1,
            timestamp: timestampIST,
            from: c.status,
            to: 'RESOLVED',
            actor: `${user.name} (Technician)`,
            remarks: `Repair completed. ${remarks}`
          }
        ];
        return {
          ...c,
          status: 'RESOLVED',
          resolutionRemarks: remarks,
          updatedAt: timestampIST,
          history: newHistory
        };
      }
      return c;
    });

    saveComplaints(updated);
    if (selectedComplaint?.id === complaintId) {
      setSelectedComplaint(updated.find(c => c.id === complaintId));
    }
    setResolveModalComplaint(null);
    addToast('Complaint marked as RESOLVED. Ready for complainant confirmation.');
  };

  // 5. Student / Faculty Feedback & Close
  const handleProvideFeedback = (complaintId, feedbackData) => {
    const timestampIST = getCurrentISTString();
    const updated = complaints.map(c => {
      if (c.id === complaintId) {
        const newHistory = [
          ...c.history,
          {
            id: c.history.length + 1,
            timestamp: timestampIST,
            from: 'RESOLVED',
            to: 'CLOSED',
            actor: `${user.name} (Complainant)`,
            remarks: `Fix accepted. Rated ${feedbackData.rating}/5 stars: "${feedbackData.comments || 'Satisfactory'}"`
          }
        ];
        return {
          ...c,
          status: 'CLOSED',
          feedback: feedbackData,
          updatedAt: timestampIST,
          history: newHistory
        };
      }
      return c;
    });

    saveComplaints(updated);
    if (selectedComplaint?.id === complaintId) {
      setSelectedComplaint(updated.find(c => c.id === complaintId));
    }
    setFeedbackModalComplaint(null);
    addToast(`Feedback submitted (${feedbackData.rating} Stars). Complaint CLOSED.`);
  };

  // 6. Student / Faculty Reopen
  const handleReopenComplaint = (complaintId, reason) => {
    const timestampIST = getCurrentISTString();
    const updated = complaints.map(c => {
      if (c.id === complaintId) {
        const newHistory = [
          ...c.history,
          {
            id: c.history.length + 1,
            timestamp: timestampIST,
            from: c.status,
            to: 'REOPENED',
            actor: `${user.name} (Complainant)`,
            remarks: `Fix rejected by complainant: "${reason}". Priority escalated to CRITICAL.`
          }
        ];
        return {
          ...c,
          status: 'REOPENED',
          priority: 'CRITICAL',
          updatedAt: timestampIST,
          history: newHistory
        };
      }
      return c;
    });

    saveComplaints(updated);
    if (selectedComplaint?.id === complaintId) {
      setSelectedComplaint(updated.find(c => c.id === complaintId));
    }
    setReopenModalComplaint(null);
    addToast('Complaint escalated and REOPENED.', 'error');
  };

  // Helper check for complainant identity
  const isMyComplaint = (c) => {
    if (!user) return false;
    return c.complainantId === user.id || 
           (c.complainantEmail && c.complainantEmail.toLowerCase() === user.email.toLowerCase());
  };

  // Pre-calculate user-specific stats
  const userRoleIsStudentOrFaculty = user.role === 'STUDENT' || user.role === 'FACULTY';
  const myComplaintsList = complaints.filter(isMyComplaint);
  const collegeComplaintsList = complaints.filter(c => !c.collegeId || c.collegeId === selectedCollege.id);

  const myTotalCount = myComplaintsList.length;
  const myActiveCount = myComplaintsList.filter(c => c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS').length;
  const myResolvedCount = myComplaintsList.filter(c => c.status === 'RESOLVED').length;
  const myClosedCount = myComplaintsList.filter(c => c.status === 'CLOSED').length;

  // Admin specific overview counts
  const unassignedCount = collegeComplaintsList.filter(c => c.status === 'SUBMITTED').length;
  const inProgressTotalCount = collegeComplaintsList.filter(c => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length;
  const criticalTotalCount = collegeComplaintsList.filter(c => c.priority === 'CRITICAL').length;

  // Determine active dataset to display in complaints tab
  let baseList = complaints;
  if (userRoleIsStudentOrFaculty) {
    baseList = studentViewMode === 'my' ? myComplaintsList : collegeComplaintsList;
  } else if (user.role === 'ADMIN') {
    // Admin sees complaints for selected college by default, or all
    baseList = collegeComplaintsList;
  }

  // Apply filters (search, category, status, priority)
  const filteredComplaints = baseList.filter(c => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = c.trackingNumber.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        (c.complainantName && c.complainantName.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (categoryFilter !== 'ALL' && c.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && c.priority !== priorityFilter) return false;

    return true;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewComplaint={() => setIsNewComplaintOpen(true)}
      />

      <main style={{ flex: 1, maxWidth: 1400, width: '100%', margin: '0 auto', padding: '1.5rem' }}>
        
        {/* Campus Status Banner */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-light)',
          borderLeft: '4px solid var(--primary)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#FEF2F2',
              color: 'var(--primary)',
              fontWeight: 800,
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.775rem'
            }}>
              <Building2 size={13} />
              <span>{selectedCollege.shortName}</span>
            </div>

            <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
              Operating in <strong>Indian Standard Time (IST, UTC+05:30)</strong> • Logged in as: <strong>{user.name}</strong> ({user.roleLabel || user.role})
            </span>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsCollegeModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.775rem' }}
          >
            <span>Switch College</span>
            <ChevronDown size={13} />
          </button>
        </div>

        {/* Tab 1: Complaints Directory / My Complaints Dashboard */}
        {activeTab === 'complaints' && (
          <div>
            
            {/* Student & Faculty Overview KPI Cards */}
            {userRoleIsStudentOrFaculty && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                      Complainant Dashboard
                    </h2>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      Track your submitted infrastructure issues and view campus-wide maintenance updates
                    </p>
                  </div>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setIsNewComplaintOpen(true)}
                    style={{ fontWeight: 700 }}
                  >
                    <PlusCircle size={16} />
                    <span>Report New Issue</span>
                  </button>
                </div>

                {/* KPI Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
                  
                  {/* Card 1: My Reported */}
                  <div className="klh-card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #2563EB' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>My Reported Issues</span>
                      <FileText size={18} color="#2563EB" />
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-heading)', marginTop: '0.35rem' }}>
                      {myTotalCount}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-faint)', marginTop: '0.15rem' }}>
                      Lodged under your institutional account
                    </div>
                  </div>

                  {/* Card 2: In Progress */}
                  <div className="klh-card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #D97706' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Under Action</span>
                      <Clock size={18} color="#D97706" />
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-heading)', marginTop: '0.35rem' }}>
                      {myActiveCount}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-faint)', marginTop: '0.15rem' }}>
                      Assigned to maintenance technician
                    </div>
                  </div>

                  {/* Card 3: Ready for Confirmation / Feedback */}
                  <div className="klh-card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #16A34A', background: myResolvedCount > 0 ? '#F0FDF4' : '#FFFFFF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: myResolvedCount > 0 ? '#166534' : 'var(--text-muted)' }}>Ready for Feedback</span>
                      <Star size={18} color="#16A34A" />
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: myResolvedCount > 0 ? '#15803D' : 'var(--text-heading)', marginTop: '0.35rem' }}>
                      {myResolvedCount}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: myResolvedCount > 0 ? '#166534' : 'var(--text-faint)', marginTop: '0.15rem' }}>
                      {myResolvedCount > 0 ? 'Action required: Rate or reopen fix' : 'No pending confirmations'}
                    </div>
                  </div>

                  {/* Card 4: Closed */}
                  <div className="klh-card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #64748B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Closed & Resolved</span>
                      <CheckCircle2 size={18} color="#64748B" />
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-heading)', marginTop: '0.35rem' }}>
                      {myClosedCount}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-faint)', marginTop: '0.15rem' }}>
                      Feedback logged & closed
                    </div>
                  </div>

                </div>

                {/* View Switcher: My Complaints vs Campus Feed */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '1.25rem',
                  padding: '0.35rem',
                  background: '#F1F5F9',
                  borderRadius: 'var(--radius-md)',
                  width: 'fit-content'
                }}>
                  <button
                    type="button"
                    onClick={() => setStudentViewMode('my')}
                    style={{
                      padding: '0.45rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      background: studentViewMode === 'my' ? '#FFFFFF' : 'transparent',
                      color: studentViewMode === 'my' ? 'var(--primary)' : 'var(--text-muted)',
                      boxShadow: studentViewMode === 'my' ? 'var(--shadow-xs)' : 'none'
                    }}
                  >
                    <span>My Complaints ({myTotalCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStudentViewMode('campus')}
                    style={{
                      padding: '0.45rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      background: studentViewMode === 'campus' ? '#FFFFFF' : 'transparent',
                      color: studentViewMode === 'campus' ? 'var(--primary)' : 'var(--text-muted)',
                      boxShadow: studentViewMode === 'campus' ? 'var(--shadow-xs)' : 'none'
                    }}
                  >
                    <span>Campus Community Issues ({collegeComplaintsList.length})</span>
                  </button>
                </div>
              </div>
            )}

            {/* Admin Executive Summary Banner */}
            {user.role === 'ADMIN' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                      Campus Complaints Directory & Dispatch
                    </h2>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      Review, prioritize, and assign maintenance work orders across all {selectedCollege.shortName} facilities
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setActiveTab('analytics')}
                      style={{ fontWeight: 700 }}
                    >
                      <BarChart3 size={15} />
                      <span>Executive BI Analytics</span>
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setActiveTab('users')}
                      style={{ fontWeight: 700 }}
                    >
                      <Users size={15} />
                      <span>Technicians & Staff</span>
                    </button>
                  </div>
                </div>

                {/* Admin Quick KPI Bar */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
                  <div className="klh-card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #2563EB' }}>
                    <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted)' }}>Total Campus Issues</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-heading)', marginTop: '0.25rem' }}>
                      {collegeComplaintsList.length}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-faint)' }}>{selectedCollege.shortName} database</div>
                  </div>

                  <div 
                    className="klh-card" 
                    onClick={() => setStatusFilter(statusFilter === 'SUBMITTED' ? 'ALL' : 'SUBMITTED')}
                    style={{ 
                      padding: '1rem 1.25rem', 
                      borderLeft: '4px solid #D97706',
                      cursor: 'pointer',
                      background: statusFilter === 'SUBMITTED' ? '#FEF3C7' : '#FFFFFF',
                      transition: 'all 0.15s ease'
                    }}
                    title="Click to toggle unassigned filter"
                  >
                    <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#B45309' }}>Needs Assignment</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#B45309', marginTop: '0.25rem' }}>
                      {unassignedCount}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: '#92400E' }}>
                      {statusFilter === 'SUBMITTED' ? 'Showing unassigned only (Click to clear)' : 'Click to filter unassigned'}
                    </div>
                  </div>

                  <div className="klh-card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #7C3AED' }}>
                    <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted)' }}>Active Repairs</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-heading)', marginTop: '0.25rem' }}>
                      {inProgressTotalCount}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-faint)' }}>Assigned or in progress</div>
                  </div>

                  <div 
                    className="klh-card" 
                    onClick={() => setPriorityFilter(priorityFilter === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
                    style={{ 
                      padding: '1rem 1.25rem', 
                      borderLeft: '4px solid #DC2626',
                      cursor: 'pointer',
                      background: priorityFilter === 'CRITICAL' ? '#FEF2F2' : '#FFFFFF',
                      transition: 'all 0.15s ease'
                    }}
                    title="Click to toggle critical filter"
                  >
                    <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#B91C1C' }}>Critical Emergencies</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#DC2626', marginTop: '0.25rem' }}>
                      {criticalTotalCount}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: '#991B1B' }}>
                      {priorityFilter === 'CRITICAL' ? 'Showing critical only (Click to clear)' : 'Click to filter critical'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Toolbar */}
            <div className="klh-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Search Bar */}
                <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '240px' }}>
                  <Search size={16} color="var(--text-faint)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    id="input-search-complaints"
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2.4rem' }}
                    placeholder="Search by tracking # (e.g. CCMS-2026-0819), title, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* Category Filter */}
                  <select
                    id="filter-category"
                    className="form-select"
                    style={{ minWidth: '150px' }}
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="ALL">All Categories</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>

                  {/* Status Filter */}
                  <select
                    id="filter-status"
                    className="form-select"
                    style={{ minWidth: '140px' }}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                    <option value="REOPENED">Reopened</option>
                  </select>

                  {/* Priority Filter */}
                  <select
                    id="filter-priority"
                    className="form-select"
                    style={{ minWidth: '130px' }}
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <option value="ALL">All Priorities</option>
                    <option value="CRITICAL">Critical Only</option>
                    <option value="HIGH">High Only</option>
                    <option value="MEDIUM">Medium Only</option>
                    <option value="LOW">Low Only</option>
                  </select>

                  <button
                    id="btn-report-issue-main"
                    className="btn btn-sm btn-primary"
                    onClick={() => setIsNewComplaintOpen(true)}
                    style={{ fontWeight: 700 }}
                  >
                    <PlusCircle size={15} />
                    <span>Report Issue</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Complaints Grid */}
            {filteredComplaints.length === 0 ? (
              <div className="klh-card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Layers size={48} color="var(--primary)" style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
                
                {userRoleIsStudentOrFaculty && studentViewMode === 'my' && myTotalCount === 0 ? (
                  <>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-heading)', marginBottom: '0.4rem', fontWeight: 800 }}>
                      No Complaints Filed Yet
                    </h3>
                    <p style={{ fontSize: '0.85rem', maxWidth: 450, margin: '0 auto 1.25rem' }}>
                      You haven't reported any maintenance or facility issues under your account. Notice something broken or requiring attention on campus?
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setIsNewComplaintOpen(true)}
                      style={{ fontWeight: 700 }}
                    >
                      <PlusCircle size={16} />
                      <span>Report Your First Issue</span>
                    </button>
                  </>
                ) : (
                  <>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-heading)', marginBottom: '0.4rem', fontWeight: 800 }}>
                      No complaints found matching filters
                    </h3>
                    <p style={{ fontSize: '0.85rem' }}>Try clearing your search query or resetting category/status filters.</p>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => { setSearchQuery(''); setCategoryFilter('ALL'); setStatusFilter('ALL'); setPriorityFilter('ALL'); }}
                      style={{ marginTop: '1rem' }}
                    >
                      Reset Filters
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid-cols-3">
                {filteredComplaints.map(complaint => (
                  <ComplaintCard
                    key={complaint.id}
                    complaint={complaint}
                    currentUser={user}
                    onClick={(c) => setSelectedComplaint(c)}
                    onQuickAssign={(c) => setAssignModalComplaint(c)}
                    onQuickResolve={(c) => setResolveModalComplaint(c)}
                    onQuickFeedback={(c) => setFeedbackModalComplaint(c)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Admin Analytics Dashboard */}
        {activeTab === 'analytics' && user.role === 'ADMIN' && (
          <AdminAnalytics complaints={complaints} />
        )}

        {/* Tab 3: Admin Users & Staff Management */}
        {activeTab === 'users' && user.role === 'ADMIN' && (
          <AdminUsersManagement />
        )}

        {/* Tab 4: Staff Task Queue */}
        {activeTab === 'staff-tasks' && user.role === 'STAFF' && (
          <StaffTaskQueue
            complaints={complaints}
            activeStaffId={user.id}
            onSelectComplaint={(c) => setSelectedComplaint(c)}
            onSetInProgress={handleSetInProgress}
            onOpenResolve={(c) => setResolveModalComplaint(c)}
          />
        )}
      </main>

      {/* 1. Modal: Register New Complaint */}
      {isNewComplaintOpen && (
        <ComplaintForm
          activeUser={user}
          onClose={() => setIsNewComplaintOpen(false)}
          onSubmit={handleCreateComplaint}
        />
      )}

      {/* 2. Modal: Complaint Detail & Full Timeline */}
      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          currentUser={user}
          onClose={() => setSelectedComplaint(null)}
          onOpenAssign={(c) => setAssignModalComplaint(c)}
          onOpenResolve={(c) => setResolveModalComplaint(c)}
          onOpenFeedback={(c) => setFeedbackModalComplaint(c)}
          onOpenReopen={(c) => setReopenModalComplaint(c)}
          onSetInProgress={handleSetInProgress}
        />
      )}

      {/* 3. Modal: Assign Staff (Admin) */}
      {assignModalComplaint && (
        <AssignModal
          complaint={assignModalComplaint}
          onClose={() => setAssignModalComplaint(null)}
          onAssign={handleAssignStaff}
          onConfirm={handleAssignStaff}
        />
      )}

      {/* 4. Modal: Mark Resolved & Remarks (Staff) */}
      {resolveModalComplaint && (
        <ResolveModal
          complaint={resolveModalComplaint}
          onClose={() => setResolveModalComplaint(null)}
          onResolve={handleResolveComplaint}
          onConfirm={handleResolveComplaint}
        />
      )}

      {/* 5. Modal: Provide Feedback / Rate Fix (Student / Faculty) */}
      {feedbackModalComplaint && (
        <FeedbackModal
          complaint={feedbackModalComplaint}
          onClose={() => setFeedbackModalComplaint(null)}
          onSubmitFeedback={handleProvideFeedback}
          onConfirm={handleProvideFeedback}
          onReopen={(c) => {
            setFeedbackModalComplaint(null);
            setReopenModalComplaint(c);
          }}
        />
      )}

      {/* 6. Modal: Reopen Complaint (Student / Faculty) */}
      {reopenModalComplaint && (
        <ReopenModal
          complaint={reopenModalComplaint}
          onClose={() => setReopenModalComplaint(null)}
          onReopen={handleReopenComplaint}
          onConfirm={handleReopenComplaint}
        />
      )}

      {/* Global Toast Container */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {toasts.map(t => (
          <div
            key={t.id}
            style={{
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: t.type === 'error' ? '#DC2626' : '#1F2937',
              color: '#FFFFFF',
              boxShadow: 'var(--shadow-lg)',
              fontSize: '0.875rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            {t.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} color="#4ADE80" />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
