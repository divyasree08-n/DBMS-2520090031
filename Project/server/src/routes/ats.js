import { Router } from 'express';
import { db } from '../services/db.js';

const router = Router();

// GET all ATS applications
router.get('/applications', (req, res) => {
  try {
    const apps = db.getApplications();
    res.json({ success: true, count: apps.length, data: apps });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST submit application
router.post('/apply', (req, res) => {
  try {
    const {
      jobId,
      candidateId,
      candidateName,
      candidateEmail,
      jobTitle,
      overallMatchScore,
      matchedSkills,
      missingSkills,
      experienceScore,
      educationScore,
      notes
    } = req.body;

    if (!jobId || !candidateName || !candidateEmail) {
      return res.status(400).json({ success: false, error: 'jobId, candidateName, and candidateEmail are required.' });
    }

    const application = db.createApplication({
      jobId,
      candidateId: candidateId || `cand-${Date.now()}`,
      candidateName,
      candidateEmail,
      jobTitle: jobTitle || 'Position',
      overallMatchScore: Number(overallMatchScore) || 75,
      matchedSkills: Array.isArray(matchedSkills) ? matchedSkills : [],
      missingSkills: Array.isArray(missingSkills) ? missingSkills : [],
      experienceScore: Number(experienceScore) || 80,
      educationScore: Number(educationScore) || 85,
      notes: notes || 'Applied via Candidate Portal with parsed resume.'
    });

    res.status(201).json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH update application stage (Kanban moves)
router.patch('/applications/:id/stage', (req, res) => {
  try {
    const { stage, notes } = req.body;
    const validStages = ['Applied', 'Screening', 'Shortlisted', 'Interview', 'Offered', 'Rejected'];

    if (!validStages.includes(stage)) {
      return res.status(400).json({ success: false, error: `Invalid stage. Must be one of: ${validStages.join(', ')}` });
    }

    const updated = db.updateApplicationStage(req.params.id, stage, notes);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Application not found.' });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
