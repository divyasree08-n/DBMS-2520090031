import React, { useState } from 'react';
import { 
  BookmarkCheck, 
  Calendar, 
  Video, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  MapPin,
  DollarSign,
  Layers,
  ChevronRight
} from 'lucide-react';
import tokens from '../tokens';

const STAGE_ORDER = ['Applied', 'Screening', 'Shortlisted', 'Interview', 'Offered', 'Rejected'];

export default function Applications({
  applications = [],
  interviews = [],
  setCurrentPage,
  user
}) {
  const [filterStage, setFilterStage] = useState('All');

  const filteredApps = applications.filter(app => {
    if (filterStage === 'All') return true;
    return app.stage === filterStage;
  });

  const getStageBadge = (stage) => {
    switch (stage) {
      case 'Offered':
        return <span className="badge badge-matched" style={{ fontSize: '0.75rem' }}>✓ Offer Extended</span>;
      case 'Interview':
        return <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>🗓 Interview Scheduled</span>;
      case 'Shortlisted':
        return <span className="badge badge-primary" style={{ fontSize: '0.75rem', background: '#f5f3ff', color: '#7c3aed', borderColor: '#ddd6fe' }}>★ Shortlisted</span>;
      case 'Screening':
        return <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>Screening in Progress</span>;
      case 'Rejected':
        return <span className="badge badge-missing" style={{ fontSize: '0.75rem' }}>Not Selected</span>;
      default:
        return <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>Under Review</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: tokens.colors.primaryIce, color: tokens.colors.primaryRoyal, padding: '0.35rem 0.8rem', borderRadius: tokens.radii.full, fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <BookmarkCheck size={14} />
            Applicant Tracking System
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: tokens.colors.primaryNavy }}>
            {user?.role === 'recruiter' ? 'All Received Applications' : 'My Job Applications'}
          </h1>
          <p style={{ fontSize: '0.9rem', color: tokens.colors.textMuted }}>
            Real-time pipeline tracking, match scores, and interview invites.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('jobSearch')}
          className="btn btn-primary"
          style={{ fontSize: '0.825rem' }}
        >
          Explore More Openings
        </button>
      </div>

      {/* Stage Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderBottom: `1px solid ${tokens.colors.surfaceBorder}`, paddingBottom: '0.75rem' }}>
        {['All', ...STAGE_ORDER].map(stage => {
          const count = stage === 'All' ? applications.length : applications.filter(a => a.stage === stage).length;
          return (
            <button
              key={stage}
              onClick={() => setFilterStage(stage)}
              className="btn"
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                borderRadius: tokens.radii.md,
                background: filterStage === stage ? tokens.colors.primaryRoyal : 'transparent',
                color: filterStage === stage ? '#ffffff' : tokens.colors.textMuted,
                fontWeight: filterStage === stage ? 700 : 500
              }}
            >
              {stage} ({count})
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: tokens.colors.primaryIce,
            color: tokens.colors.primaryRoyal,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <BookmarkCheck size={28} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.5rem' }}>
            No applications in this stage
          </h3>
          <p style={{ fontSize: '0.85rem', color: tokens.colors.textMuted, marginBottom: '1.5rem' }}>
            Browse open engineering and AI positions to submit your resume.
          </p>
          <button
            onClick={() => setCurrentPage('jobSearch')}
            className="btn btn-primary"
          >
            Find Positions
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredApps.map(app => {
            // Check if there is an interview scheduled for this application
            const interview = interviews.find(i => i.applicationId === app.id || i.candidateName === app.candidateName);

            return (
              <div key={app.id} className="glass-card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: tokens.colors.primaryNavy }}>
                        {app.jobTitle}
                      </h3>
                      {getStageBadge(app.stage)}
                    </div>
                    <p style={{ fontSize: '0.825rem', color: tokens.colors.textMuted }}>
                      Candidate: <strong>{app.candidateName}</strong> ({app.candidateEmail}) • Applied on {app.appliedDate}
                    </p>
                  </div>

                  {/* Circular Match Gauge */}
                  <div style={{ textAlign: 'center', minWidth: '80px' }}>
                    <div className={`score-circle ${app.overallMatchScore >= 85 ? 'score-high' : 'score-mid'}`} style={{ width: '56px', height: '56px', fontSize: '1.1rem', margin: '0 auto' }}>
                      {app.overallMatchScore}%
                    </div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, display: 'block', marginTop: '0.25rem', color: tokens.colors.primaryRoyal }}>
                      Match Score
                    </span>
                  </div>
                </div>

                {/* Pipeline Step Progress Visualizer */}
                <div style={{ margin: '1.25rem 0', background: tokens.colors.surfaceSubtle, padding: '1rem', borderRadius: tokens.radii.md }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.65rem' }}>
                    Hiring Stage Progress:
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                    {STAGE_ORDER.slice(0, 5).map((stageName, idx) => {
                      const currentStageIdx = STAGE_ORDER.indexOf(app.stage);
                      const isCompleted = currentStageIdx >= idx;
                      const isCurrent = app.stage === stageName;

                      return (
                        <div key={stageName} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: isCompleted ? tokens.colors.primaryRoyal : '#ffffff',
                            border: `2px solid ${isCompleted ? tokens.colors.primaryRoyal : tokens.colors.surfaceBorder}`,
                            color: isCompleted ? '#ffffff' : tokens.colors.textDim,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}>
                            {isCompleted ? '✓' : idx + 1}
                          </div>
                          <span style={{ fontSize: '0.7rem', fontWeight: isCurrent ? 800 : 500, color: isCurrent ? tokens.colors.primaryRoyal : tokens.colors.textMuted, marginTop: '0.35rem' }}>
                            {stageName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* If Interview is Scheduled, show call invite card */}
                {interview && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: tokens.colors.primaryIce,
                    border: `1.5px solid ${tokens.colors.primaryIceBorder}`,
                    padding: '1rem 1.25rem',
                    borderRadius: tokens.radii.md,
                    marginTop: '1rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: tokens.radii.sm,
                        background: tokens.colors.primaryRoyal,
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Video size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: tokens.colors.primaryNavy }}>
                          {interview.type} Scheduled
                        </div>
                        <div style={{ fontSize: '0.785rem', color: tokens.colors.textMuted }}>
                          Interviewer: <strong>{interview.interviewer}</strong> • {interview.date} at {interview.time} ({interview.durationMinutes} min)
                        </div>
                      </div>
                    </div>

                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                      style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
                    >
                      <Video size={14} />
                      Join {interview.mode}
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
