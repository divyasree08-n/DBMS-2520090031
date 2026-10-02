import { Router } from 'express';
import { db } from '../services/db.js';

const router = Router();

// GET all interviews
router.get('/', (req, res) => {
  try {
    const interviews = db.getInterviews();
    res.json({ success: true, count: interviews.length, data: interviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST schedule a new interview
router.post('/schedule', (req, res) => {
  try {
    const {
      applicationId,
      candidateName,
      jobTitle,
      interviewer,
      date,
      time,
      durationMinutes,
      type,
      mode,
      meetingLink,
      notes
    } = req.body;

    if (!candidateName || !date || !time) {
      return res.status(400).json({ success: false, error: 'candidateName, date, and time are required.' });
    }

    // Auto-generate meeting link if none provided
    const generatedLink = meetingLink || (
      mode === 'Zoom'
        ? `https://zoom.us/j/${Math.floor(1000000000 + Math.random() * 9000000000)}`
        : `https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`
    );

    const interview = db.createInterview({
      applicationId: applicationId || null,
      candidateName,
      jobTitle: jobTitle || 'Software Position',
      interviewer: interviewer || 'Hiring Manager',
      date,
      time,
      durationMinutes: Number(durationMinutes) || 45,
      type: type || 'Technical Round',
      mode: mode || 'Google Meet',
      meetingLink: generatedLink,
      notes: notes || 'Interview scheduled via Recruiter Portal.'
    });

    res.status(201).json({ success: true, data: interview });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH update interview status (Completed, Cancelled, Rescheduled)
router.patch('/:id/status', (req, res) => {
  try {
    const { status, notes } = req.body;
    const updated = db.updateInterview(req.params.id, { status, ...(notes && { notes }) });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Interview not found.' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
