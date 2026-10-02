import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Share2, 
  Code, 
  GraduationCap, 
  Briefcase, 
  Tag, 
  Check, 
  Plus, 
  Trash2, 
  Sparkles, 
  FileText 
} from 'lucide-react';
import tokens from '../tokens';

export default function CandidateProfile({ candidateProfile, setCandidateProfile, setCurrentPage, user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [savedAlert, setSavedAlert] = useState(false);

  const profile = candidateProfile || {
    name: user?.name || 'Your Name',
    email: user?.email || 'your.email@example.com',
    phone: user?.phone || '+91 98765 43210',
    links: {
      linkedin: '',
      github: '',
      portfolio: ''
    },
    summary: user ? `${user.name} — Technical software professional with expertise in scalable systems development.` : 'Upload your resume or add your skills below to complete your profile.',
    experienceYears: 3,
    education: ['Bachelor of Science in Computer Science'],
    gpa: '3.80',
    skills: ['react', 'node.js', 'typescript', 'javascript', 'rest api', 'docker', 'mongodb', 'git']
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const clean = newSkill.trim().toLowerCase();
    if (!profile.skills.includes(clean)) {
      const updated = { ...profile, skills: [...profile.skills, clean] };
      setCandidateProfile(updated);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = {
      ...profile,
      skills: profile.skills.filter(s => s !== skillToRemove)
    };
    setCandidateProfile(updated);
  };

  const handleSave = () => {
    setSavedAlert(true);
    setIsEditing(false);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: tokens.colors.primaryIce, color: tokens.colors.primaryRoyal, padding: '0.35rem 0.8rem', borderRadius: tokens.radii.full, fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <User size={14} />
            Verified Candidate Profile
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: tokens.colors.primaryNavy }}>
            Candidate Profile
          </h1>
          <p style={{ fontSize: '0.9rem', color: tokens.colors.textMuted }}>
            Manage your extracted resume information used by the NLP explainable matching engine.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setCurrentPage('resumeUpload')}
            className="btn btn-secondary"
            style={{ fontSize: '0.825rem' }}
          >
            <FileText size={15} color={tokens.colors.primaryRoyal} />
            Re-Upload Resume
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary"
            style={{ fontSize: '0.825rem' }}
          >
            <Check size={15} />
            Save Profile
          </button>
        </div>
      </div>

      {savedAlert && (
        <div style={{
          padding: '0.85rem 1.25rem',
          background: tokens.colors.successBg,
          color: tokens.colors.successEmerald,
          border: `1px solid ${tokens.colors.successBorder}`,
          borderRadius: tokens.radii.md,
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Check size={16} />
          Profile updated successfully! Match scores have been refreshed across all jobs.
        </div>
      )}

      {/* Main Card */}
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        {/* Profile Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', borderBottom: `1px solid ${tokens.colors.surfaceBorder}`, paddingBottom: '1.75rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 800,
            boxShadow: tokens.shadows.md
          }}>
            {profile.name?.charAt(0) || 'S'}
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: tokens.colors.primaryNavy }}>
              {profile.name}
            </h2>
            <div style={{ display: 'flex', gap: '1.25rem', color: tokens.colors.textMuted, fontSize: '0.85rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Mail size={14} color={tokens.colors.primaryRoyal} />
                {profile.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Phone size={14} color={tokens.colors.primaryRoyal} />
                {profile.phone}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Briefcase size={14} color={tokens.colors.primaryRoyal} />
                {profile.experienceYears} Years Experience
              </span>
            </div>
          </div>
        </div>

        {/* Bio / Summary */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.5rem' }}>
            Professional Summary
          </h3>
          <p style={{ fontSize: '0.875rem', color: tokens.colors.textMuted, lineHeight: 1.6, background: tokens.colors.surfaceSubtle, padding: '1rem', borderRadius: tokens.radii.md }}>
            {profile.summary}
          </p>
        </div>

        {/* Technical Skills with Add & Remove */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: tokens.colors.primaryNavy, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Tag size={16} color={tokens.colors.primaryRoyal} />
              Extracted & Verified Skills ({profile.skills?.length || 0})
            </h3>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {(profile.skills || []).map(skill => (
              <span 
                key={skill} 
                className="badge badge-primary"
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  title="Remove skill"
                  style={{
                    border: 'none',
                    background: 'none',
                    color: tokens.colors.textDim,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0'
                  }}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          {/* Add Skill Input */}
          <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '0.5rem', maxWidth: '360px' }}>
            <input
              type="text"
              placeholder="Add skill (e.g. GraphQL, AWS)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              style={{
                flex: 1,
                padding: '0.5rem 0.85rem',
                borderRadius: tokens.radii.md,
                border: `1px solid ${tokens.colors.surfaceBorder}`,
                fontSize: '0.825rem'
              }}
            />
            <button type="submit" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}>
              <Plus size={14} />
              Add
            </button>
          </form>
        </div>

        {/* Education Credentials */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <GraduationCap size={18} color={tokens.colors.primaryRoyal} />
            Education History
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(profile.education || []).map((deg, idx) => (
              <div key={idx} style={{
                padding: '0.85rem 1.25rem',
                borderRadius: tokens.radii.md,
                background: tokens.colors.primaryIce,
                border: `1px solid ${tokens.colors.primaryIceBorder}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: tokens.colors.primaryDeep }}>
                  {deg}
                </span>
                {profile.gpa && (
                  <span className="badge badge-primary">
                    GPA: {profile.gpa}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.75rem' }}>
            Online Presence & Profiles
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {profile.links?.linkedin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', color: tokens.colors.primaryRoyal }}>
                <Share2 size={16} />
                <span>{profile.links.linkedin}</span>
              </div>
            )}
            {profile.links?.github && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', color: tokens.colors.primaryNavy }}>
                <Code size={16} />
                <span>{profile.links.github}</span>
              </div>
            )}
            {profile.links?.portfolio && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', color: tokens.colors.successEmerald }}>
                <Globe size={16} />
                <span>{profile.links.portfolio}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
