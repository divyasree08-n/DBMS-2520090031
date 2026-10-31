import React from 'react';
import { 
  Zap, 
  Wifi, 
  Droplets, 
  Home, 
  Sparkles, 
  Armchair, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Star, 
  Wrench, 
  AlertCircle 
} from 'lucide-react';

const CATEGORY_ICONS = {
  Electrical: Zap,
  'Internet/Network': Wifi,
  Plumbing: Droplets,
  Hostel: Home,
  Cleanliness: Sparkles,
  Furniture: Armchair,
  Security: ShieldAlert
};

export function ComplaintCard({ complaint, onClick, currentUser, onQuickAssign, onQuickResolve, onQuickFeedback }) {
  const IconComponent = CATEGORY_ICONS[complaint.category] || AlertCircle;

  return (
    <div 
      className="klh-card klh-card-interactive" 
      style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      onClick={() => onClick(complaint)}
      id={`complaint-card-${complaint.trackingNumber}`}
    >
      <div>
        {/* Top Header: Tracking Number, Category, Priority, Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              fontFamily: 'monospace',
              fontSize: '0.775rem',
              fontWeight: 700,
              background: '#F1F5F9',
              color: '#334155',
              border: '1px solid #E2E8F0',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              letterSpacing: '0.04em'
            }}>
              {complaint.trackingNumber}
            </span>

            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.775rem',
              color: 'var(--text-muted)',
              fontWeight: 600
            }}>
              <IconComponent size={14} color="var(--primary)" />
              {complaint.category}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span className={`badge badge-priority-${complaint.priority}`}>
              {complaint.priority}
            </span>
            <span className={`badge badge-status-${complaint.status}`}>
              {complaint.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.45rem', lineHeight: 1.35, color: 'var(--text-heading)' }}>
          {complaint.title}
        </h3>

        {/* Description Snippet */}
        <p style={{
          fontSize: '0.825rem',
          color: 'var(--text-muted)',
          marginBottom: '0.75rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.45
        }}>
          {complaint.description}
        </p>

        {/* AI Confidence Tag */}
        {complaint.aiConfidenceScore && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: 'var(--radius-full)',
            padding: '0.15rem 0.55rem',
            fontSize: '0.7rem',
            color: '#15803D',
            marginBottom: '0.75rem',
            fontWeight: 600
          }}>
            <Sparkles size={11} color="#16A34A" />
            <span>AI Triaged ({(complaint.aiConfidenceScore * 100).toFixed(0)}% conf)</span>
          </div>
        )}
      </div>

      {/* Meta Footer */}
      <div>
        <div style={{
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          fontSize: '0.775rem',
          color: 'var(--text-faint)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={13} color="var(--primary)" />
            <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {complaint.location}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={13} />
              <span>{complaint.createdAt}</span>
            </div>

            {complaint.assignedToName && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#6B21A8', fontWeight: 600 }}>
                <Wrench size={12} />
                <span>{complaint.assignedToName}</span>
              </div>
            )}

            {complaint.feedback && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#D97706' }}>
                <Star size={12} fill="#D97706" />
                <span style={{ fontWeight: 700 }}>{complaint.feedback.rating}/5</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm" 
            style={{ flex: 1, fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
            onClick={(e) => {
              e.stopPropagation();
              onClick(complaint);
            }}
          >
            <span>View Timeline</span>
            <ChevronRight size={14} />
          </button>

          {currentUser?.role === 'ADMIN' && complaint.status === 'SUBMITTED' && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
              onClick={(e) => {
                e.stopPropagation();
                onQuickAssign(complaint);
              }}
            >
              Assign
            </button>
          )}

          {currentUser?.role === 'STAFF' && (complaint.status === 'ASSIGNED' || complaint.status === 'IN_PROGRESS') && (
            <button
              type="button"
              className="btn btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem', background: '#D97706', color: '#fff' }}
              onClick={(e) => {
                e.stopPropagation();
                onQuickResolve(complaint);
              }}
            >
              Update
            </button>
          )}

          {(currentUser?.role === 'STUDENT' || currentUser?.role === 'FACULTY') && complaint.status === 'RESOLVED' && !complaint.feedback && (
            <button
              type="button"
              className="btn btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem', background: '#059669', color: '#fff' }}
              onClick={(e) => {
                e.stopPropagation();
                onQuickFeedback(complaint);
              }}
            >
              Review Fix
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
