/**
 * Normalize skill string for accurate comparison
 */
function normalizeSkill(skill) {
  return String(skill || '')
    .toLowerCase()
    .trim()
    .replace(/[.-]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Calculate Jaccard Similarity between two sets of strings
 */
function calculateJaccardSimilarity(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 1.0;
  if (setA.size === 0 || setB.size === 0) return 0.0;

  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

/**
 * Cosine similarity between two tokenized text representations (TF-IDF approximation)
 */
function calculateTextCosineSimilarity(text1, text2) {
  const words1 = text1.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);
  const words2 = text2.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);

  const freq1 = {};
  const freq2 = {};
  const allVocab = new Set([...words1, ...words2]);

  words1.forEach(w => { freq1[w] = (freq1[w] || 0) + 1; });
  words2.forEach(w => { freq2[w] = (freq2[w] || 0) + 1; });

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (const word of allVocab) {
    const v1 = freq1[word] || 0;
    const v2 = freq2[word] || 0;
    dotProduct += v1 * v2;
    norm1 += v1 * v1;
    norm2 += v2 * v2;
  }

  if (norm1 === 0 || norm2 === 0) return 0;
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

/**
 * Main Explainable Matching Engine
 * 
 * @param {Object} candidate - Parsed candidate object (skills, experienceYears, education, summary)
 * @param {Object} job - Job posting object (requiredSkills, preferredSkills, minExperience, educationRequired, description, title)
 * @returns {Object} Comprehensive explainable match report
 */
export function calculateExplainableMatch(candidate, job) {
  const candidateSkills = Array.isArray(candidate.skills) ? candidate.skills : [];
  const requiredSkills = Array.isArray(job.requiredSkills) ? job.requiredSkills : [];
  const preferredSkills = Array.isArray(job.preferredSkills) ? job.preferredSkills : [];

  const candidateNormMap = new Map();
  candidateSkills.forEach(s => candidateNormMap.set(normalizeSkill(s), s));

  // 1. Skill Analysis: Required Skills
  const matchedRequired = [];
  const missingRequired = [];

  requiredSkills.forEach(reqSkill => {
    const norm = normalizeSkill(reqSkill);
    let found = false;

    // Check direct equality or substring inclusion (e.g. "react" in "react.js")
    for (const [candNorm, original] of candidateNormMap.entries()) {
      if (candNorm === norm || candNorm.includes(norm) || norm.includes(candNorm)) {
        matchedRequired.push({
          skill: reqSkill,
          candidateMatchedSkill: original,
          type: 'required'
        });
        found = true;
        break;
      }
    }

    if (!found) {
      missingRequired.push({
        skill: reqSkill,
        type: 'required',
        severity: 'high',
        reason: 'Core requirement not listed in resume'
      });
    }
  });

  // 2. Skill Analysis: Preferred Skills
  const matchedPreferred = [];
  const missingPreferred = [];

  preferredSkills.forEach(prefSkill => {
    const norm = normalizeSkill(prefSkill);
    let found = false;

    for (const [candNorm, original] of candidateNormMap.entries()) {
      if (candNorm === norm || candNorm.includes(norm) || norm.includes(candNorm)) {
        matchedPreferred.push({
          skill: prefSkill,
          candidateMatchedSkill: original,
          type: 'preferred'
        });
        found = true;
        break;
      }
    }

    if (!found) {
      missingPreferred.push({
        skill: prefSkill,
        type: 'preferred',
        severity: 'low',
        reason: 'Bonus skill not detected'
      });
    }
  });

  // Additional Candidate Skills that provide extra value
  const matchedSkillNames = new Set([
    ...matchedRequired.map(m => normalizeSkill(m.candidateMatchedSkill)),
    ...matchedPreferred.map(m => normalizeSkill(m.candidateMatchedSkill))
  ]);
  const bonusSkills = candidateSkills.filter(s => !matchedSkillNames.has(normalizeSkill(s)));

  // Calculate Weighted Skill Score (0 to 100)
  const reqTotal = requiredSkills.length || 1;
  const prefTotal = preferredSkills.length || 1;

  const reqScoreRatio = matchedRequired.length / reqTotal;
  const prefScoreRatio = preferredSkills.length > 0 ? (matchedPreferred.length / prefTotal) : 1;

  // 75% weight on required, 25% weight on preferred
  const rawSkillScore = (reqScoreRatio * 0.75 + prefScoreRatio * 0.25) * 100;

  // Jaccard similarity between candidate skills and all job skills
  const jobAllSkills = new Set([...requiredSkills, ...preferredSkills].map(normalizeSkill));
  const candSkillsSet = new Set(candidateSkills.map(normalizeSkill));
  const jaccardSim = calculateJaccardSimilarity(jobAllSkills, candSkillsSet);

  // Blended Skill Score
  const skillMatchPercentage = Math.round(rawSkillScore * 0.85 + (jaccardSim * 100) * 0.15);

  // 3. Experience Match Score
  const candExp = Number(candidate.experienceYears || 0);
  const minExp = Number(job.minExperience || 0);
  let experienceScore = 100;
  let experienceGap = 0;
  let experienceStatus = 'Meets or exceeds requirement';

  if (minExp > 0) {
    if (candExp >= minExp) {
      experienceScore = 100;
      experienceGap = candExp - minExp;
      experienceStatus = `Exceeds minimum by ${experienceGap.toFixed(1)} yr(s)`;
    } else {
      experienceGap = minExp - candExp;
      experienceScore = Math.max(20, Math.round((candExp / minExp) * 100));
      experienceStatus = `Below requirement by ${experienceGap.toFixed(1)} yr(s)`;
    }
  }

  // 4. Education Match Score
  let educationScore = 85; // baseline reasonable match
  const candidateDegrees = Array.isArray(candidate.education) ? candidate.education.join(' ') : String(candidate.education || '');
  const requiredEducation = String(job.educationRequired || 'bachelor').toLowerCase();

  if (requiredEducation.includes('master') || requiredEducation.includes('ph.d')) {
    if (/master|m\.?s|m\.?tech|ph\.?d/i.test(candidateDegrees)) {
      educationScore = 100;
    } else {
      educationScore = 70;
    }
  } else {
    if (/bachelor|b\.?tech|b\.?s|b\.?e|engineer|computer/i.test(candidateDegrees)) {
      educationScore = 100;
    }
  }

  // 5. Semantic / Contextual Similarity
  const candidateText = `${candidate.summary || ''} ${candidateSkills.join(' ')}`;
  const jobText = `${job.title || ''} ${job.description || ''} ${requiredSkills.join(' ')}`;
  const semanticSimilarity = calculateTextCosineSimilarity(candidateText, jobText);
  const semanticScore = Math.round(semanticSimilarity * 100);

  // 6. Overall Match Score Calculation
  // Weights: Skills (55%), Experience (25%), Education (10%), Semantic Fit (10%)
  const overallMatchScore = Math.min(
    99,
    Math.max(
      15,
      Math.round(
        skillMatchPercentage * 0.55 +
        experienceScore * 0.25 +
        educationScore * 0.10 +
        Math.max(semanticScore, 50) * 0.10
      )
    )
  );

  // 7. Generate Explainability Insights & Hiring Verdict
  let hiringRecommendation = '';
  let suitabilityBadge = '';
  let verdictTone = 'info';

  if (overallMatchScore >= 85) {
    hiringRecommendation = 'Strong Match — Priority candidate for interview scheduling.';
    suitabilityBadge = 'Top Tier Match';
    verdictTone = 'success';
  } else if (overallMatchScore >= 70) {
    hiringRecommendation = 'Good Fit — Strong baseline, verify missing skills in screening round.';
    suitabilityBadge = 'Recommended';
    verdictTone = 'primary';
  } else if (overallMatchScore >= 50) {
    hiringRecommendation = 'Potential Match — Candidate possesses foundational skills but has notable gaps.';
    suitabilityBadge = 'Moderate Match';
    verdictTone = 'warning';
  } else {
    hiringRecommendation = 'Low Match — Significant technical skill and experience divergence.';
    suitabilityBadge = 'Needs Review';
    verdictTone = 'danger';
  }

  // Actionable tips for Candidate
  const candidateTips = [];
  if (missingRequired.length > 0) {
    candidateTips.push(`Add demonstrable projects or certifications in: ${missingRequired.map(m => m.skill).slice(0, 3).join(', ')}.`);
  }
  if (experienceScore < 80) {
    candidateTips.push(`Highlight key leadership impact and production deliverables to offset the ${experienceGap.toFixed(1)} yr experience delta.`);
  }
  if (bonusSkills.length > 0) {
    candidateTips.push(`Leverage your experience in ${bonusSkills.slice(0, 3).join(', ')} as a unique value proposition during the interview.`);
  }

  return {
    jobId: job.id || job._id,
    jobTitle: job.title,
    overallMatchScore,
    suitabilityBadge,
    verdictTone,
    hiringRecommendation,
    breakdown: {
      skillScore: skillMatchPercentage,
      experienceScore,
      educationScore,
      semanticScore
    },
    skills: {
      matchedRequired: matchedRequired.map(m => m.skill),
      missingRequired: missingRequired.map(m => m.skill),
      matchedPreferred: matchedPreferred.map(m => m.skill),
      missingPreferred: missingPreferred.map(m => m.skill),
      allMatched: [...matchedRequired, ...matchedPreferred].map(m => m.skill),
      allMissing: [...missingRequired, ...missingPreferred].map(m => m.skill),
      bonusSkills: bonusSkills.slice(0, 8)
    },
    experienceComparison: {
      candidateYears: candExp,
      requiredYears: minExp,
      gap: experienceGap,
      status: experienceStatus
    },
    educationComparison: {
      candidateEducation: candidate.education,
      requiredEducation: job.educationRequired || 'Bachelor in CS or related field',
      score: educationScore
    },
    candidateTips,
    evaluatedAt: new Date().toISOString()
  };
}
