import React, { useState } from 'react';
import { 
  Plus, 
  Briefcase, 
  Sparkles, 
  Check, 
  Tag, 
  X, 
  DollarSign, 
  MapPin, 
  Eye, 
  ArrowLeft 
} from 'lucide-react';
import tokens from '../tokens';

export default function PostJob({
  onCreateJob,
  setCurrentPage
}) {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('Hitech City, Hyderabad (Remote)');
  const [type, setType] = useState('Full-time');
  const [minExperience, setMinExperience] = useState(3);
  const [salaryRange, setSalaryRange] = useState('₹10,00,000 - ₹13,00,000');
  const [educationRequired, setEducationRequired] = useState('Bachelor in Computer Science or related field');
  const [description, setDescription] = useState('');
  
  // Required & Preferred Skills
  const [requiredSkills, setRequiredSkills] = useState(['react', 'node.js', 'typescript', 'docker']);
  const [reqInput, setReqInput] = useState('');
  const [preferredSkills, setPreferredSkills] = useState(['aws', 'redis', 'graphql']);
  const [prefInput, setPrefInput] = useState('');

  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddReqSkill = (e) => {
    e.preventDefault();
    if (!reqInput.trim()) return;
    const clean = reqInput.trim().toLowerCase();
    if (!requiredSkills.includes(clean)) {
      setRequiredSkills([...requiredSkills, clean]);
    }
    setReqInput('');
  };

  const handleAddPrefSkill = (e) => {
    e.preventDefault();
    if (!prefInput.trim()) return;
    const clean = prefInput.trim().toLowerCase();
    if (!preferredSkills.includes(clean)) {
      setPreferredSkills([...preferredSkills, clean]);
    }
    setPrefInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsSubmitting(true);
    try {
      await onCreateJob({
        title,
        department,
        location,
        type,
        minExperience: Number(minExperience),
        salaryRange,
        educationRequired,
        description,
        requiredSkills,
        preferredSkills
      });
      setSuccess(true);
      setTimeout(() => {
        setCurrentPage('recruiterDashboard');
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadTemplate = (role) => {
    if (role === 'fullstack') {
      setTitle('Senior Full Stack Architect (React & Node.js)');
      setDepartment('Engineering');
      setMinExperience(4);
      setSalaryRange('₹14,00,000 - ₹19,00,000 LPA');
      setRequiredSkills(['react', 'node.js', 'typescript', 'mongodb', 'docker', 'rest api']);
      setPreferredSkills(['aws', 'redis', 'graphql', 'ci/cd', 'tailwind css']);
      setDescription('We are looking for an experienced Full Stack Architect to build resilient, distributed cloud services and intuitive React applications. You will spearhead our front-end design system, optimize API throughput, and guide architectural standards across engineering.');
    } else if (role === 'ai') {
      setTitle('Lead Machine Learning & NLP Specialist');
      setDepartment('Data & AI');
      setMinExperience(3);
      setSalaryRange('₹18,00,000 - ₹24,00,000 LPA');
      setRequiredSkills(['python', 'spacy', 'nlp', 'pytorch', 'machine learning', 'fastapi']);
      setPreferredSkills(['transformers', 'elasticsearch', 'docker', 'pandas', 'scikit-learn']);
      setDescription('Join our core AI research team developing state-of-the-art NLP document extraction, semantic search algorithms, and LLM fine-tuning pipelines. Deep proficiency in Python, spaCy, and vector retrieval required.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button
            onClick={() => setCurrentPage('recruiterDashboard')}
            className="btn"
            style={{ padding: '0', color: tokens.colors.textMuted, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem', background: 'transparent' }}
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: tokens.colors.primaryNavy }}>
            Post a New Job Opening
          </h1>
          <p style={{ fontSize: '0.9rem', color: tokens.colors.textMuted }}>
            Define role parameters, skill requirements, and weighting for the Explainable Matching engine.
          </p>
        </div>

        {/* Template Quick Loader */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: tokens.colors.textMuted }}>Load Template:</span>
          <button
            type="button"
            onClick={() => loadTemplate('fullstack')}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
          >
            Full Stack
          </button>
          <button
            type="button"
            onClick={() => loadTemplate('ai')}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
          >
            AI / NLP
          </button>
        </div>
      </div>

      {success && (
        <div style={{
          padding: '1rem 1.25rem',
          background: tokens.colors.successBg,
          color: tokens.colors.successEmerald,
          border: `1px solid ${tokens.colors.successBorder}`,
          borderRadius: tokens.radii.md,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Check size={18} />
          Job posting published successfully! Candidate match scores are now live.
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Title & Department */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.4rem' }}>
              Job Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Full Stack Engineer (React & Node.js)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: tokens.radii.md,
                border: `1px solid ${tokens.colors.surfaceBorder}`,
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.4rem' }}>
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: tokens.radii.md,
                border: `1px solid ${tokens.colors.surfaceBorder}`,
                fontSize: '0.9rem',
                background: '#ffffff'
              }}
            >
              <option value="Engineering">Engineering</option>
              <option value="Data & AI">Data & AI</option>
              <option value="DevOps & SRE">DevOps & SRE</option>
              <option value="Product Engineering">Product Engineering</option>
              <option value="Security">Security</option>
            </select>
          </div>
        </div>

        {/* Location, Type, Min Exp, Salary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.35rem' }}>
              Location & Work Mode
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: tokens.radii.md,
                border: `1px solid ${tokens.colors.surfaceBorder}`,
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.35rem' }}>
              Employment Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: tokens.radii.md,
                border: `1px solid ${tokens.colors.surfaceBorder}`,
                fontSize: '0.85rem',
                background: '#ffffff'
              }}
            >
              <option value="Full-time">Full-time</option>
              <option value="Contract">Contract</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.35rem' }}>
              Minimum Experience (Years)
            </label>
            <input
              type="number"
              min="0"
              max="20"
              value={minExperience}
              onChange={(e) => setMinExperience(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: tokens.radii.md,
                border: `1px solid ${tokens.colors.surfaceBorder}`,
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.35rem' }}>
              Salary Range
            </label>
            <input
              type="text"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: tokens.radii.md,
                border: `1px solid ${tokens.colors.surfaceBorder}`,
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>

        {/* Required Technical Skills (Heavily weighted in match score) */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.35rem' }}>
            Required Skills (Core Criteria — 75% Skill Weight) *
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
            {requiredSkills.map(skill => (
              <span key={skill} className="badge badge-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                {skill}
                <button
                  type="button"
                  onClick={() => setRequiredSkills(requiredSkills.filter(s => s !== skill))}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', marginLeft: '0.3rem', color: tokens.colors.textDim }}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '380px' }}>
            <input
              type="text"
              placeholder="Add required skill (e.g. React, Docker)..."
              value={reqInput}
              onChange={(e) => setReqInput(e.target.value)}
              style={{
                flex: 1,
                padding: '0.55rem 0.85rem',
                borderRadius: tokens.radii.md,
                border: `1px solid ${tokens.colors.surfaceBorder}`,
                fontSize: '0.825rem'
              }}
            />
            <button type="button" onClick={handleAddReqSkill} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
              <Plus size={14} /> Add
            </button>
          </div>
        </div>

        {/* Preferred Skills */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.35rem' }}>
            Preferred / Bonus Skills (25% Skill Weight)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
            {preferredSkills.map(skill => (
              <span key={skill} className="badge badge-neutral" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                {skill}
                <button
                  type="button"
                  onClick={() => setPreferredSkills(preferredSkills.filter(s => s !== skill))}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', marginLeft: '0.3rem', color: tokens.colors.textDim }}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '380px' }}>
            <input
              type="text"
              placeholder="Add bonus skill (e.g. GraphQL, AWS)..."
              value={prefInput}
              onChange={(e) => setPrefInput(e.target.value)}
              style={{
                flex: 1,
                padding: '0.55rem 0.85rem',
                borderRadius: tokens.radii.md,
                border: `1px solid ${tokens.colors.surfaceBorder}`,
                fontSize: '0.825rem'
              }}
            />
            <button type="button" onClick={handleAddPrefSkill} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
              <Plus size={14} /> Add
            </button>
          </div>
        </div>

        {/* Detailed Description */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.4rem' }}>
            Job Description & Responsibilities *
          </label>
          <textarea
            required
            rows={7}
            placeholder="Describe the day-to-day responsibilities, mission, and expectations..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: tokens.radii.md,
              border: `1px solid ${tokens.colors.surfaceBorder}`,
              fontSize: '0.875rem',
              lineHeight: 1.6,
              resize: 'vertical'
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: `1px solid ${tokens.colors.surfaceBorder}`, paddingTop: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setCurrentPage('recruiterDashboard')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !title || !description}
            className="btn btn-primary"
            style={{ padding: '0.75rem 2rem' }}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Job Opening'}
          </button>
        </div>
      </form>
    </div>
  );
}
