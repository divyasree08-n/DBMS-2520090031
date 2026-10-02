import { Router } from 'express';
import { db } from '../services/db.js';

const router = Router();

// GET Recruiter Analytics metrics
router.get('/', (req, res) => {
  try {
    const jobs = db.getJobs();
    const candidates = db.getCandidates();
    const applications = db.getApplications();
    const interviews = db.getInterviews();

    // 1. Core KPIs
    const totalJobs = jobs.length;
    const totalApplications = applications.length;
    const totalCandidates = candidates.length;
    const activeInterviews = interviews.filter(i => i.status === 'Scheduled').length;
    const highMatchesCount = applications.filter(a => a.overallMatchScore >= 80).length;

    // 2. Skill Demand (Top skills across all posted jobs)
    const skillDemandMap = {};
    jobs.forEach(j => {
      [...(j.requiredSkills || []), ...(j.preferredSkills || [])].forEach(skill => {
        const norm = skill.toLowerCase();
        skillDemandMap[norm] = (skillDemandMap[norm] || 0) + 1;
      });
    });
    const topInDemandSkills = Object.entries(skillDemandMap)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // 3. Score Distribution
    const scoreDistribution = {
      'Top Tier (90-100%)': applications.filter(a => a.overallMatchScore >= 90).length,
      'Strong Fit (75-89%)': applications.filter(a => a.overallMatchScore >= 75 && a.overallMatchScore < 90).length,
      'Moderate (50-74%)': applications.filter(a => a.overallMatchScore >= 50 && a.overallMatchScore < 75).length,
      'Low Fit (<50%)': applications.filter(a => a.overallMatchScore < 50).length
    };

    // 4. ATS Funnel Stages
    const stageFunnel = {
      Applied: applications.filter(a => a.stage === 'Applied').length,
      Screening: applications.filter(a => a.stage === 'Screening').length,
      Shortlisted: applications.filter(a => a.stage === 'Shortlisted').length,
      Interview: applications.filter(a => a.stage === 'Interview').length,
      Offered: applications.filter(a => a.stage === 'Offered').length,
      Rejected: applications.filter(a => a.stage === 'Rejected').length
    };

    res.json({
      success: true,
      data: {
        kpis: {
          totalJobs,
          totalApplications,
          totalCandidates,
          activeInterviews,
          highMatchesCount,
          averageMatchScore: Math.round(
            applications.reduce((acc, a) => acc + (a.overallMatchScore || 0), 0) / (applications.length || 1)
          )
        },
        topInDemandSkills,
        scoreDistribution,
        stageFunnel
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
