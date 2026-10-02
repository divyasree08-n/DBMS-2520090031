import { Router } from 'express';
import { db } from '../services/db.js';
import { searchEngine } from '../services/searchEngine.js';
import { calculateExplainableMatch } from '../services/explainableMatcher.js';

const router = Router();

// GET all jobs with optional search and filtering
router.get('/', async (req, res) => {
  try {
    const { q, department, type, minExp } = req.query;
    const jobs = await searchEngine.searchJobs(q, { department, type, minExp });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single job by ID
router.get('/:id', (req, res) => {
  const job = db.getJobById(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, error: 'Job not found' });
  }
  res.json({ success: true, data: job });
});

// POST new job
router.post('/', (req, res) => {
  try {
    const {
      title,
      department,
      location,
      type,
      minExperience,
      salaryRange,
      educationRequired,
      description,
      requiredSkills,
      preferredSkills
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description are required.' });
    }

    const newJob = db.createJob({
      title,
      department: department || 'Engineering',
      location: location || 'Remote',
      type: type || 'Full-time',
      minExperience: Number(minExperience) || 2,
      salaryRange: salaryRange || '₹10,00,000 - ₹14,00,000 LPA',
      educationRequired: educationRequired || 'Bachelor Degree',
      description,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills ? requiredSkills.split(',').map(s => s.trim().toLowerCase()) : []),
      preferredSkills: Array.isArray(preferredSkills) ? preferredSkills : (preferredSkills ? preferredSkills.split(',').map(s => s.trim().toLowerCase()) : [])
    });

    res.status(201).json({ success: true, data: newJob });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET top matched candidates for a specific job (Recruiter view)
router.get('/:id/candidate-matches', async (req, res) => {
  try {
    const matches = await searchEngine.findTopCandidatesForJob(req.params.id, calculateExplainableMatch);
    res.json({ success: true, count: matches.length, data: matches });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
