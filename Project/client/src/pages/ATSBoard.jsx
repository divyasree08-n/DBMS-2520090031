import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  User, 
  Video, 
  MoreVertical,
  Plus
} from 'lucide-react';
import tokens from '../tokens';

const COLUMNS = [
  { id: 'Applied', label: 'Applied', color: '#64748b', bg: '#f8fafc' },
  { id: 'Screening', label: 'Screening', color: '#0ea5e9', bg: '#f0f9ff' },
  { id: 'Shortlisted', label: 'Shortlisted', color: '#7c3aed', bg: '#faf5ff' },
  { id: 'Interview', label: 'Interview', color: '#2563eb', bg: '#eff6ff' },
  { id: 'Offered', label: 'Offered', color: '#059669', bg: '#ecfdf5' },
  { id: 'Rejected', label: 'Rejected', color: '#e11d48', bg: '#fff1f2' }
];

export default function ATSBoard({
  applications = [],
  onUpdateStage,
  onOpenScheduleModal
}) {
  const [selectedColumn, setSelectedColumn] = useState('All');

  const moveStage = (app, direction) => {
    const currentIndex = COLUMNS.findIndex(c => c.id === app.stage);
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < COLUMNS.length) {
      onUpdateStage(app.id, COLUMNS[newIndex].id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: tokens.colors.primaryIce, color: tokens.colors.primaryRoyal, padding: '0.35rem 0.8rem', borderRadius: tokens.radii.full, fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <Layers size={14} />
            Applicant Tracking Pipeline (ATS)
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: tokens.colors.primaryNavy }}>
            Hiring Workflow Kanban
          </h1>
          <p style={{ fontSize: '0.9rem', color: tokens.colors.textMuted }}>
            Move applicants through recruitment stages with automated match scoring and quick interview booking.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: tokens.colors.textMuted }}>
          <span>Total Pipeline Volume:</span>
          <span className="badge badge-primary" style={{ fontSize: '0.85rem' }}>
            {applications.length} Candidates
          </span>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll View */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, minmax(280px, 1fr))',
        gap: '1.25rem',
        overflowX: 'auto',
        paddingBottom: '1.5rem',
        alignItems: 'start'
      }}>
        {COLUMNS.map(col => {
          const colApps = applications.filter(a => a.stage === col.id);

          return (
            <div
              key={col.id}
              style={{
                background: col.bg,
                border: `1.5px solid ${tokens.colors.surfaceBorder}`,
                borderRadius: tokens.radii.lg,
                padding: '1.25rem',
                minHeight: '650px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: tokens.shadows.sm
              }}
            >
              {/* Column Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${tokens.colors.surfaceBorder}`, paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: col.color }} />
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: tokens.colors.primaryNavy }}>
                    {col.label}
                  </span>
                </div>
                <span style={{
                  background: '#ffffff',
                  color: col.color,
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: tokens.radii.full,
                  border: `1px solid ${tokens.colors.surfaceBorder}`
                }}>
                  {colApps.length}
                </span>
              </div>

              {/* Cards in Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {colApps.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: tokens.colors.textDim, fontSize: '0.8rem' }}>
                    No candidates in {col.label}
                  </div>
                ) : (
                  colApps.map(app => (
                    <div
                      key={app.id}
                      style={{
                        background: '#ffffff',
                        border: `1px solid ${tokens.colors.surfaceBorder}`,
                        borderRadius: tokens.radii.md,
                        padding: '1.15rem',
                        boxShadow: tokens.shadows.sm,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {/* Card Header with Candidate Name & Score */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: tokens.colors.primaryNavy }}>
                            {app.candidateName}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: tokens.colors.primaryRoyal, fontWeight: 600 }}>
                            {app.jobTitle}
                          </div>
                        </div>

                        <div className={`score-circle ${app.overallMatchScore >= 85 ? 'score-high' : 'score-mid'}`} style={{ width: '38px', height: '38px', fontSize: '0.8rem', borderWidth: '2px' }}>
                          {app.overallMatchScore}%
                        </div>
                      </div>

                      {/* Candidate Skills snippet */}
                      {app.matchedSkills && app.matchedSkills.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {app.matchedSkills.slice(0, 3).map(skill => (
                            <span key={skill} className="badge badge-matched" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
                              ✓ {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Notes / Subtitle */}
                      {app.notes && (
                        <p style={{ fontSize: '0.75rem', color: tokens.colors.textMuted, fontStyle: 'italic', background: tokens.colors.surfaceSubtle, padding: '0.4rem 0.6rem', borderRadius: tokens.radii.sm }}>
                          "{app.notes}"
                        </p>
                      )}

                      {/* Card Actions: Move Left, Schedule, Move Right */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${tokens.colors.surfaceBorder}`, paddingTop: '0.65rem', marginTop: '0.25rem' }}>
                        <button
                          onClick={() => moveStage(app, -1)}
                          disabled={col.id === 'Applied'}
                          title="Move to previous stage"
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: col.id === 'Applied' ? tokens.colors.textDim : tokens.colors.textMuted,
                            cursor: col.id === 'Applied' ? 'default' : 'pointer',
                            padding: '0.2rem'
                          }}
                        >
                          <ArrowLeft size={16} />
                        </button>

                        <button
                          onClick={() => onOpenScheduleModal(app)}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem' }}
                        >
                          <Video size={12} color={tokens.colors.primaryRoyal} />
                          Schedule
                        </button>

                        <button
                          onClick={() => moveStage(app, 1)}
                          disabled={col.id === 'Rejected'}
                          title="Advance to next stage"
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: col.id === 'Rejected' ? tokens.colors.textDim : tokens.colors.primaryRoyal,
                            cursor: col.id === 'Rejected' ? 'default' : 'pointer',
                            padding: '0.2rem'
                          }}
                        >
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
