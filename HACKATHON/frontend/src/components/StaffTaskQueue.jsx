import React, { useState } from 'react';
import { 
  Wrench, 
  MapPin, 
  CheckCircle2, 
  User, 
  ChevronRight 
} from 'lucide-react';
import { STAFF_MEMBERS, DEPARTMENTS } from '../data/mockData';

export function StaffTaskQueue({ 
  complaints, 
  activeStaffId = 301, 
  onSelectComplaint, 
  onSetInProgress, 
  onOpenResolve 
}) {
  const [filterStatus, setFilterStatus] = useState('ALL');

  const staff = STAFF_MEMBERS.find(s => s.id === activeStaffId) || STAFF_MEMBERS[0];
  const dept = DEPARTMENTS.find(d => d.id === staff.departmentId);
  const initials = staff.name.split(' ').map(n => n[0]).join('').substring(0, 2);

  // Filter tasks assigned to this technician
  const myTasks = complaints.filter(c => c.assignedToId === activeStaffId);

  const filteredTasks = myTasks.filter(c => {
    if (filterStatus === 'ALL') return true;
    return c.status === filterStatus;
  });

  const pendingCount = myTasks.filter(c => c.status === 'ASSIGNED').length;
  const inProgressCount = myTasks.filter(c => c.status === 'IN_PROGRESS').length;
  const resolvedCount = myTasks.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;

  return (
    <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
      {/* Staff Header Profile Card */}
      <div className="klh-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderLeft: '4px solid #D97706' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #D97706, #B45309)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '1.15rem',
            fontWeight: 800
          }}>
            {initials}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-heading)' }}>{staff.name}</h2>
              <span style={{
                background: '#FEF3C7',
                color: '#B45309',
                padding: '0.15rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {staff.role}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
              <span>Department: <strong>{dept?.name || 'Facilities Maintenance'}</strong></span>
              <span>Contact: <strong>{staff.phone}</strong></span>
              <span>Duty Shift: <strong>08:30 AM – 05:30 PM IST</strong></span>
            </div>
          </div>
        </div>

        {/* Task Counters */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ textAlign: 'center', padding: '0.5rem 0.85rem', background: '#FEF3C7', borderRadius: 'var(--radius-md)', border: '1px solid #FDE68A' }}>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#B45309' }}>{pendingCount}</div>
            <div style={{ fontSize: '0.675rem', color: '#92400E', textTransform: 'uppercase', fontWeight: 600 }}>To Acknowledge</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.5rem 0.85rem', background: '#FFFBEB', borderRadius: 'var(--radius-md)', border: '1px solid #FDE68A' }}>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#D97706' }}>{inProgressCount}</div>
            <div style={{ fontSize: '0.675rem', color: '#B45309', textTransform: 'uppercase', fontWeight: 600 }}>In Progress</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.5rem 0.85rem', background: '#ECFDF5', borderRadius: 'var(--radius-md)', border: '1px solid #A7F3D0' }}>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#047857' }}>{resolvedCount}</div>
            <div style={{ fontSize: '0.675rem', color: '#065F46', textTransform: 'uppercase', fontWeight: 600 }}>Resolved</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['ALL', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].map(tab => (
            <button
              key={tab}
              className={`btn btn-sm ${filterStatus === tab ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus(tab)}
              style={{ fontSize: '0.775rem' }}
            >
              {tab === 'ALL' ? 'All Assigned Work' : tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredTasks.length}</strong> task(s)
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="klh-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <CheckCircle2 size={40} color="#059669" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-heading)', marginBottom: '0.5rem' }}>No pending tasks in this filter</h3>
          <p style={{ fontSize: '0.85rem' }}>All assignments have been completed.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredTasks.map(task => (
            <div 
              key={task.id} 
              className="klh-card klh-card-interactive" 
              style={{ padding: '1.25rem', borderLeft: task.priority === 'CRITICAL' ? '4px solid #DC2626' : '4px solid var(--primary)' }}
              onClick={() => onSelectComplaint(task)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    background: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {task.trackingNumber}
                  </span>
                  <span className={`badge badge-priority-${task.priority}`}>
                    {task.priority}
                  </span>
                  <span className={`badge badge-status-${task.status}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
                  Assigned: {task.createdAt}
                </div>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-heading)' }}>
                {task.title}
              </h3>

              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.45 }}>
                {task.description}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-light)',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={14} color="var(--primary)" />
                  <strong style={{ color: 'var(--text-heading)' }}>{task.location}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <User size={14} color="var(--text-faint)" />
                  <span>Complainant: <strong>{task.complainantName}</strong> ({task.complainantEmail})</span>
                </div>
              </div>

              {/* Action Buttons for this task */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectComplaint(task);
                  }}
                >
                  <span>View Full Details & History</span>
                  <ChevronRight size={14} />
                </button>

                {task.status === 'ASSIGNED' && (
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{ background: '#D97706', color: '#fff' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetInProgress(task.id);
                    }}
                  >
                    <Wrench size={14} />
                    <span>Acknowledge & Start Repair</span>
                  </button>
                )}

                {task.status === 'IN_PROGRESS' && (
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{ background: '#059669', color: '#fff' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenResolve(task);
                    }}
                  >
                    <CheckCircle2 size={14} />
                    <span>Complete Resolution</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
