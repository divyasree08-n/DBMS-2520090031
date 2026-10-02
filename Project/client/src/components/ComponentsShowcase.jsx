import React, { useState } from 'react';
import { 
  Component, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Calendar, 
  Layers, 
  Briefcase, 
  User, 
  Video, 
  Mail, 
  Search, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Tag
} from 'lucide-react';
import tokens from '../tokens';

export default function ComponentsShowcase() {
  const [selectedScore, setSelectedScore] = useState(92);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: tokens.colors.primaryIce, color: tokens.colors.primaryRoyal, padding: '0.35rem 0.8rem', borderRadius: tokens.radii.full, fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          <Component size={14} />
          Design System & UI Components Gallery
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: tokens.colors.primaryNavy, marginBottom: '0.5rem' }}>
          Frontend Components Showcase
        </h1>
        <p style={{ fontSize: '0.95rem', color: tokens.colors.textMuted }}>
          Interactive catalog of all reusable UI components, design tokens, score gauges, and badges built with the <strong>Blue & White</strong> design system.
        </p>
      </div>

      {/* 1. Color Tokens Showcase */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '1rem' }}>
          1. Blue & White Palette Tokens
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
          {[
            { name: 'Primary Royal', hex: '#2563eb', text: '#ffffff' },
            { name: 'Primary Deep Navy', hex: '#0f172a', text: '#ffffff' },
            { name: 'Primary Sky', hex: '#0ea5e9', text: '#ffffff' },
            { name: 'Primary Ice (Tint)', hex: '#eff6ff', text: '#1e3a8a', border: true },
            { name: 'Canvas White', hex: '#ffffff', text: '#0f172a', border: true },
            { name: 'Matched Emerald', hex: '#059669', text: '#ffffff' },
            { name: 'Missing Crimson', hex: '#e11d48', text: '#ffffff' },
            { name: 'Warning Amber', hex: '#d97706', text: '#ffffff' }
          ].map(color => (
            <div key={color.name} style={{
              background: color.hex,
              color: color.text,
              padding: '1.25rem',
              borderRadius: tokens.radii.md,
              border: color.border ? `1px solid ${tokens.colors.surfaceBorder}` : 'none',
              boxShadow: tokens.shadows.sm,
              textAlign: 'center'
            }}>
              <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{color.name}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: '0.25rem' }}>{color.hex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Explainable Match Score Circular Gauges */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.5rem' }}>
          2. Explainable Circular Match Score Gauges
        </h2>
        <p style={{ fontSize: '0.85rem', color: tokens.colors.textMuted, marginBottom: '1.5rem' }}>
          Dynamic circular SVG gauges with color adaptation based on compatibility tier:
        </p>

        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Top Tier */}
          <div style={{ textAlign: 'center' }}>
            <div className="score-circle score-high" style={{ width: '72px', height: '72px', fontSize: '1.4rem', margin: '0 auto' }}>
              95%
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: tokens.colors.successEmerald, display: 'block', marginTop: '0.5rem' }}>
              Top Tier Match
            </span>
            <span style={{ fontSize: '0.7rem', color: tokens.colors.textMuted }}>Score &ge; 85%</span>
          </div>

          {/* Strong Fit */}
          <div style={{ textAlign: 'center' }}>
            <div className="score-circle score-mid" style={{ width: '72px', height: '72px', fontSize: '1.4rem', margin: '0 auto' }}>
              82%
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: tokens.colors.primaryRoyal, display: 'block', marginTop: '0.5rem' }}>
              Recommended Fit
            </span>
            <span style={{ fontSize: '0.7rem', color: tokens.colors.textMuted }}>70% &le; Score &lt; 85%</span>
          </div>

          {/* Moderate */}
          <div style={{ textAlign: 'center' }}>
            <div className="score-circle score-low" style={{ width: '72px', height: '72px', fontSize: '1.4rem', margin: '0 auto' }}>
              64%
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: tokens.colors.warningAmber, display: 'block', marginTop: '0.5rem' }}>
              Moderate Match
            </span>
            <span style={{ fontSize: '0.7rem', color: tokens.colors.textMuted }}>50% &le; Score &lt; 70%</span>
          </div>

          {/* Low */}
          <div style={{ textAlign: 'center' }}>
            <div className="score-circle" style={{ width: '72px', height: '72px', fontSize: '1.4rem', margin: '0 auto', borderColor: '#e11d48', color: '#e11d48', background: '#fff1f2' }}>
              42%
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: tokens.colors.dangerCrimson, display: 'block', marginTop: '0.5rem' }}>
              Low Match
            </span>
            <span style={{ fontSize: '0.7rem', color: tokens.colors.textMuted }}>Score &lt; 50%</span>
          </div>
        </div>
      </div>

      {/* 3. Skill Chips & Badges */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.5rem' }}>
          3. Skill Chips & Status Badges
        </h2>
        <p style={{ fontSize: '0.85rem', color: tokens.colors.textMuted, marginBottom: '1.5rem' }}>
          Used to highlight matched competencies, skill gaps, and ATS stages:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.5rem' }}>
              Matched Skills (Positive Overlap):
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-matched">✓ React</span>
              <span className="badge badge-matched">✓ Node.js</span>
              <span className="badge badge-matched">✓ TypeScript</span>
              <span className="badge badge-matched">✓ Docker</span>
              <span className="badge badge-matched">✓ MongoDB</span>
            </div>
          </div>

          <div>
            <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.5rem' }}>
              Skill Gap Badges (Missing Requirements):
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-missing">✕ Kubernetes</span>
              <span className="badge badge-missing">✕ Elasticsearch</span>
              <span className="badge badge-missing">✕ GraphQL</span>
            </div>
          </div>

          <div>
            <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.5rem' }}>
              Role & ATS Stage Badges:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-primary">Engineering</span>
              <span className="badge badge-neutral">Applied</span>
              <span className="badge badge-neutral">Screening</span>
              <span className="badge badge-primary" style={{ background: '#faf5ff', color: '#7c3aed', borderColor: '#e9d5ff' }}>Shortlisted</span>
              <span className="badge badge-primary">Interview Scheduled</span>
              <span className="badge badge-matched">Offer Extended</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Action Buttons & Micro-Interactions */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '1rem' }}>
          4. Action Buttons & Interactive Controls
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn btn-primary">
            <Sparkles size={16} />
            Primary Blue Gradient Button
          </button>

          <button className="btn btn-secondary">
            <User size={16} color={tokens.colors.primaryRoyal} />
            Secondary White Card Button
          </button>

          <button className="btn btn-outline-primary">
            <Briefcase size={16} />
            Outline Accent Button
          </button>

          <button className="btn btn-primary" style={{ background: tokens.colors.successEmerald }}>
            <CheckCircle2 size={16} />
            Success Action Button
          </button>
        </div>
      </div>
    </div>
  );
}
