import { Router } from 'express';
import multer from 'multer';
import { parseResume } from '../services/nlpParser.js';
import { calculateExplainableMatch } from '../services/explainableMatcher.js';
import { db } from '../services/db.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

// Upload and Parse Resume (PDF/DOCX/TXT)
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No resume file uploaded.' });
    }

    const { originalname, mimetype, buffer } = req.file;
    const parsedData = await parseResume(buffer, originalname, mimetype);

    // Calculate explainable match against all active jobs
    const activeJobs = db.getJobs();
    const jobMatches = activeJobs.map(job => {
      const match = calculateExplainableMatch(parsedData, job);
      return {
        job,
        matchReport: match
      };
    }).sort((a, b) => b.matchReport.overallMatchScore - a.matchReport.overallMatchScore);

    // Persist to MongoDB (jobportal > resumes & jobportal > candidates)
    let user = null;
    if (req.body.user) {
      try { user = typeof req.body.user === 'string' ? JSON.parse(req.body.user) : req.body.user; } catch {}
    }
    const savedResult = await db.saveResume({
      originalname,
      mimetype,
      parsedProfile: parsedData,
      rawText: parsedData.rawTextSnippet,
      user
    });

    res.json({
      success: true,
      data: {
        filename: originalname,
        parsedProfile: parsedData,
        jobMatches,
        savedToDatabase: !!savedResult?.resumeDoc
      }
    });
  } catch (err) {
    console.error('Resume upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Parse raw pasted resume text
router.post('/parse-text', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Resume text is required.' });
    }

    const parsedData = await parseResume(text);

    // Calculate explainable match against all active jobs
    const activeJobs = db.getJobs();
    const jobMatches = activeJobs.map(job => {
      const match = calculateExplainableMatch(parsedData, job);
      return {
        job,
        matchReport: match
      };
    }).sort((a, b) => b.matchReport.overallMatchScore - a.matchReport.overallMatchScore);

    // Persist to MongoDB (jobportal > resumes & jobportal > candidates)
    let user = null;
    if (req.body.user) {
      try { user = typeof req.body.user === 'string' ? JSON.parse(req.body.user) : req.body.user; } catch {}
    }
    const savedResult = await db.saveResume({
      originalname: 'pasted_resume.txt',
      mimetype: 'text/plain',
      parsedProfile: parsedData,
      rawText: text,
      user
    });

    res.json({
      success: true,
      data: {
        parsedProfile: parsedData,
        jobMatches,
        savedToDatabase: !!savedResult?.resumeDoc
      }
    });
  } catch (err) {
    console.error('Resume text parse error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Calculate single job match for a candidate profile
router.post('/match-job', (req, res) => {
  try {
    const { candidateProfile, jobId } = req.body;
    const job = db.getJobById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found.' });
    }
    if (!candidateProfile) {
      return res.status(400).json({ success: false, error: 'Candidate profile required.' });
    }

    const matchReport = calculateExplainableMatch(candidateProfile, job);
    res.json({ success: true, data: { job, matchReport } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Save Candidate profile
router.post('/save-candidate', (req, res) => {
  try {
    const candidate = db.createCandidate(req.body);
    res.status(201).json({ success: true, data: candidate });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
