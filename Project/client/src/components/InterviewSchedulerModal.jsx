import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  User, 
  Briefcase, 
  X, 
  Check, 
  Sparkles, 
  ExternalLink 
} from 'lucide-react';
import tokens from '../tokens';

export default function InterviewSchedulerModal({
  application,
  onClose,
  onSchedule
}) {
  const [candidateName, setCandidateName] = useState(application?.candidateName || 'Candidate');
  const [jobTitle, setJobTitle] = useState(application?.jobTitle || 'Engineering Position');
  const [interviewer, setInterviewer] = useState('Dr. Suresh Reddy (Head of Engineering)');
  const [date, setDate] = useState('2026-09-22');
  const [time, setTime] = useState('14:30');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [type, setType] = useState('Technical Architecture & Coding');
  const [mode, setMode] = useState('Google Meet');
  const [notes, setNotes] = useState('Evaluate system design and candidate resume skill match.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSchedule({
        applicationId: application?.id || null,
        candidateName,
        jobTitle,
        interviewer,
        date,
        time,
        durationMinutes: Number(durationMinutes),
        type,
        mode,
        notes
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px', padding: '2.25rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `1px solid ${tokens.colors.surfaceBorder}`, paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: tokens.colors.primaryRoyal, fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.25rem' }}>
              <Calendar size={15} />
              Interview Scheduler
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: tokens.colors.primaryNavy }}>
              Schedule Candidate Interview
            </h2>
            <p style={{ fontSize: '0.825rem', color: tokens.colors.textMuted }}>
              Applicant: <strong>{candidateName}</strong> for <strong>{jobTitle}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: tokens.colors.textDim }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Interviewer & Round Type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.35rem' }}>
                Primary Interviewer
              </label>
              <input
                type="text"
                required
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
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
                Interview Round Type
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
                <option value="Initial Screening">Initial Screening</option>
                <option value="Technical Architecture & Coding">Technical Architecture & Coding</option>
                <option value="System Design & Scalability">System Design & Scalability</option>
                <option value="Cultural & Team Fit">Cultural & Team Fit</option>
                <option value="Executive Final Round">Executive Final Round</option>
              </select>
            </div>
          </div>

          {/* Date, Time, Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.35rem' }}>
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
                Time
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
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
                Duration
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: tokens.radii.md,
                  border: `1px solid ${tokens.colors.surfaceBorder}`,
                  fontSize: '0.85rem',
                  background: '#ffffff'
                }}
              >
                <option value="30">30 mins</option>
                <option value="45">45 mins</option>
                <option value="60">60 mins</option>
                <option value="90">90 mins</option>
              </select>
            </div>
          </div>

          {/* Meeting Platform Mode */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.35rem' }}>
              Virtual Meeting Mode (Auto-Generated Link)
            </label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setMode('Google Meet')}
                className="btn"
                style={{
                  flex: 1,
                  background: mode === 'Google Meet' ? tokens.colors.primaryIce : '#ffffff',
                  color: mode === 'Google Meet' ? tokens.colors.primaryRoyal : tokens.colors.textMuted,
                  border: `1.5px solid ${mode === 'Google Meet' ? tokens.colors.primaryRoyal : tokens.colors.surfaceBorder}`,
                  fontSize: '0.85rem'
                }}
              >
                <Video size={16} /> Google Meet
              </button>
              <button
                type="button"
                onClick={() => setMode('Zoom')}
                className="btn"
                style={{
                  flex: 1,
                  background: mode === 'Zoom' ? tokens.colors.primaryIce : '#ffffff',
                  color: mode === 'Zoom' ? tokens.colors.primaryRoyal : tokens.colors.textMuted,
                  border: `1.5px solid ${mode === 'Zoom' ? tokens.colors.primaryRoyal : tokens.colors.surfaceBorder}`,
                  fontSize: '0.85rem'
                }}
              >
                <Video size={16} /> Zoom Video Call
              </button>
            </div>
          </div>

          {/* Notes / Agenda */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: tokens.colors.primaryNavy, marginBottom: '0.35rem' }}>
              Interview Notes & Instructions
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: tokens.radii.md,
                border: `1px solid ${tokens.colors.surfaceBorder}`,
                fontSize: '0.825rem',
                lineHeight: 1.5
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', borderTop: `1px solid ${tokens.colors.surfaceBorder}`, paddingTop: '1.25rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.5rem' }}
            >
              {isSubmitting ? 'Scheduling...' : 'Confirm & Schedule Call'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
