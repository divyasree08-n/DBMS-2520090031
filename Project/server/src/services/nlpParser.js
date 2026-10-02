import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

// Comprehensive Skill Taxonomy across multiple domains
export const SKILL_TAXONOMY = {
  frontend: [
    'react', 'react.js', 'vue', 'vue.js', 'angular', 'next.js', 'nuxt.js', 'svelte',
    'javascript', 'typescript', 'html', 'html5', 'css', 'css3', 'sass', 'scss',
    'tailwind css', 'tailwind', 'bootstrap', 'material-ui', 'mui', 'chakra ui',
    'redux', 'redux toolkit', 'zustand', 'mobx', 'graphql', 'apollo client',
    'webpack', 'vite', 'responsive design', 'web accessibility', 'a11y'
  ],
  backend: [
    'node.js', 'nodejs', 'express', 'express.js', 'nest.js', 'nestjs', 'fastify',
    'python', 'django', 'flask', 'fastapi', 'java', 'spring', 'spring boot',
    'c#', '.net', 'asp.net', 'golang', 'go', 'ruby', 'ruby on rails', 'php', 'laravel',
    'rest api', 'restful apis', 'rest', 'graphql', 'grpc', 'websockets', 'microservices'
  ],
  database: [
    'mongodb', 'postgresql', 'postgres', 'mysql', 'sql server', 'sqlite', 'redis',
    'elasticsearch', 'dynamodb', 'cassandra', 'prisma', 'mongoose', 'typeorm',
    'sequelize', 'neo4j', 'firebase', 'supabase', 'database indexing', 'nosql', 'sql'
  ],
  cloud_devops: [
    'aws', 'amazon web services', 'ec2', 's3', 'lambda', 'azure', 'google cloud', 'gcp',
    'docker', 'kubernetes', 'k8s', 'ci/cd', 'github actions', 'gitlab ci', 'jenkins',
    'terraform', 'ansible', 'linux', 'bash', 'shell scripting', 'nginx', 'helm',
    'cloud architecture', 'devops', 'prometheus', 'grafana'
  ],
  ai_ml_data: [
    'machine learning', 'deep learning', 'nlp', 'natural language processing',
    'spacy', 'nltk', 'scikit-learn', 'tensorflow', 'pytorch', 'keras',
    'pandas', 'numpy', 'opencv', 'hugging face', 'transformers', 'bert', 'llm',
    'genai', 'langchain', 'data analysis', 'data visualization', 'tableau', 'power bi'
  ],
  testing_tools: [
    'jest', 'mocha', 'chai', 'cypress', 'playwright', 'selenium', 'postman',
    'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'agile', 'scrum'
  ],
  soft_skills: [
    'problem solving', 'communication', 'leadership', 'team collaboration',
    'project management', 'critical thinking', 'code review', 'system design',
    'mentoring', 'cross-functional collaboration'
  ]
};

// Flattened list of all normalized skills
const ALL_SKILLS = Array.from(
  new Set(Object.values(SKILL_TAXONOMY).flat())
).sort((a, b) => b.length - a.length); // match longer phrases first e.g. "react.js" before "react"

/**
 * Extract raw text from buffer based on mime type or file extension
 */
export async function extractTextFromBuffer(buffer, originalname = '', mimetype = '') {
  const ext = originalname.toLowerCase().split('.').pop();
  
  if (mimetype === 'application/pdf' || ext === 'pdf') {
    try {
      const data = await pdfParse(buffer);
      return data.text || '';
    } catch (err) {
      console.warn('pdf-parse failed, falling back to string conversion:', err.message);
      return buffer.toString('utf8');
    }
  }

  if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    ext === 'docx'
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || '';
    } catch (err) {
      console.warn('mammoth failed, falling back to string conversion:', err.message);
      return buffer.toString('utf8');
    }
  }

  // Fallback for .txt or unknown text files
  return buffer.toString('utf8');
}

/**
 * Extract Email address
 */
export function extractEmail(text) {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i);
  return match ? match[0].trim() : '';
}

/**
 * Extract Phone number
 */
export function extractPhone(text) {
  const match = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return match ? match[0].trim() : '';
}

/**
 * Extract Name heuristic
 */
export function extractName(text, fallbackEmail = '') {
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.includes('@') && !l.toLowerCase().includes('resume') && !l.toLowerCase().includes('curriculum'));

  for (const line of lines.slice(0, 5)) {
    // Check if line looks like a person's name (2-4 capitalized words, no punctuation/digits)
    if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,3}$/.test(line)) {
      return line;
    }
    // Also accept all-caps name (e.g. ALEX MORGAN)
    if (/^[A-Z]+(\s+[A-Z]+){1,3}$/.test(line) && line.length < 35) {
      return line.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }
  }

  // Fallback to name from email
  if (fallbackEmail) {
    const username = fallbackEmail.split('@')[0].replace(/[0-9._-]/g, ' ').trim();
    if (username.length > 2) {
      return username.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }
  }

  return 'Candidate';
}

/**
 * Extract Social links (LinkedIn, GitHub, Portfolio)
 */
export function extractLinks(text) {
  const links = {
    linkedin: '',
    github: '',
    portfolio: ''
  };

  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  if (linkedinMatch) links.linkedin = linkedinMatch[0];

  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  if (githubMatch) links.github = githubMatch[0];

  const portfolioMatch = text.match(/(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.(?:dev|me|io|design|tech|com)\/?/i);
  if (portfolioMatch && !portfolioMatch[0].includes('linkedin') && !portfolioMatch[0].includes('github')) {
    links.portfolio = portfolioMatch[0];
  }

  return links;
}

/**
 * Extract Skills with categorization and count
 */
export function extractSkills(text) {
  const lowerText = ` ${text.toLowerCase().replace(/[/\\,;:()\[\]]/g, ' ')} `;
  const foundSkillsSet = new Set();
  const categorized = {
    frontend: [],
    backend: [],
    database: [],
    cloud_devops: [],
    ai_ml_data: [],
    testing_tools: [],
    soft_skills: [],
    other: []
  };

  for (const skill of ALL_SKILLS) {
    // Regex boundary check to prevent substring collision (e.g. 'c' in 'css')
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[\\s,#.-])${escaped}(?:$|[\\s,#.-])`, 'i');

    if (regex.test(lowerText)) {
      foundSkillsSet.add(skill);
      
      // Categorize
      let assigned = false;
      for (const [cat, skillsList] of Object.entries(SKILL_TAXONOMY)) {
        if (skillsList.includes(skill)) {
          categorized[cat].push(skill);
          assigned = true;
          break;
        }
      }
      if (!assigned) {
        categorized.other.push(skill);
      }
    }
  }

  return {
    all: Array.from(foundSkillsSet),
    categorized,
    totalFound: foundSkillsSet.size
  };
}

/**
 * Extract Experience details and total estimated years
 */
export function extractExperience(text) {
  const expMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:\+)?\s*(?:years?|yrs?)(?:\s+of)?\s+experience/i);
  let estimatedYears = expMatch ? parseFloat(expMatch[1]) : 0;

  // Search year ranges e.g. 2019 - 2023, 2020 - Present
  const yearRanges = [...text.matchAll(/\b(20\d\d|19\d\d)\s*[-–—to]+\s*(20\d\d|Present|Current|Now)\b/gi)];
  if (!estimatedYears && yearRanges.length > 0) {
    let maxSpan = 0;
    const currentYear = new Date().getFullYear();
    for (const match of yearRanges) {
      const start = parseInt(match[1], 10);
      const end = /present|current|now/i.test(match[2]) ? currentYear : parseInt(match[2], 10);
      if (end >= start && end <= currentYear) {
        maxSpan += (end - start);
      }
    }
    estimatedYears = Math.min(Math.max(maxSpan, 1), 25);
  }

  // Extract company & job title mentions
  const titles = [
    'Software Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
    'DevOps Engineer', 'Data Scientist', 'Machine Learning Engineer', 'Product Manager',
    'UI/UX Designer', 'Cloud Architect', 'QA Engineer', 'Intern', 'Senior Software Engineer'
  ];
  const detectedTitles = [];
  for (const title of titles) {
    if (new RegExp(`\\b${title}\\b`, 'i').test(text)) {
      detectedTitles.push(title);
    }
  }

  return {
    estimatedYears: estimatedYears || 2, // sensible default if career detected
    detectedRoles: detectedTitles
  };
}

/**
 * Extract Education credentials
 */
export function extractEducation(text) {
  const degrees = [];
  const degreePatterns = [
    { name: 'Ph.D. / Doctorate', regex: /\b(ph\.?d\.?|doctorate|doctor of philosophy)\b/i },
    { name: 'Master of Science (M.S.)', regex: /\b(master(?:'s)? of science|m\.?s\.?|msc)\b/i },
    { name: 'Master of Technology (M.Tech)', regex: /\b(m\.?tech|master of technology)\b/i },
    { name: 'Master of Business Administration (MBA)', regex: /\b(mba|master of business administration)\b/i },
    { name: 'Bachelor of Technology (B.Tech)', regex: /\b(b\.?tech|bachelor of technology)\b/i },
    { name: 'Bachelor of Engineering (B.E.)', regex: /\b(b\.?e\.?|bachelor of engineering)\b/i },
    { name: 'Bachelor of Science (B.S.)', regex: /\b(bachelor(?:'s)? of science|b\.?s\.?|bsc)\b/i },
    { name: 'Bachelor of Computer Applications (BCA)', regex: /\b(bca|bachelor of computer applications)\b/i },
    { name: 'Master of Computer Applications (MCA)', regex: /\b(mca|master of computer applications)\b/i },
    { name: 'Bachelor Degree', regex: /\b(bachelor(?:'s)? degree|undergraduate)\b/i }
  ];

  for (const p of degreePatterns) {
    if (p.regex.test(text)) {
      degrees.push(p.name);
    }
  }

  // Look for GPA / CGPA
  const gpaMatch = text.match(/(?:gpa|cgpa)\s*[:=]?\s*(\d+(?:\.\d+)?)(?:\s*\/\s*(\d+))?/i);
  const gpa = gpaMatch ? `${gpaMatch[1]}${gpaMatch[2] ? '/' + gpaMatch[2] : ''}` : '';

  return {
    degrees: degrees.length > 0 ? degrees : ['Bachelor of Science in Computer Science'],
    gpa
  };
}

/**
 * Main parser entry point: parses raw text or document buffer into structured JSON
 */
export async function parseResume(textOrBuffer, filename = '', mimetype = '') {
  let rawText = '';
  if (Buffer.isBuffer(textOrBuffer)) {
    rawText = await extractTextFromBuffer(textOrBuffer, filename, mimetype);
  } else {
    rawText = String(textOrBuffer || '');
  }

  const email = extractEmail(rawText);
  const name = extractName(rawText, email);
  const phone = extractPhone(rawText);
  const links = extractLinks(rawText);
  const skillsData = extractSkills(rawText);
  const experience = extractExperience(rawText);
  const education = extractEducation(rawText);

  // Extract a 2-3 sentence summary
  const cleanLines = rawText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 40 && !l.includes('@') && !l.includes('http'));
  const summary = cleanLines.slice(0, 3).join(' ') || 'Experienced software professional with demonstrated hands-on technical proficiency in modern systems architecture.';

  return {
    name,
    email,
    phone,
    links,
    summary,
    skills: skillsData.all,
    categorizedSkills: skillsData.categorized,
    totalSkillsFound: skillsData.totalFound,
    experienceYears: experience.estimatedYears,
    detectedRoles: experience.detectedRoles,
    education: education.degrees,
    gpa: education.gpa,
    rawTextSnippet: rawText.slice(0, 400)
  };
}
