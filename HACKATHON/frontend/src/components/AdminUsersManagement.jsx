import React, { useState } from 'react';
import { UserPlus, Wrench } from 'lucide-react';
import { STAFF_MEMBERS, DEPARTMENTS } from '../data/mockData';
import { useCollege } from '../context/CollegeContext';

export function AdminUsersManagement() {
  const { selectedCollege } = useCollege();
  const [staffList, setStaffList] = useState(STAFF_MEMBERS);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: '',
    departmentId: 1,
    phone: '',
    email: ''
  });

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaff.name.trim() || !newStaff.role.trim()) return;

    const created = {
      id: 300 + staffList.length + 1,
      name: newStaff.name.trim(),
      role: newStaff.role.trim(),
      departmentId: Number(newStaff.departmentId),
      activeTasks: 0,
      phone: newStaff.phone.trim() || '+91 94123 45699',
      email: newStaff.email.trim() || `${newStaff.name.toLowerCase().replace(/\s+/g, '.')}@campus.edu.in`
    };

    setStaffList([...staffList, created]);
    setShowAddStaffModal(false);
    setNewStaff({ name: '', role: '', departmentId: 1, phone: '', email: '' });
  };

  return (
    <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-heading)' }}>
            Maintenance Staff & Department Management
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manage technical dispatch units, phone directories, and technician assignments for {selectedCollege.shortName}.
          </p>
        </div>

        <button
          id="btn-add-technician"
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => setShowAddStaffModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
        >
          <UserPlus size={16} />
          <span>Provision New Technician</span>
        </button>
      </div>

      {/* Staff Directory Table */}
      <div className="klh-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-heading)' }}>
            Active Field Technicians ({staffList.length})
          </h3>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Accounts provisioned to receive administrative work orders across campus.
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-faint)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.65rem 0.75rem' }}>Technician Name</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Designation / Role</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Department</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Contact Number</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Institutional Email</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Active Tasks</th>
                <th style={{ padding: '0.65rem 0.75rem' }}>Availability</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((st, idx) => {
                const dept = DEPARTMENTS.find(d => d.id === st.departmentId);
                return (
                  <tr key={st.id} style={{ borderBottom: '1px solid var(--border-light)', background: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: '#F1F5F9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.725rem',
                          color: '#475569'
                        }}>
                          {st.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <span>{st.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-main)', fontWeight: 600 }}>{st.role}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{dept?.name || 'Central Estate'}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{st.phone}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--primary)', fontSize: '0.775rem' }}>{st.email}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 700 }}>
                      <span style={{
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        background: st.activeTasks > 1 ? '#FEF3C7' : '#F1F5F9',
                        color: st.activeTasks > 1 ? '#B45309' : '#475569',
                        fontSize: '0.75rem'
                      }}>
                        {st.activeTasks} open
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        color: '#059669',
                        fontSize: '0.725rem',
                        fontWeight: 700
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
                        On Duty
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Departments Overview */}
      <div className="klh-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.25rem' }}>
          Facility Departments Directory
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Service Level Agreements (SLA) and escalation heads.
        </p>

        <div className="grid-cols-3">
          {DEPARTMENTS.map(d => (
            <div 
              key={d.id}
              style={{
                padding: '1rem',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                background: '#FFFFFF',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', background: '#FEE2E2', padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-sm)' }}>
                  {d.code}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>Dept #{d.id}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-heading)', marginBottom: '0.35rem' }}>
                {d.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Head: <strong>{d.head}</strong>
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-faint)', marginTop: '0.2rem' }}>
                {d.email} • {d.phone}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="modal-overlay" onClick={() => setShowAddStaffModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wrench size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  Provision Technician Account
                </h3>
              </div>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setShowAddStaffModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStaff} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Suresh Varma"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Technical Specialization / Role</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Senior Network Specialist, HVAC Tech"
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  value={newStaff.departmentId}
                  onChange={(e) => setNewStaff({ ...newStaff, departmentId: e.target.value })}
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Hotline</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+91 94123 45678"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Institutional Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="technician@campus.edu.in"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddStaffModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontWeight: 700 }}
                >
                  Create Technician Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
