import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Filter, 
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Check
} from 'lucide-react';
import tokens from '../tokens';

export default function JobSearch({
  jobs = [],
  jobMatches = [],
  candidateProfile,
  onApplyJob,
  appliedJobIds = new Set(),
  setCurrentPage
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [selectedMatchReport, setSelectedMatchReport] = useState(null);

  // Departments list for filter
  const departments = ['All', ...new Set(jobs.map(j => j.department).filter(Boolean))];
  const types = ['All', 'Full-time', 'Contract', 'Part-time'];

  // Map job ID to its match report for quick lookup
  const matchMap = new Map();
  jobMatches.forEach(m => {
    if (m.job?.id && m.matchReport) {
      matchMap.set(m.job.id, m.matchReport);
    }
  });

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesQuery = !searchQuery || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = selectedDept === 'All' || job.department === selectedDept;
    const matchesType = selectedType === 'All' || job.type === selectedType;

    return matchesQuery && matchesDept && matchesType;
  });

  const openExplainModal = (job) => {
    const report = matchMap.get(job.id) || {
      overallMatchScore: 78,
      suitabilityBadge: 'Recommended',
      breakdown: { skillScore: 80, experienceScore: 100, educationScore: 90, semanticScore: 75 },
      skills: {
        allMatched: job.requiredSkills.slice(0, 3),
        allMissing: job.requiredSkills.slice(3)
      },
      experienceComparison: {
        candidateYears: candidateProfile?.experienceYears || 4,
        requiredYears: job.minExperience,
        gap: 0,
        status: 'Meets minimum requirement'
      },
      candidateTips: [
        'Demonstrate hands-on experience in missing skills during technical interview rounds.'
      ],
      hiringRecommendation: 'Recommended for Screening'
    };
    setSelectedJobForModal(job);
    setSelectedMatchReport(report);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: tokens.colors.primaryIce, color: tokens.colors.primaryRoyal, padding: '0.35rem 0.8rem', borderRadius: tokens.radii.full, fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          <Sparkles size={14} />
          Elasticsearch & Vector Match Finder
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: tokens.colors.primaryNavy, marginBottom: '0.5rem' }}>
          Explore Job Positions
        </h1>
        <p style={{ fontSize: '0.95rem', color: tokens.colors.textMuted }}>
          Every job displays your personalized <strong>Explainable Match Score</strong> based on resume skill similarity and experience alignment.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Keyword Input */}
          <div style={{ flex: 2, minWidth: '260px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by job title, skill (e.g. React, Python), or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: tokens.radii.md,
                border: `1px solid ${tokens.colors.surfaceBorder}`,
                fontSize: '0.875rem'
              }}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: tokens.colors.textDim }} />
          </div>

          {/* Department Filter */}
          <div style={{ minWidth: '170px' }}>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: tokens.radii.md,
                border: `1px solid ${tokens.colors.surfaceBorder}`,
                fontSize: '0.875rem',
                background: '#ffffff',
                cursor: 'pointer'
              }}
            >
              {departments.map(d => (
                <option key={d} value={d}>Dept: {d}</option>
              ))}
            </select>
          </div>

          {/* Job Type Filter */}
          <div style={{ minWidth: '150px' }}>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: tokens.radii.md,
                border: `1px solid ${tokens.colors.surfaceBorder}`,
                fontSize: '0.875rem',
                background: '#ffffff',
                cursor: 'pointer'
              }}
            >
              {types.map(t => (
                <option key={t} value={t}>Type: {t}</option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: '0.825rem', color: tokens.colors.textMuted, fontWeight: 600 }}>
            Found: <span style={{ color: tokens.colors.primaryRoyal }}>{filteredJobs.length}</span> positions
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
        {filteredJobs.map(job => {
          const matchReport = matchMap.get(job.id);
          const score = matchReport ? matchReport.overallMatchScore : 82;
          const isApplied = appliedJobIds.has(job.id);

          return (
            <div key={job.id} className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Header with Title & Circular Match Gauge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
                      {job.department}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: tokens.colors.primaryNavy, lineHeight: 1.3 }}>
                      {job.title}
                    </h3>
                  </div>

                  <div style={{ textAlign: 'center', minWidth: '60px' }}>
                    <div className={`score-circle ${score >= 85 ? 'score-high' : score >= 70 ? 'score-mid' : 'score-low'}`} style={{ width: '56px', height: '56px', fontSize: '1.05rem' }}>
                      {score}%
                    </div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, display: 'block', marginTop: '0.25rem', color: score >= 85 ? tokens.colors.successEmerald : tokens.colors.primaryRoyal }}>
                      Match
                    </span>
                  </div>
                </div>

                {/* Job Metadata */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', color: tokens.colors.textMuted, fontSize: '0.8rem', marginBottom: '1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={14} color={tokens.colors.primaryRoyal} />
                    {job.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <DollarSign size={14} color={tokens.colors.successEmerald} />
                    {job.salaryRange}
                  </span>
                  <span>Min. {job.minExperience} yrs</span>
                </div>

                {/* Brief description */}
                <p style={{ fontSize: '0.825rem', color: tokens.colors.textMuted, lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {job.description.slice(0, 130)}...
                </p>

                {/* Required Skills Chips */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.45rem' }}>
                    Required Technical Skills:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {job.requiredSkills.map(skill => {
                      const isMatched = matchReport?.skills?.allMatched?.some(s => s.toLowerCase() === skill.toLowerCase());
                      return (
                        <span 
                          key={skill} 
                          className={isMatched ? 'badge badge-matched' : 'badge badge-neutral'}
                          style={{ fontSize: '0.7rem' }}
                        >
                          {isMatched ? '✓ ' : ''}{skill}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', borderTop: `1px solid ${tokens.colors.surfaceBorder}`, paddingTop: '1rem' }}>
                <button
                  onClick={() => openExplainModal(job)}
                  className="btn btn-outline-primary"
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}
                >
                  <Sparkles size={14} />
                  Explain Match
                </button>

                <button
                  onClick={() => onApplyJob(job, matchReport)}
                  disabled={isApplied}
                  className="btn btn-primary"
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    fontSize: '0.8rem',
                    background: isApplied ? tokens.colors.successEmerald : undefined
                  }}
                >
                  {isApplied ? (
                    <>
                      <Check size={14} />
                      Applied
                    </>
                  ) : (
                    'Apply Now'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* EXPLAINABLE MATCH MODAL */}
      {selectedJobForModal && selectedMatchReport && (
        <div className="modal-overlay" onClick={() => setSelectedJobForModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px', padding: '2.25rem' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `1px solid ${tokens.colors.surfaceBorder}`, paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-primary">{selectedJobForModal.department}</span>
                  <span className="badge badge-neutral">{selectedJobForModal.type}</span>
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: tokens.colors.primaryNavy }}>
                  {selectedJobForModal.title}
                </h2>
                <p style={{ fontSize: '0.85rem', color: tokens.colors.textMuted }}>
                  Explainable Candidate-Job Match Diagnostic Breakdown
                </p>
              </div>

              {/* Big Score Gauge */}
              <div style={{ textAlign: 'center' }}>
                <div className={`score-circle ${selectedMatchReport.overallMatchScore >= 85 ? 'score-high' : 'score-mid'}`} style={{ width: '70px', height: '70px', fontSize: '1.35rem', margin: '0 auto' }}>
                  {selectedMatchReport.overallMatchScore}%
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginTop: '0.35rem', color: tokens.colors.primaryRoyal }}>
                  {selectedMatchReport.suitabilityBadge || 'Strong Fit'}
                </span>
              </div>
            </div>

            {/* Factor Breakdown Bars */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.75rem' }}>
                Match Contribution Breakdown:
              </h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem', fontWeight: 600 }}>
                    <span>Technical Skill Overlap (Weight: 55%)</span>
                    <span>{selectedMatchReport.breakdown?.skillScore || 85}%</span>
                  </div>
                  <div style={{ height: '8px', background: tokens.colors.surfaceSubtle, borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${selectedMatchReport.breakdown?.skillScore || 85}%`, height: '100%', background: 'linear-gradient(90deg, #2563eb, #0ea5e9)', borderRadius: '4px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem', fontWeight: 600 }}>
                    <span>Experience Seniority (Weight: 25%)</span>
                    <span>{selectedMatchReport.breakdown?.experienceScore || 100}%</span>
                  </div>
                  <div style={{ height: '8px', background: tokens.colors.surfaceSubtle, borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${selectedMatchReport.breakdown?.experienceScore || 100}%`, height: '100%', background: 'linear-gradient(90deg, #059669, #10b981)', borderRadius: '4px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem', fontWeight: 600 }}>
                    <span>Education Credentials (Weight: 10%)</span>
                    <span>{selectedMatchReport.breakdown?.educationScore || 90}%</span>
                  </div>
                  <div style={{ height: '8px', background: tokens.colors.surfaceSubtle, borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${selectedMatchReport.breakdown?.educationScore || 90}%`, height: '100%', background: 'linear-gradient(90deg, #7c3aed, #a855f7)', borderRadius: '4px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem', fontWeight: 600 }}>
                    <span>Contextual Semantic Fit (Weight: 10%)</span>
                    <span>{selectedMatchReport.breakdown?.semanticScore || 80}%</span>
                  </div>
                  <div style={{ height: '8px', background: tokens.colors.surfaceSubtle, borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${selectedMatchReport.breakdown?.semanticScore || 80}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #fbbf24)', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Matched Skills vs Missing Skills (The Abstract Feature!) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.75rem' }}>
              {/* Matched Skills */}
              <div style={{ background: tokens.colors.successBg, border: `1px solid ${tokens.colors.successBorder}`, borderRadius: tokens.radii.md, padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: tokens.colors.successEmerald, fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.65rem' }}>
                  <CheckCircle2 size={16} />
                  Matched Skills ({selectedMatchReport.skills?.allMatched?.length || 0})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {(selectedMatchReport.skills?.allMatched || []).map(skill => (
                    <span key={skill} className="badge badge-matched" style={{ fontSize: '0.75rem' }}>
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div style={{ background: tokens.colors.dangerBg, border: `1px solid ${tokens.colors.dangerBorder}`, borderRadius: tokens.radii.md, padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: tokens.colors.dangerCrimson, fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.65rem' }}>
                  <XCircle size={16} />
                  Skill Gap / Missing ({selectedMatchReport.skills?.allMissing?.length || 0})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {(selectedMatchReport.skills?.allMissing || []).length > 0 ? (
                    selectedMatchReport.skills.allMissing.map(skill => (
                      <span key={skill} className="badge badge-missing" style={{ fontSize: '0.75rem' }}>
                        ✕ {skill}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: tokens.colors.successEmerald, fontWeight: 600 }}>
                      No missing skills! Candidate satisfies 100% of required competencies.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Recruiter Recommendation Verdict */}
            <div style={{ background: tokens.colors.primaryIce, border: `1px solid ${tokens.colors.primaryIceBorder}`, borderRadius: tokens.radii.md, padding: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: tokens.colors.primaryRoyal, fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <Sparkles size={16} />
                AI Hiring Verdict & Candidate Recommendations
              </div>
              <p style={{ fontSize: '0.825rem', color: tokens.colors.textMain, lineHeight: 1.6 }}>
                {selectedMatchReport.hiringRecommendation || 'Recommended for screening.'}
              </p>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setSelectedJobForModal(null)}
                className="btn btn-secondary"
              >
                Close
              </button>

              <button
                onClick={() => {
                  onApplyJob(selectedJobForModal, selectedMatchReport);
                  setSelectedJobForModal(null);
                }}
                disabled={appliedJobIds.has(selectedJobForModal.id)}
                className="btn btn-primary"
                style={{ padding: '0.6rem 1.5rem' }}
              >
                {appliedJobIds.has(selectedJobForModal.id) ? 'Applied' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
