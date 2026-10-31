import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  User, 
  Wrench, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  RotateCcw 
} from 'lucide-react';

const STATUS_STEPS = ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

export function ComplaintDetailModal({ 
  complaint, 
  onClose, 
  currentUser, 
  onOpenAssign, 
  onOpenResolve, 
  onOpenFeedback, 
  onOpenReopen, 
  onSetInProgress 
}) {
  if (!complaint) return null;

  const getStepIndex = (status) => {
    if (status === 'REOPENED') return 1;
    return STATUS_STEPS.indexOf(status);
  };

  const currentStepIdx = getStepIndex(complaint.status);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-dialog" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '780px' }}
        id="complaint-detail-modal"
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              fontWeight: 800,
              background: '#F1F5F9',
              color: '#1E293B',
              border: '1px solid #E2E8F0',
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-sm)'
            }}>
              {complaint.trackingNumber}
            </span>

            <span className={`badge badge-priority-${complaint.priority}`}>
              {complaint.priority}
            </span>

            <span className={`badge badge-status-${complaint.status}`}>
              {complaint.status.replace('_', ' ')}
            </span>
          </div>

          <button 
            id="btn-close-detail-modal"
            className="btn btn-secondary btn-sm" 
            onClick={onClose}
            style={{ borderRadius: '50%', padding: '0.4rem', width: 32, height: 32 }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Visual Status Progression Timeline Header */}
          <div style={{
            background: '#F8FAFC',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-faint)', fontWeight: 700, marginBottom: '1rem', letterSpacing: '0.05em' }}>
              Resolution Lifecycle Pipeline
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              {/* Connecting line */}
              <div style={{
                position: 'absolute',
                top: '14px',
                left: '20px',
                right: '20px',
                height: '3px',
                background: '#E2E8F0',
                zIndex: 0
              }}>
                <div style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--primary), #059669)',
                  width: `${(Math.max(0, currentStepIdx) / (STATUS_STEPS.length - 1)) * 100}%`,
                  transition: 'width 0.3s ease'
                }} />
              </div>

              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: isCurrent ? 'var(--primary)' : isPassed ? '#059669' : '#FFFFFF',
                      border: isCurrent ? '3px solid #660000' : isPassed ? '2px solid #059669' : '2px solid var(--border-medium)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isPassed || isCurrent ? '#FFFFFF' : 'var(--text-faint)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      boxShadow: isCurrent ? '0 2px 6px rgba(128, 0, 0, 0.3)' : 'none'
                    }}>
                      {isPassed ? <CheckCircle2 size={15} /> : idx + 1}
                    </div>
                    <span style={{
                      fontSize: '0.675rem',
                      fontWeight: isCurrent ? 700 : 500,
                      color: isCurrent ? 'var(--primary)' : isPassed ? '#059669' : 'var(--text-faint)',
                      marginTop: '0.4rem',
                      textAlign: 'center'
                    }}>
                      {step.replace('_', ' ')}
                    </span>
                  </div>
                );
              })}
            </div>

            {complaint.status === 'REOPENED' && (
              <div style={{
                marginTop: '1rem',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 'var(--radius-sm)',
                padding: '0.5rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#B91C1C',
                fontSize: '0.8rem'
              }}>
                <RotateCcw size={16} />
                <span><strong>Status Notice:</strong> This complaint was re-opened by the complainant because the issue remains unresolved.</span>
              </div>
            )}
          </div>

          {/* Title & Core Details */}
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.3, color: 'var(--text-heading)' }}>
            {complaint.title}
          </h2>

          <div style={{
            display: 'flex',
            gap: '1.5rem',
            flexWrap: 'wrap',
            paddingBottom: '0.85rem',
            borderBottom: '1px solid var(--border-light)',
            marginBottom: '1.25rem',
            fontSize: '0.825rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
              <MapPin size={15} color="var(--primary)" />
              <strong style={{ color: 'var(--text-heading)' }}>{complaint.location}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
              <User size={15} color="var(--primary)" />
              <span>Reported by: <strong>{complaint.complainantName}</strong> ({complaint.complainantEmail})</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-faint)' }}>
              <Clock size={15} />
              <span>{complaint.createdAt}</span>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.825rem', textTransform: 'uppercase', color: 'var(--text-faint)', fontWeight: 700, marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
              Detailed Description
            </h4>
            <div style={{
              background: '#F8FAFC',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              color: 'var(--text-main)'
            }}>
              {complaint.description}
            </div>
          </div>

          {/* Photo Attachment Evidence */}
          {complaint.attachmentUrl && (
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.825rem', textTransform: 'uppercase', color: 'var(--text-faint)', fontWeight: 700, marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                Photo Evidence Attached
              </h4>
              <div style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--border-light)',
                maxWidth: '440px',
                background: '#FFFFFF'
              }}>
                <img 
                  src={complaint.attachmentUrl} 
                  alt="Complaint Evidence" 
                  style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '240px', objectFit: 'cover' }} 
                />
                <div style={{ padding: '0.4rem 0.75rem', background: '#F8FAFC', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)' }}>
                  File: {complaint.attachmentName || 'evidence_photo.jpg'}
                </div>
              </div>
            </div>
          )}

          {/* AI Triage Intelligence Details */}
          {complaint.aiConfidenceScore && (
            <div className="ai-triage-card" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <Sparkles size={16} color="#16A34A" />
                <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#166534' }}>
                  Natural Language Processing (NLP) Triage Log
                </span>
                <span style={{ fontSize: '0.725rem', fontWeight: 700, background: '#DCFCE7', color: '#15803D', padding: '0.1rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                  Confidence: {(complaint.aiConfidenceScore * 100).toFixed(0)}%
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#166534' }}>
                TF-IDF + Naive Bayes Classifier recommended category <strong>{complaint.category}</strong> with priority level <strong>{complaint.aiSuggestedPriority}</strong>.
              </p>
            </div>
          )}

          {/* Staff Resolution Remarks */}
          {complaint.resolutionRemarks && (
            <div style={{
              background: '#ECFDF5',
              border: '1px solid #A7F3D0',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                <CheckCircle2 size={16} color="#059669" />
                <span style={{ fontWeight: 700, color: '#065F46', fontSize: '0.85rem' }}>
                  Technician Action Taken (by {complaint.assignedToName})
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#047857', lineHeight: 1.5 }}>
                {complaint.resolutionRemarks}
              </p>
            </div>
          )}

          {/* Student Feedback */}
          {complaint.feedback && (
            <div style={{
              background: '#FEF3C7',
              border: '1px solid #FDE68A',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 700, color: '#92400E', fontSize: '0.85rem' }}>
                  Student Satisfaction Rating
                </span>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      size={15} 
                      fill={star <= complaint.feedback.rating ? '#D97706' : 'transparent'} 
                      color="#D97706" 
                    />
                  ))}
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#B45309', fontStyle: 'italic' }}>
                "{complaint.feedback.comments}"
              </p>
            </div>
          )}

          {/* Comprehensive Status History */}
          <div>
            <h4 style={{ fontSize: '0.825rem', textTransform: 'uppercase', color: 'var(--text-faint)', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
              Status History & Audit Trail (IST)
            </h4>

            <div className="timeline">
              {complaint.history?.map((hist, index) => (
                <div key={hist.id || index} className="timeline-item">
                  <div className={`timeline-bullet ${index === complaint.history.length - 1 ? 'completed' : ''}`} />
                  <div className="timeline-content">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span className={`badge badge-status-${hist.to}`}>
                        {hist.to.replace('_', ' ')}
                      </span>
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-faint)' }}>
                        {hist.timestamp}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-heading)' }}>
                      {hist.actor}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {hist.remarks}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="modal-footer">
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Admin Actions */}
            {currentUser?.role === 'ADMIN' && (
              <button
                type="button"
                id="btn-admin-assign-modal"
                className="btn btn-primary btn-sm"
                onClick={() => onOpenAssign(complaint)}
              >
                <Wrench size={14} />
                <span>{complaint.assignedToName ? 'Reassign Staff' : 'Assign Technician'}</span>
              </button>
            )}

            {/* Staff Actions */}
            {currentUser?.role === 'STAFF' && (
              <>
                {complaint.status === 'ASSIGNED' && (
                  <button
                    type="button"
                    id="btn-staff-start-work"
                    className="btn btn-sm"
                    onClick={() => onSetInProgress(complaint.id)}
                    style={{ background: '#D97706', color: '#fff' }}
                  >
                    <Wrench size={14} />
                    <span>Acknowledge & Start Repair</span>
                  </button>
                )}

                {complaint.status === 'IN_PROGRESS' && (
                  <button
                    type="button"
                    id="btn-staff-resolve-modal"
                    className="btn btn-sm"
                    onClick={() => onOpenResolve(complaint)}
                    style={{ background: '#059669', color: '#fff' }}
                  >
                    <CheckCircle2 size={14} />
                    <span>Submit Resolution</span>
                  </button>
                )}
              </>
            )}

            {/* Student/Faculty Actions */}
            {(currentUser?.role === 'STUDENT' || currentUser?.role === 'FACULTY') && complaint.status === 'RESOLVED' && !complaint.feedback && (
              <>
                <button
                  type="button"
                  id="btn-student-reopen"
                  className="btn btn-danger btn-sm"
                  onClick={() => onOpenReopen(complaint)}
                >
                  <RotateCcw size={14} />
                  <span>Reopen (Unresolved)</span>
                </button>

                <button
                  type="button"
                  id="btn-student-feedback"
                  className="btn btn-sm"
                  onClick={() => onOpenFeedback(complaint)}
                  style={{ background: '#059669', color: '#fff' }}
                >
                  <Star size={14} />
                  <span>Confirm Fix & Rate</span>
                </button>
              </>
            )}

            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
