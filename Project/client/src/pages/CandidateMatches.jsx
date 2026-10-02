import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Award, 
  Briefcase, 
  MapPin, 
  Calendar,
  User,
  Building2,
  Mail,
  Phone,
  GraduationCap,
  Layers,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  Check
} from 'lucide-react';
import tokens from '../tokens';
import { calculateExplainableMatch } from '../services/clientMatcher';

// Pre-seeded candidates for recruiter evaluations
const DEFAULT_CANDIDATES = [
  {
    id: 'cand-1',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 91234 56789',
    summary: 'Versatile Full Stack Engineer with 5 years building scalable web apps with React, Node.js, TypeScript, and AWS.',
    experienceYears: 5,
    education: ['Bachelor of Technology in Computer Science, IIT Hyderabad'],
    skills: ['react', 'node.js', 'typescript', 'javascript', 'mongodb', 'docker', 'aws', 'rest api', 'tailwind css', 'git', 'ci/cd', 'redux']
  },
  {
    id: 'cand-2',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    phone: '+91 98765 43210',
    summary: 'Machine Learning & NLP Specialist with 3.5 years developing deep learning models, sentiment analysis, NER tokenizers, and fast Python APIs with spaCy, PyTorch, and FastAPI.',
    experienceYears: 3.5,
    education: ['Master of Technology in Artificial Intelligence, IIT Bombay'],
    skills: ['python', 'spacy', 'nlp', 'machine learning', 'pytorch', 'fastapi', 'scikit-learn', 'pandas', 'docker', 'transformers']
  },
  {
    id: 'cand-3',
    name: 'Arun Kumar',
    email: 'arun.kumar@example.com',
    phone: '+91 87654 32109',
    summary: 'DevOps & Cloud Engineer specializing in AWS multi-region infrastructure, Kubernetes cluster deployments, Terraform IaC, and zero-downtime CI/CD release pipelines.',
    experienceYears: 4,
    education: ['Bachelor of Engineering in IT, Osmania University'],
    skills: ['aws', 'kubernetes', 'docker', 'terraform', 'ci/cd', 'linux', 'bash', 'prometheus', 'grafana', 'python', 'git']
  },
  {
    id: 'cand-4',
    name: 'Varnika Komali',
    email: 'varnikakomali@gmail.com',
    phone: '+91 98765 43210',
    summary: 'Software professional with technical expertise in modern frontend and backend development with React and JavaScript.',
    experienceYears: 4,
    education: ['Bachelor of Science in Computer Science'],
    skills: ['react', 'node.js', 'typescript', 'javascript', 'mongodb', 'docker', 'rest api', 'tailwind css']
  }
];

export default function CandidateMatches({
  jobs = [],
  jobMatches = [],
  candidateProfile,
  onApplyJob,
  appliedJobIds = new Set(),
  setCurrentPage,
  user,
  onScheduleInterview
}) {
  const isRecruiter = user?.role === 'recruiter';

  // Recruiter state: Selected Job for which candidates are ranked
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || 'job-1');
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(0);

  // Candidate state: Selected Job match card
  const [selectedJobMatchIndex, setSelectedJobMatchIndex] = useState(0);

  // Keep selectedJobId valid if jobs change
  useEffect(() => {
    if (jobs.length > 0 && !jobs.some(j => j.id === selectedJobId)) {
      setSelectedJobId(jobs[0].id);
    }
  }, [jobs, selectedJobId]);

  // Active Job for Recruiter evaluation
  const activeJob = useMemo(() => {
    return jobs.find(j => j.id === selectedJobId) || jobs[0] || {
      id: 'job-1',
      title: 'Senior Full Stack Engineer',
      department: 'Engineering',
      requiredSkills: ['react', 'node.js', 'typescript'],
      preferredSkills: ['aws', 'docker'],
      minExperience: 3,
      salaryRange: '₹18,00,000 - ₹24,00,000 LPA',
      location: 'Hyderabad, India'
    };
  }, [jobs, selectedJobId]);

  // Recruiter: Candidate pool (seeded candidates + active candidate if available)
  const candidatePool = useMemo(() => {
    const list = [...DEFAULT_CANDIDATES];
    if (candidateProfile && candidateProfile.name && !list.some(c => c.email === candidateProfile.email)) {
      list.unshift({
        id: 'cand-current',
        ...candidateProfile
      });
    }
    return list;
  }, [candidateProfile]);

  // Recruiter: Compute REAL explainable matches for all candidates against activeJob
  const rankedCandidates = useMemo(() => {
    return candidatePool.map(cand => {
      const matchReport = calculateExplainableMatch(cand, activeJob);
      return {
        candidate: cand,
        matchReport
      };
    }).sort((a, b) => b.matchReport.overallMatchScore - a.matchReport.overallMatchScore);
  }, [candidatePool, activeJob]);

  // Candidate: Compute REAL explainable matches for active candidate against all jobs
  const candidateJobMatches = useMemo(() => {
    const profile = candidateProfile || {
      name: user?.name || 'Candidate',
      experienceYears: 4,
      education: ['Bachelor Degree in Computer Science'],
      skills: ['react', 'node.js', 'typescript', 'javascript', 'mongodb', 'docker', 'rest api', 'tailwind css']
    };

    return jobs.map(job => {
      const matchReport = calculateExplainableMatch(profile, job);
      return {
        job,
        matchReport
      };
    }).sort((a, b) => b.matchReport.overallMatchScore - a.matchReport.overallMatchScore);
  }, [jobs, candidateProfile, user]);

  // Active item in Recruiter view
  const activeCandidateItem = rankedCandidates[selectedCandidateIndex] || rankedCandidates[0];

  // Active item in Candidate view
  const activeJobItem = candidateJobMatches[selectedJobMatchIndex] || candidateJobMatches[0];

  // Helper for score color styling
  const getScoreClass = (score) => {
    if (score >= 85) return 'score-high';
    if (score >= 70) return 'score-mid';
    return 'score-low';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: tokens.colors.primaryIce, color: tokens.colors.primaryRoyal, padding: '0.35rem 0.8rem', borderRadius: tokens.radii.full, fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          <Sparkles size={14} />
          Multi-Factor Explainable Compatibility Matrix
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: tokens.colors.primaryNavy, marginBottom: '0.5rem' }}>
          {isRecruiter ? 'Ranked Candidate Matches' : 'My Explainable Job Matches'}
        </h1>
        <p style={{ fontSize: '0.95rem', color: tokens.colors.textMuted }}>
          {isRecruiter 
            ? 'Compare and rank all job applicants against your role specifications using NLP skill extraction and weighted scoring.'
            : 'Deep-dive analysis comparing your verified skills, experience, and credentials against available job opportunities.'
          }
        </p>
      </div>

      {/* ==================================================================== */}
      {/* RECRUITER VIEW: RANKED CANDIDATES FOR A SELECTED JOB                 */}
      {/* ==================================================================== */}
      {isRecruiter ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Job Selector Bar */}
          <div className="glass-card" style={{ padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Building2 size={20} color={tokens.colors.primaryRoyal} />
              <div>
                <span style={{ fontSize: '0.75rem', color: tokens.colors.textDim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Target Position for Ranking
                </span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: tokens.colors.primaryNavy }}>
                  {activeJob.title}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <label style={{ fontSize: '0.825rem', fontWeight: 600, color: tokens.colors.textMuted }}>
                Select Role:
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => {
                  setSelectedJobId(e.target.value);
                  setSelectedCandidateIndex(0);
                }}
                className="input-field"
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', minWidth: '260px' }}
              >
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({j.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Split View: Ranked Candidates List on Left, Diagnostic Inspector on Right */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.6fr', gap: '1.75rem', alignItems: 'start' }}>
            {/* Left Column: Ranked Candidates */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: tokens.colors.primaryNavy }}>
                  Ranked Applicants ({rankedCandidates.length})
                </h3>
                <span style={{ fontSize: '0.75rem', color: tokens.colors.textDim }}>
                  Sorted by Compatibility
                </span>
              </div>

              {rankedCandidates.map((item, idx) => {
                const isSelected = idx === selectedCandidateIndex;
                const score = item.matchReport?.overallMatchScore || 0;

                return (
                  <div
                    key={item.candidate.id || idx}
                    onClick={() => setSelectedCandidateIndex(idx)}
                    style={{
                      padding: '1.25rem',
                      borderRadius: tokens.radii.lg,
                      background: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                      border: isSelected ? `2px solid ${tokens.colors.primaryRoyal}` : `1px solid ${tokens.colors.surfaceBorder}`,
                      boxShadow: isSelected ? tokens.shadows.lg : tokens.shadows.sm,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ 
                          width: '24px', 
                          height: '24px', 
                          borderRadius: tokens.radii.full, 
                          background: idx === 0 ? '#fef3c7' : tokens.colors.surfaceSubtle, 
                          color: idx === 0 ? '#b45309' : tokens.colors.textMuted,
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          #{idx + 1}
                        </span>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: tokens.colors.primaryNavy }}>
                          {item.candidate.name}
                        </h4>
                      </div>
                      <p style={{ fontSize: '0.785rem', color: tokens.colors.textMuted, display: 'flex', gap: '0.75rem' }}>
                        <span>{item.candidate.experienceYears} Years Exp.</span>
                        <span>•</span>
                        <span>{item.matchReport.skills.matchedRequired.length} Core Skills Matched</span>
                      </p>
                    </div>

                    <div style={{ textAlign: 'center', minWidth: '60px' }}>
                      <div className={`score-circle ${getScoreClass(score)}`} style={{ width: '48px', height: '48px', fontSize: '0.95rem' }}>
                        {score}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Deep Diagnostic Inspector for Selected Candidate */}
            {activeCandidateItem && (
              <div className="glass-card" style={{ padding: '2rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `1px solid ${tokens.colors.surfaceBorder}`, paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: tokens.colors.primaryIce, color: tokens.colors.primaryRoyal, padding: '0.2rem 0.6rem', borderRadius: tokens.radii.full, fontSize: '0.7rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      <User size={12} />
                      Candidate #{selectedCandidateIndex + 1} for {activeJob.title}
                    </div>
                    <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: tokens.colors.primaryNavy }}>
                      {activeCandidateItem.candidate.name}
                    </h2>
                    <div style={{ display: 'flex', gap: '1rem', color: tokens.colors.textMuted, fontSize: '0.825rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Mail size={13} color={tokens.colors.primaryRoyal} />
                        {activeCandidateItem.candidate.email}
                      </span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Briefcase size={13} color={tokens.colors.primaryRoyal} />
                        {activeCandidateItem.candidate.experienceYears} Years Experience
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div className={`score-circle ${getScoreClass(activeCandidateItem.matchReport.overallMatchScore)}`} style={{ width: '68px', height: '68px', fontSize: '1.35rem', margin: '0 auto' }}>
                      {activeCandidateItem.matchReport.overallMatchScore}%
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginTop: '0.35rem', color: tokens.colors.primaryRoyal }}>
                      {activeCandidateItem.matchReport.suitabilityBadge}
                    </span>
                  </div>
                </div>

                {/* Weighted Breakdown */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.75rem' }}>
                    Explainable Score Weighting Breakdown:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 600 }}>Technical Skills Alignment (60% Weight)</span>
                        <span style={{ fontWeight: 700, color: tokens.colors.primaryRoyal }}>{activeCandidateItem.matchReport.breakdown.skillScore}%</span>
                      </div>
                      <div style={{ height: '7px', background: tokens.colors.surfaceSubtle, borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${activeCandidateItem.matchReport.breakdown.skillScore}%`, height: '100%', background: 'linear-gradient(90deg, #2563eb, #0ea5e9)' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 600 }}>Experience Seniority ({activeCandidateItem.candidate.experienceYears} yrs vs {activeJob.minExperience} yrs min) (25% Weight)</span>
                        <span style={{ fontWeight: 700, color: tokens.colors.successEmerald }}>{activeCandidateItem.matchReport.breakdown.experienceScore}%</span>
                      </div>
                      <div style={{ height: '7px', background: tokens.colors.surfaceSubtle, borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${activeCandidateItem.matchReport.breakdown.experienceScore}%`, height: '100%', background: 'linear-gradient(90deg, #059669, #10b981)' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 600 }}>Education Credentials (15% Weight)</span>
                        <span style={{ fontWeight: 700, color: '#7c3aed' }}>{activeCandidateItem.matchReport.breakdown.educationScore}%</span>
                      </div>
                      <div style={{ height: '7px', background: tokens.colors.surfaceSubtle, borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${activeCandidateItem.matchReport.breakdown.educationScore}%`, height: '100%', background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Matched vs Missing Skills */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
                  <div style={{ background: tokens.colors.successBg, border: `1px solid ${tokens.colors.successBorder}`, borderRadius: tokens.radii.md, padding: '1rem' }}>
                    <div style={{ color: tokens.colors.successEmerald, fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CheckCircle2 size={15} />
                      Matched Skills ({activeCandidateItem.matchReport.skills.allMatched.length})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {activeCandidateItem.matchReport.skills.allMatched.length > 0 ? (
                        activeCandidateItem.matchReport.skills.allMatched.map(skill => (
                          <span key={skill} className="badge badge-matched" style={{ fontSize: '0.7rem' }}>
                            ✓ {skill}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: tokens.colors.textDim }}>None matched</span>
                      )}
                    </div>
                  </div>

                  <div style={{ background: tokens.colors.dangerBg, border: `1px solid ${tokens.colors.dangerBorder}`, borderRadius: tokens.radii.md, padding: '1rem' }}>
                    <div style={{ color: tokens.colors.dangerCrimson, fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <XCircle size={15} />
                      Skill Gaps / Missing ({activeCandidateItem.matchReport.skills.allMissing.length})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {activeCandidateItem.matchReport.skills.allMissing.length > 0 ? (
                        activeCandidateItem.matchReport.skills.allMissing.map(skill => (
                          <span key={skill} className="badge badge-missing" style={{ fontSize: '0.7rem' }}>
                            ✕ {skill}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.7rem', color: tokens.colors.successEmerald, fontWeight: 600 }}>
                          ✓ All role skills fulfilled!
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Candidate Summary */}
                <div style={{ marginBottom: '1.5rem', background: tokens.colors.surfaceSubtle, padding: '1rem', borderRadius: tokens.radii.md }}>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.35rem' }}>
                    Candidate Background:
                  </h4>
                  <p style={{ fontSize: '0.825rem', color: tokens.colors.textMain, lineHeight: 1.6 }}>
                    {activeCandidateItem.candidate.summary}
                  </p>
                </div>

                {/* Diagnostic Verdict */}
                <div style={{ background: tokens.colors.primaryIce, border: `1px solid ${tokens.colors.primaryIceBorder}`, borderRadius: tokens.radii.md, padding: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ color: tokens.colors.primaryRoyal, fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Award size={16} />
                    AI Hiring Recommendation:
                  </div>
                  <p style={{ fontSize: '0.825rem', color: tokens.colors.textMain, lineHeight: 1.6 }}>
                    {activeCandidateItem.matchReport.hiringRecommendation}
                  </p>
                </div>

                {/* Action Controls */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button
                    onClick={() => {
                      if (onScheduleInterview) {
                        onScheduleInterview({
                          candidateName: activeCandidateItem.candidate.name,
                          jobTitle: activeJob.title,
                          applicationId: activeCandidateItem.candidate.id
                        });
                      } else {
                        setCurrentPage('atsBoard');
                      }
                    }}
                    className="btn btn-primary"
                    style={{ padding: '0.65rem 1.6rem' }}
                  >
                    <Calendar size={15} />
                    Schedule Interview
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ==================================================================== */
        /* CANDIDATE VIEW: MY EXPLAINABLE JOB MATCHES (ACCURATE PER-JOB SCORES) */
        /* ==================================================================== */
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.6fr', gap: '1.75rem', alignItems: 'start' }}>
          {/* Left Column: Ranked Jobs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.25rem' }}>
              Ranked Opportunities for You ({candidateJobMatches.length})
            </h3>

            {candidateJobMatches.map((item, idx) => {
              const isSelected = idx === selectedJobMatchIndex;
              const score = item.matchReport.overallMatchScore;

              return (
                <div
                  key={item.job?.id || idx}
                  onClick={() => setSelectedJobMatchIndex(idx)}
                  style={{
                    padding: '1.25rem',
                    borderRadius: tokens.radii.lg,
                    background: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.70)',
                    border: isSelected ? `2px solid ${tokens.colors.primaryRoyal}` : `1px solid ${tokens.colors.surfaceBorder}`,
                    boxShadow: isSelected ? tokens.shadows.lg : tokens.shadows.sm,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.65rem', marginBottom: '0.35rem' }}>
                      {item.job?.department}
                    </span>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: tokens.colors.primaryNavy }}>
                      {item.job?.title}
                    </h4>
                    <p style={{ fontSize: '0.785rem', color: tokens.colors.textMuted, marginTop: '0.2rem' }}>
                      {item.job?.location} • Min {item.job?.minExperience} yrs
                    </p>
                  </div>

                  <div style={{ textAlign: 'center', minWidth: '60px' }}>
                    <div className={`score-circle ${getScoreClass(score)}`} style={{ width: '48px', height: '48px', fontSize: '0.95rem' }}>
                      {score}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Deep Diagnostic Inspector for Candidate */}
          {activeJobItem && (
            <div className="glass-card" style={{ padding: '2rem' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `1px solid ${tokens.colors.surfaceBorder}`, paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
                    {activeJobItem.job?.department}
                  </span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: tokens.colors.primaryNavy }}>
                    {activeJobItem.job?.title}
                  </h2>
                  <div style={{ display: 'flex', gap: '1rem', color: tokens.colors.textMuted, fontSize: '0.825rem', marginTop: '0.35rem' }}>
                    <span>{activeJobItem.job?.location}</span>
                    <span>•</span>
                    <span>{activeJobItem.job?.salaryRange}</span>
                    <span>•</span>
                    <span>{activeJobItem.job?.type}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div className={`score-circle ${getScoreClass(activeJobItem.matchReport.overallMatchScore)}`} style={{ width: '68px', height: '68px', fontSize: '1.3rem', margin: '0 auto' }}>
                    {activeJobItem.matchReport.overallMatchScore}%
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginTop: '0.35rem', color: tokens.colors.primaryRoyal }}>
                    {activeJobItem.matchReport.suitabilityBadge}
                  </span>
                </div>
              </div>

              {/* Score Breakdown */}
              <div style={{ marginBottom: '1.75rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.75rem' }}>
                  Explainable Score Weighting Breakdown:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600 }}>Technical Skills Alignment (60% Weight)</span>
                      <span style={{ fontWeight: 700, color: tokens.colors.primaryRoyal }}>{activeJobItem.matchReport.breakdown.skillScore}%</span>
                    </div>
                    <div style={{ height: '7px', background: tokens.colors.surfaceSubtle, borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${activeJobItem.matchReport.breakdown.skillScore}%`, height: '100%', background: 'linear-gradient(90deg, #2563eb, #0ea5e9)' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600 }}>Experience Seniority & Tenure (25% Weight)</span>
                      <span style={{ fontWeight: 700, color: tokens.colors.successEmerald }}>{activeJobItem.matchReport.breakdown.experienceScore}%</span>
                    </div>
                    <div style={{ height: '7px', background: tokens.colors.surfaceSubtle, borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${activeJobItem.matchReport.breakdown.experienceScore}%`, height: '100%', background: 'linear-gradient(90deg, #059669, #10b981)' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600 }}>Education Credentials (15% Weight)</span>
                      <span style={{ fontWeight: 700, color: '#7c3aed' }}>{activeJobItem.matchReport.breakdown.educationScore}%</span>
                    </div>
                    <div style={{ height: '7px', background: tokens.colors.surfaceSubtle, borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${activeJobItem.matchReport.breakdown.educationScore}%`, height: '100%', background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Matched vs Missing Skills */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
                <div style={{ background: tokens.colors.successBg, border: `1px solid ${tokens.colors.successBorder}`, borderRadius: tokens.radii.md, padding: '1rem' }}>
                  <div style={{ color: tokens.colors.successEmerald, fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={15} />
                    Matched Skills ({activeJobItem.matchReport.skills.allMatched.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {activeJobItem.matchReport.skills.allMatched.length > 0 ? (
                      activeJobItem.matchReport.skills.allMatched.map(skill => (
                        <span key={skill} className="badge badge-matched" style={{ fontSize: '0.7rem' }}>
                          ✓ {skill}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: tokens.colors.textDim }}>No matching skills yet</span>
                    )}
                  </div>
                </div>

                <div style={{ background: tokens.colors.dangerBg, border: `1px solid ${tokens.colors.dangerBorder}`, borderRadius: tokens.radii.md, padding: '1rem' }}>
                  <div style={{ color: tokens.colors.dangerCrimson, fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <XCircle size={15} />
                    Skill Gap (Missing) ({activeJobItem.matchReport.skills.allMissing.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {activeJobItem.matchReport.skills.allMissing.length > 0 ? (
                      activeJobItem.matchReport.skills.allMissing.map(skill => (
                        <span key={skill} className="badge badge-missing" style={{ fontSize: '0.7rem' }}>
                          ✕ {skill}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.7rem', color: tokens.colors.successEmerald, fontWeight: 600 }}>
                        No missing skills! Full alignment.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Verdict Box */}
              <div style={{ background: tokens.colors.primaryIce, border: `1px solid ${tokens.colors.primaryIceBorder}`, borderRadius: tokens.radii.md, padding: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ color: tokens.colors.primaryRoyal, fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Award size={16} />
                  Suitability Diagnostic Verdict:
                </div>
                <p style={{ fontSize: '0.825rem', color: tokens.colors.textMain, lineHeight: 1.6 }}>
                  {activeJobItem.matchReport.hiringRecommendation}
                </p>
              </div>

              {/* Action Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  onClick={() => onApplyJob(activeJobItem.job, activeJobItem.matchReport)}
                  disabled={appliedJobIds.has(activeJobItem.job?.id)}
                  className="btn btn-primary"
                  style={{ padding: '0.65rem 1.6rem' }}
                >
                  {appliedJobIds.has(activeJobItem.job?.id) ? (
                    <>
                      <Check size={16} />
                      Application Submitted
                    </>
                  ) : (
                    <>
                      Apply for this Job
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
