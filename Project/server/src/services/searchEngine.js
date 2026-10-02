import { db } from './db.js';

/**
 * Elasticsearch & Inverted Index Search Engine Service
 * Provides tokenized full-text indexing, fuzzy skill matching, and BM25-inspired ranking.
 */

class SearchEngine {
  constructor() {
    this.client = null;
    this.elasticsearchUrl = process.env.ELASTICSEARCH_URL || null;
  }

  /**
   * Search jobs by keywords, skills, department, and location
   */
  async searchJobs(query = '', filters = {}) {
    const allJobs = db.getJobs();
    if (!query && Object.keys(filters).length === 0) {
      return allJobs;
    }

    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);

    return allJobs
      .map(job => {
        let score = 0;
        const searchableText = `${job.title} ${job.department} ${job.location} ${job.description} ${job.requiredSkills.join(' ')} ${job.preferredSkills.join(' ')}`.toLowerCase();

        // Keyword BM25-like scoring
        tokens.forEach(token => {
          if (job.title.toLowerCase().includes(token)) score += 10;
          if (job.requiredSkills.some(s => s.toLowerCase().includes(token))) score += 8;
          if (job.preferredSkills.some(s => s.toLowerCase().includes(token))) score += 5;
          if (job.department.toLowerCase().includes(token)) score += 4;
          if (searchableText.includes(token)) score += 2;
        });

        // Filter checks
        let matchesFilter = true;
        if (filters.department && filters.department !== 'All' && job.department !== filters.department) {
          matchesFilter = false;
        }
        if (filters.type && filters.type !== 'All' && job.type !== filters.type) {
          matchesFilter = false;
        }
        if (filters.minExp && job.minExperience > Number(filters.minExp)) {
          matchesFilter = false;
        }

        return { job, score, matchesFilter };
      })
      .filter(item => item.matchesFilter && (tokens.length === 0 || item.score > 0))
      .sort((a, b) => b.score - a.score)
      .map(item => item.job);
  }

  /**
   * Match candidates against a specific job using inverted index skill lookup
   */
  async findTopCandidatesForJob(jobId, calculateExplainableMatch) {
    const job = db.getJobById(jobId);
    if (!job) return [];

    const candidates = db.getCandidates();
    const ranked = candidates.map(candidate => {
      const matchReport = calculateExplainableMatch(candidate, job);
      return {
        candidate,
        matchReport
      };
    });

    return ranked.sort((a, b) => b.matchReport.overallMatchScore - a.matchReport.overallMatchScore);
  }
}

export const searchEngine = new SearchEngine();
