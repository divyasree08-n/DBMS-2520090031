import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Award, 
  Calendar, 
  TrendingUp, 
  Plus, 
  BarChart3, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Search,
  Check,
  Video
} from 'lucide-react';
import tokens from '../tokens';

export default function RecruiterDashboard({
  jobs = [],
  applications = [],
  interviews = [],
  setCurrentPage,
  onOpenNewJobModal,
  onOpenScheduleModal,
  apiBaseUrl
}) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch live recruiter analytics from Express backend
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/analytics`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setAnalyticsData(json.data);
        }
      })
      .catch(err => console.error('Failed to load analytics:', err))
      .finally(() => setLoading(false));
  }, [apiBaseUrl, applications.length, jobs.length]);

  const highMatches = applications.filter(a => a.overallMatchScore >= 80);
  const activeInterviews = interviews.filter(i => i.status === 'Scheduled');
  const avgMatch = Math.round(
    applications.reduce((acc, a) => acc + (a.overallMatchScore || 0), 0) / (applications.length || 1)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Recruiter Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)',
        borderRadius: tokens.radii.xl,
        padding: '2.5rem',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: tokens.shadows.lg
      }}>
        <div style={{ maxWidth: '680px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '0.35rem 0.85rem', borderRadius: tokens.radii.full, fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem' }}>
            <Building2 size={14} />
            Hiring Intelligence & Talent Screening Suite
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
            Recruiter Analytics & ATS Center
          </h1>
          <p style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Screen applicants with explainable skill overlap matching, manage your ATS Kanban pipeline, and schedule multi-round interviews with automated meeting links.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={onOpenNewJobModal}
              className="btn"
              style={{
                background: '#ffffff',
                color: tokens.colors.primaryNavy,
                padding: '0.7rem 1.4rem',
                fontWeight: 700,
                boxShadow: tokens.shadows.md
              }}
            >
              <Plus size={16} color={tokens.colors.primaryRoyal} />
              Post New Opening
            </button>
            <button
              onClick={() => setCurrentPage('atsBoard')}
              className="btn"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                padding: '0.7rem 1.4rem',
                backdropFilter: 'blur(8px)'
              }}
            >
              <Layers size={16} />
              Open ATS Kanban Board
            </button>
          </div>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem'
      }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: tokens.radii.sm, background: tokens.colors.primaryIce, color: tokens.colors.primaryRoyal, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={20} />
            </div>
            <span style={{ fontSize: '0.8rem', color: tokens.colors.textMuted, fontWeight: 600 }}>Active Jobs</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: tokens.colors.primaryNavy }}>{jobs.length}</div>
          <span style={{ fontSize: '0.75rem', color: tokens.colors.successEmerald, fontWeight: 600 }}>100% Accepting Resumes</span>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: tokens.radii.sm, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
            <span style={{ fontSize: '0.8rem', color: tokens.colors.textMuted, fontWeight: 600 }}>Total Applicants</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: tokens.colors.primaryNavy }}>{applications.length}</div>
          <span style={{ fontSize: '0.75rem', color: tokens.colors.textMuted }}>Across all requisitions</span>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: tokens.radii.sm, background: tokens.colors.successBg, color: tokens.colors.successEmerald, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} />
            </div>
            <span style={{ fontSize: '0.8rem', color: tokens.colors.textMuted, fontWeight: 600 }}>High Matches (&ge;80%)</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: tokens.colors.successEmerald }}>{highMatches.length}</div>
          <span style={{ fontSize: '0.75rem', color: tokens.colors.textMuted }}>Top tier candidates</span>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: tokens.radii.sm, background: '#faf5ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} />
            </div>
            <span style={{ fontSize: '0.8rem', color: tokens.colors.textMuted, fontWeight: 600 }}>Scheduled Rounds</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#7c3aed' }}>{activeInterviews.length}</div>
          <span style={{ fontSize: '0.75rem', color: tokens.colors.textMuted }}>Upcoming interview calls</span>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: tokens.radii.sm, background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} />
            </div>
            <span style={{ fontSize: '0.8rem', color: tokens.colors.textMuted, fontWeight: 600 }}>Avg Match Score</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: tokens.colors.primaryRoyal }}>{avgMatch}%</div>
          <span style={{ fontSize: '0.75rem', color: tokens.colors.textMuted }}>NLP compatibility index</span>
        </div>
      </div>

      {/* Recruiter Visual Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Chart 1: Most In-Demand Skills */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <BarChart3 size={18} color={tokens.colors.primaryRoyal} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: tokens.colors.primaryNavy }}>
              Most In-Demand Technical Skills
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {(analyticsData?.topInDemandSkills || [
              { skill: 'react', count: 4 },
              { skill: 'node.js', count: 3 },
              { skill: 'docker', count: 3 },
              { skill: 'typescript', count: 3 },
              { skill: 'aws', count: 2 },
              { skill: 'kubernetes', count: 2 },
              { skill: 'python', count: 2 },
              { skill: 'mongodb', count: 2 }
            ]).map(item => {
              const maxCount = 4;
              const pct = (item.count / maxCount) * 100;
              return (
                <div key={item.skill}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 600, textTransform: 'capitalize', color: tokens.colors.primaryNavy }}>
                      {item.skill}
                    </span>
                    <span style={{ fontWeight: 700, color: tokens.colors.primaryRoyal }}>
                      {item.count} Active Job Requirements
                    </span>
                  </div>
                  <div style={{ height: '8px', background: tokens.colors.surfaceSubtle, borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #2563eb, #0ea5e9)', borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Match Score Distribution */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Award size={18} color={tokens.colors.primaryRoyal} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: tokens.colors.primaryNavy }}>
              Candidate Match Score Distribution
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { label: 'Top Tier (90-100%)', count: 3, color: '#059669', desc: 'Instant shortlist candidates' },
              { label: 'Strong Fit (75-89%)', count: 2, color: '#2563eb', desc: 'Minor skill gaps to verify' },
              { label: 'Moderate Fit (50-74%)', count: 1, color: '#d97706', desc: 'Foundational baseline' },
              { label: 'Low Match (<50%)', count: 0, color: '#e11d48', desc: 'Divergent qualification' }
            ].map(bucket => (
              <div key={bucket.label} style={{ background: tokens.colors.surfaceSubtle, padding: '1rem', borderRadius: tokens.radii.md }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: bucket.color }} />
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: tokens.colors.primaryNavy }}>
                      {bucket.label}
                    </span>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: bucket.color }}>
                    {bucket.count}
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: tokens.colors.textMuted }}>{bucket.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Table: Recent Candidate Applications with 1-Click Interview Scheduling */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: tokens.colors.primaryNavy }}>
              Candidate Screening & Decision Board
            </h3>
            <p style={{ fontSize: '0.85rem', color: tokens.colors.textMuted }}>
              Ranked applicants with transparent skill scores and quick scheduler
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('atsBoard')}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.95rem' }}
          >
            Full ATS Kanban View
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${tokens.colors.surfaceBorder}`, color: tokens.colors.textMuted, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Candidate</th>
                <th style={{ padding: '0.85rem 1rem' }}>Position</th>
                <th style={{ padding: '0.85rem 1rem' }}>Match Score</th>
                <th style={{ padding: '0.85rem 1rem' }}>Current Stage</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id} style={{ borderBottom: `1px solid ${tokens.colors.surfaceBorder}`, fontSize: '0.875rem' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 700, color: tokens.colors.primaryNavy }}>{app.candidateName}</div>
                    <div style={{ fontSize: '0.775rem', color: tokens.colors.textMuted }}>{app.candidateEmail}</div>
                  </td>

                  <td style={{ padding: '1rem', color: tokens.colors.primaryNavy, fontWeight: 600 }}>
                    {app.jobTitle}
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`badge ${app.overallMatchScore >= 85 ? 'badge-matched' : 'badge-primary'}`} style={{ fontWeight: 800 }}>
                        {app.overallMatchScore}% Match
                      </span>
                    </div>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-neutral">{app.stage}</span>
                  </td>

                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => onOpenScheduleModal(app)}
                      className="btn btn-primary"
                      style={{ fontSize: '0.775rem', padding: '0.4rem 0.85rem' }}
                    >
                      <Video size={13} />
                      Schedule Interview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
