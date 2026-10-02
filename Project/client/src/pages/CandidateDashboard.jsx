import React from 'react';
import { 
  Sparkles, 
  FileText, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  Award,
  Layers,
  MapPin,
  DollarSign
} from 'lucide-react';
import tokens from '../tokens';

export default function CandidateDashboard({
  user,
  candidateProfile,
  jobMatches = [],
  applications = [],
  setCurrentPage,
  onOpenExplainMatch
}) {
  const highMatches = jobMatches.filter(m => m.matchReport?.overallMatchScore >= 80);
  const scheduledInterviews = applications.filter(a => a.stage === 'Interview');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Hero Banner with Blue Gradient */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0ea5e9 100%)',
        borderRadius: tokens.radii.xl,
        padding: '2.5rem',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: tokens.shadows.lg
      }}>
        {/* Decorative Circle Mesh */}
        <div style={{
          position: 'absolute',
          right: '-50px',
          top: '-50px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.10)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '680px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.20)', backdropFilter: 'blur(8px)', padding: '0.35rem 0.85rem', borderRadius: tokens.radii.full, fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem' }}>
            <Sparkles size={14} />
            AI Precision Career Intelligence
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.2, color: '#ffffff', marginBottom: '0.75rem' }}>
            Hello, {user?.name || 'Candidate'}!
          </h1>
          <p style={{ fontSize: '1rem', opacity: 0.92, lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Our Explainable NLP engine parsed your technical background and matched you to <strong style={{ textDecoration: 'underline' }}>{jobMatches.length} active positions</strong> with transparent skill overlap and gap insights.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCurrentPage('jobSearch')}
              className="btn"
              style={{
                background: '#ffffff',
                color: tokens.colors.primaryNavy,
                padding: '0.7rem 1.4rem',
                fontWeight: 700,
                boxShadow: tokens.shadows.md
              }}
            >
              <Briefcase size={16} color={tokens.colors.primaryRoyal} />
              Explore All Jobs
            </button>
            <button
              onClick={() => setCurrentPage('resumeUpload')}
              className="btn"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                padding: '0.7rem 1.4rem',
                backdropFilter: 'blur(8px)'
              }}
            >
              <FileText size={16} />
              {candidateProfile ? 'Update Resume' : 'Upload Resume for Instant Score'}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Stat 1 */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: tokens.radii.md,
            background: tokens.colors.primaryIce,
            color: tokens.colors.primaryRoyal,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: tokens.colors.primaryNavy }}>
              {highMatches.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: tokens.colors.textMuted, fontWeight: 500 }}>
              Top Matches (&ge;80%)
            </div>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: tokens.radii.md,
            background: tokens.colors.successBg,
            color: tokens.colors.successEmerald,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: tokens.colors.primaryNavy }}>
              {candidateProfile?.skills?.length || 12}
            </div>
            <div style={{ fontSize: '0.8rem', color: tokens.colors.textMuted, fontWeight: 500 }}>
              Extracted Skills
            </div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: tokens.radii.md,
            background: '#eff6ff',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Layers size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: tokens.colors.primaryNavy }}>
              {applications.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: tokens.colors.textMuted, fontWeight: 500 }}>
              Submitted Applications
            </div>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: tokens.radii.md,
            background: '#faf5ff',
            color: '#7c3aed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: tokens.colors.primaryNavy }}>
              {scheduledInterviews.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: tokens.colors.textMuted, fontWeight: 500 }}>
              Interviews Scheduled
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Recommended Jobs with Explainable Match on Left, Resume Highlights on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left: Top Recommended Matches */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: tokens.colors.primaryNavy }}>
                Top Matched Positions
              </h2>
              <p style={{ fontSize: '0.85rem', color: tokens.colors.textMuted }}>
                Ranked by multi-factor explainable skill & experience compatibility
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('jobSearch')}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
            >
              View All ({jobMatches.length})
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {jobMatches.slice(0, 4).map(({ job, matchReport }) => {
              const score = matchReport?.overallMatchScore || 75;
              return (
                <div key={job.id} className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: tokens.colors.primaryNavy }}>
                          {job.title}
                        </h3>
                        <span className="badge badge-primary">{job.department}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: tokens.colors.textMuted, fontSize: '0.825rem', marginBottom: '0.85rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <MapPin size={14} color={tokens.colors.primaryRoyal} />
                          {job.location}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <DollarSign size={14} color={tokens.colors.successEmerald} />
                          {job.salaryRange}
                        </span>
                        <span>Min. {job.minExperience} yrs exp</span>
                      </div>

                      {/* Matched vs Missing Skills Preview */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: tokens.colors.successEmerald }}>
                            Matched Skills ({matchReport?.skills?.allMatched?.length || 0}):
                          </span>
                          {(matchReport?.skills?.allMatched || []).slice(0, 4).map(skill => (
                            <span key={skill} className="badge badge-matched" style={{ fontSize: '0.7rem' }}>
                              ✓ {skill}
                            </span>
                          ))}
                        </div>

                        {matchReport?.skills?.allMissing?.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: tokens.colors.dangerCrimson }}>
                              Skill Gap ({matchReport?.skills?.allMissing?.length}):
                            </span>
                            {matchReport.skills.allMissing.slice(0, 3).map(skill => (
                              <span key={skill} className="badge badge-missing" style={{ fontSize: '0.7rem' }}>
                                ✕ {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Circular Score Gauge */}
                    <div style={{ textAlign: 'center', minWidth: '90px' }}>
                      <div className={`score-circle ${score >= 85 ? 'score-high' : score >= 70 ? 'score-mid' : 'score-low'}`} style={{ width: '64px', height: '64px', fontSize: '1.2rem', margin: '0 auto' }}>
                        {score}%
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, display: 'block', marginTop: '0.35rem', color: score >= 85 ? tokens.colors.successEmerald : tokens.colors.primaryRoyal }}>
                        {matchReport?.suitabilityBadge || 'Matched'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: `1px solid ${tokens.colors.surfaceBorder}`, paddingTop: '1rem', marginTop: '0.5rem' }}>
                    <button
                      onClick={() => onOpenExplainMatch(job, matchReport)}
                      className="btn btn-outline-primary"
                      style={{ padding: '0.45rem 0.95rem', fontSize: '0.8rem' }}
                    >
                      <Sparkles size={14} />
                      Explain Match Breakdown
                    </button>
                    <button
                      onClick={() => onOpenExplainMatch(job, matchReport)}
                      className="btn btn-primary"
                      style={{ padding: '0.45rem 1.1rem', fontSize: '0.8rem' }}
                    >
                      Apply for Job
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Parsed Resume Card & Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Active Profile Snapshot */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: tokens.radii.md,
                background: tokens.colors.primaryIce,
                color: tokens.colors.primaryRoyal,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800
              }}>
                <FileText size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: tokens.colors.primaryNavy }}>
                  {candidateProfile?.name || user?.name || 'Your Profile'}
                </h3>
                <p style={{ fontSize: '0.75rem', color: tokens.colors.textMuted }}>
                  {candidateProfile?.experienceYears || 4} Years Experience Detected
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.825rem', color: tokens.colors.textMuted, lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {candidateProfile?.summary || 'Experienced software professional with demonstrated technical proficiency in modern systems architecture.'}
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.5rem' }}>
                Key Extracted Skills:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {(candidateProfile?.skills || ['react', 'node.js', 'typescript', 'mongodb', 'docker', 'aws', 'rest api', 'tailwind css']).slice(0, 8).map(skill => (
                  <span key={skill} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setCurrentPage('resumeUpload')}
              className="btn btn-secondary"
              style={{ width: '100%', fontSize: '0.825rem', padding: '0.6rem' }}
            >
              <FileText size={15} color={tokens.colors.primaryRoyal} />
              Re-parse / Upload New Resume
            </button>
          </div>

          {/* AI Career Advice Card */}
          <div className="glass-card" style={{
            padding: '1.75rem',
            background: 'linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)',
            border: `1px solid ${tokens.colors.primaryIceBorder}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <Sparkles size={18} color={tokens.colors.primaryRoyal} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: tokens.colors.primaryDeep }}>
                Match Optimization Advice
              </h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: tokens.colors.textMuted, lineHeight: 1.6 }}>
              Companies are currently prioritizing candidates with <strong>Kubernetes</strong> and <strong>CI/CD pipeline automation</strong>. Highlighting container orchestration on your resume could boost your overall match score by up to <strong>+18%</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
