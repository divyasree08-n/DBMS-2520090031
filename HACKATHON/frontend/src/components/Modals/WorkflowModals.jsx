import React, { useState } from 'react';
import { X, Wrench, CheckCircle2, Star, RotateCcw, AlertTriangle } from 'lucide-react';
import { STAFF_MEMBERS } from '../../data/mockData';
import { getCurrentISTString } from '../../utils/timeUtils';

// 1. Assign Modal for Administrators
export function AssignModal({ complaint, onClose, onAssign, onConfirm }) {
  const [selectedStaffId, setSelectedStaffId] = useState(complaint.assignedToId || 301);
  const [instructions, setInstructions] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const staff = STAFF_MEMBERS.find(s => s.id === Number(selectedStaffId)) || STAFF_MEMBERS[0];
    const callback = onAssign || onConfirm;
    if (callback) {
      callback(complaint.id, staff, instructions);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wrench size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-heading)' }}>
              Dispatch Maintenance Technician
            </h3>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ borderRadius: '50%', padding: '0.4rem', width: 32, height: 32 }}>
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ marginBottom: '1rem', background: '#F8FAFC', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>Complaint:</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-heading)' }}>{complaint.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location: {complaint.location}</div>
            </div>

            <div className="form-group">
              <label htmlFor="select-staff" className="form-label">Select Technician / Staff Member</label>
              <select
                id="select-staff"
                className="form-select"
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(Number(e.target.value))}
              >
                {STAFF_MEMBERS.map(staff => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name} — {staff.role} ({staff.activeTasks} active tasks)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="assign-instructions" className="form-label">Administrative Instructions & Safety Notes</label>
              <textarea
                id="assign-instructions"
                className="form-textarea"
                rows={3}
                placeholder="e.g., Check circuit breaker box and bring replacement 32A MCB switch. Coordinate with lab technician..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" id="btn-confirm-assign" className="btn btn-primary">
              <Wrench size={16} />
              <span>Confirm & Dispatch Staff</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 2. Resolve Modal for Maintenance Staff
export function ResolveModal({ complaint, onClose, onResolve, onConfirm }) {
  const [remarks, setRemarks] = useState('');
  const [spareParts, setSpareParts] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!remarks.trim() || remarks.length < 10) {
      setError('Please describe the action taken and how the issue was fixed (at least 10 chars).');
      return;
    }
    const fullRemarks = spareParts ? `${remarks} (Parts Replaced: ${spareParts})` : remarks;
    const callback = onResolve || onConfirm;
    if (callback) {
      callback(complaint.id, fullRemarks);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={20} color="#059669" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-heading)' }}>
              Record Action Taken & Complete Fix
            </h3>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ borderRadius: '50%', padding: '0.4rem', width: 32, height: 32 }}>
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ marginBottom: '1rem', background: '#F8FAFC', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>Task:</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-heading)' }}>{complaint.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location: {complaint.location}</div>
            </div>

            <div className="form-group">
              <label htmlFor="resolve-remarks" className="form-label">
                Action Taken & Resolution Summary <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <textarea
                id="resolve-remarks"
                className="form-textarea"
                rows={3}
                placeholder="e.g., Replaced charred MCB breaker, insulated frayed copper connections, tested load current with multimeter..."
                value={remarks}
                onChange={(e) => { setRemarks(e.target.value); setError(''); }}
              />
              {error && <div className="form-error-msg">{error}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="resolve-parts" className="form-label">Spare Parts / Consumables Used (Optional)</label>
              <input
                id="resolve-parts"
                type="text"
                className="form-input"
                placeholder="e.g., 32A Schneider MCB, 2m 4sqmm wire, electrical tape"
                value={spareParts}
                onChange={(e) => setSpareParts(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" id="btn-confirm-resolve" className="btn btn-sm" style={{ background: '#059669', color: '#fff' }}>
              <CheckCircle2 size={16} />
              <span>Mark as RESOLVED</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 3. Feedback Modal for Complainants
export function FeedbackModal({ complaint, onClose, onSubmitFeedback, onConfirm, onReopen }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const feedbackData = {
      rating,
      comments: comments.trim() || 'Work completed satisfactorily. Thank you.',
      submittedAt: getCurrentISTString()
    };
    const callback = onSubmitFeedback || onConfirm;
    if (callback) {
      callback(complaint.id, feedbackData);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={20} color="#D97706" fill="#D97706" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-heading)' }}>
              Rate Resolution & Close Complaint
            </h3>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ borderRadius: '50%', padding: '0.4rem', width: 32, height: 32 }}>
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Please verify that the technician resolved your issue at <strong>{complaint.location}</strong>. Your rating helps maintain campus service standards.
            </p>

            <div style={{ textAlign: 'center', margin: '1.25rem 0' }}>
              <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transform: (hoverRating || rating) >= star ? 'scale(1.15)' : 'scale(1)',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <Star
                      size={32}
                      color="#D97706"
                      fill={(hoverRating || rating) >= star ? '#D97706' : 'transparent'}
                    />
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D97706', marginTop: '0.5rem' }}>
                {rating === 5 && 'Outstanding & Prompt Fix'}
                {rating === 4 && 'Good Resolution'}
                {rating === 3 && 'Average / Acceptable'}
                {rating === 2 && 'Needs Improvement'}
                {rating === 1 && 'Unsatisfactory'}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="feedback-comment" className="form-label">Review / Feedback Remarks</label>
              <textarea
                id="feedback-comment"
                className="form-textarea"
                rows={3}
                placeholder="e.g., The technician arrived swiftly and fixed the spark issue cleanly..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              {onReopen && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ color: '#DC2626', borderColor: '#FECACA', fontSize: '0.8rem' }}
                  onClick={() => onReopen(complaint)}
                >
                  <RotateCcw size={14} />
                  <span>Not fixed? Reopen</span>
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" id="btn-confirm-feedback" className="btn btn-sm" style={{ background: '#D97706', color: '#fff' }}>
                <Star size={16} fill="#fff" />
                <span>Submit Rating & Close</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// 4. Reopen Modal for Complainants
export function ReopenModal({ complaint, onClose, onReopen, onConfirm }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim() || reason.length < 10) {
      setError('Please provide specific details on why the issue is still not resolved (at least 10 chars).');
      return;
    }
    const callback = onReopen || onConfirm;
    if (callback) {
      callback(complaint.id, reason);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RotateCcw size={20} color="#DC2626" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-heading)' }}>
              Reopen Unresolved Complaint
            </h3>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ borderRadius: '50%', padding: '0.4rem', width: 32, height: 32 }}>
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem',
              color: '#B91C1C',
              fontSize: '0.8rem',
              marginBottom: '1rem'
            }}>
              <AlertTriangle size={16} style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'text-bottom' }} />
              Reopening will alert the Dean of Infrastructure and escalate priority for urgent re-inspection.
            </div>

            <div className="form-group">
              <label htmlFor="reopen-reason" className="form-label">
                Reason for Reopening <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <textarea
                id="reopen-reason"
                className="form-textarea"
                rows={3}
                placeholder="e.g., The switchboard tripped again 2 hours after staff left. Odor of burnt wire persists..."
                value={reason}
                onChange={(e) => { setReason(e.target.value); setError(''); }}
              />
              {error && <div className="form-error-msg">{error}</div>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" id="btn-confirm-reopen" className="btn btn-danger">
              <RotateCcw size={16} />
              <span>Escalate & Reopen</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
