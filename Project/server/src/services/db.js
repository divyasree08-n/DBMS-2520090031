import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

/**
 * MongoDB-backed & Resilient In-Memory Database Store
 * Connects to MongoDB (Compass / Local / Atlas) via Mongoose.
 * Automatically synchronizes users, jobs, applications, and interviews.
 */

// ─── Mongoose Schemas & Models ──────────────────────────────────────────────

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['candidate', 'recruiter'], default: 'candidate' },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true, strict: false });

const jobSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: { type: String, required: true },
  department: { type: String, default: 'Engineering' },
  location: { type: mongoose.Schema.Types.Mixed, default: 'Remote' },
  type: { type: String, default: 'Full-time' },
  minExperience: { type: Number, default: 2 },
  salaryRange: { type: String, default: '₹12,00,000 - ₹18,00,000 LPA' },
  educationRequired: { type: String, default: 'Bachelor Degree' },
  description: { type: String, required: true },
  requiredSkills: [String],
  preferredSkills: [String],
  status: { type: String, default: 'Active' },
  postedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  applicantsCount: { type: Number, default: 0 }
}, { timestamps: true, strict: false });

const applicationSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  jobId: { type: String, required: true },
  candidateId: { type: String },
  candidateName: { type: String, required: true },
  candidateEmail: { type: String, required: true },
  jobTitle: { type: String, default: 'Position' },
  overallMatchScore: { type: Number, default: 75 },
  stage: { type: String, default: 'Applied' },
  matchedSkills: [String],
  missingSkills: [String],
  experienceScore: { type: Number, default: 80 },
  educationScore: { type: Number, default: 85 },
  appliedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  notes: { type: String, default: '' }
}, { timestamps: true, strict: false });

const interviewSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  applicationId: { type: String },
  candidateName: { type: String, required: true },
  jobTitle: { type: String },
  interviewer: { type: String },
  date: { type: String },
  time: { type: String },
  durationMinutes: { type: Number, default: 45 },
  type: { type: String, default: 'Technical' },
  mode: { type: String, default: 'Google Meet' },
  meetingLink: { type: String },
  status: { type: String, default: 'Scheduled' },
  notes: { type: String, default: '' }
}, { timestamps: true, strict: false });

const resumeSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.Mixed },
  fileUrl: { type: String, default: '' },
  fileName: { type: String, default: 'resume.pdf' },
  fileType: { type: String, default: 'pdf' },
  isPrimary: { type: Boolean, default: true },
  parseStatus: { type: String, default: 'completed' },
  rawText: { type: String, default: '' },
  parsedData: {
    parsedName: String,
    parsedEmail: String,
    parsedPhone: String,
    summary: String,
    totalExperienceYears: Number,
    totalExperienceMonths: Number,
    nlpModelVersion: { type: String, default: 'v1.0' },
    skills: [String],
    categorizedSkills: mongoose.Schema.Types.Mixed,
    education: [String],
    gpa: String,
    detectedRoles: [String],
    certifications: [String],
    languages: [String]
  },
  parsedAt: { type: Date, default: Date.now }
}, { timestamps: true, strict: false });

const candidateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed },
  fullName: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  location: { type: mongoose.Schema.Types.Mixed, default: 'Hyderabad, India' },
  headline: { type: String },
  summary: { type: String },
  yearsExperience: { type: Number, default: 0 },
  currentTitle: { type: String, default: 'Software Professional' },
  openToWork: { type: Boolean, default: true },
  skills: [mongoose.Schema.Types.Mixed],
  education: [mongoose.Schema.Types.Mixed],
  experience: [mongoose.Schema.Types.Mixed],
  primaryResumeId: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true, strict: false });

export const UserModel = mongoose.models.User || mongoose.model('User', userSchema, 'users');
export const JobModel = mongoose.models.Job || mongoose.model('Job', jobSchema, 'jobs');
export const ApplicationModel = mongoose.models.Application || mongoose.model('Application', applicationSchema, 'applications');
export const InterviewModel = mongoose.models.Interview || mongoose.model('Interview', interviewSchema, 'interviews');
export const ResumeModel = mongoose.models.Resume || mongoose.model('Resume', resumeSchema, 'resumes');
export const CandidateModel = mongoose.models.Candidate || mongoose.model('Candidate', candidateSchema, 'candidates');


// ─── Initial Seed Jobs ──────────────────────────────────────────────────────
const INITIAL_JOBS = [
  {
    id: 'job-1',
    title: 'Senior Full Stack Engineer (React & Node.js)',
    department: 'Engineering',
    location: 'Hitech City, Hyderabad (Remote)',
    type: 'Full-time',
    minExperience: 4,
    salaryRange: '₹18,00,000 - ₹24,00,000 LPA',
    educationRequired: 'Bachelor in Computer Science or equivalent',
    description: 'Wipro is seeking an experienced Full Stack Engineer to lead the development of our high-scale cloud platforms. You will design resilient microservices, architect responsive React interfaces, and collaborate with product teams to build real-time collaborative workflows.',
    requiredSkills: ['react', 'node.js', 'typescript', 'mongodb', 'docker', 'rest api'],
    preferredSkills: ['aws', 'redis', 'graphql', 'ci/cd', 'tailwind css'],
    status: 'Active',
    postedDate: '2026-09-10',
    applicantsCount: 6
  },
  {
    id: 'job-2',
    title: 'AI / NLP Machine Learning Engineer',
    department: 'Data & AI',
    location: 'Nanakramguda, Hyderabad (Hybrid)',
    type: 'Full-time',
    minExperience: 3,
    salaryRange: '₹20,00,000 - ₹28,00,000 LPA',
    educationRequired: 'Master or Bachelor in CS, AI, or Data Science',
    description: 'Join Amazon\'s cutting-edge AI team building intelligent document understanding and semantic search pipelines. You will train custom NLP models, fine-tune LLM embeddings, and build production inference services using Python, spaCy, and PyTorch.',
    requiredSkills: ['python', 'spacy', 'nlp', 'machine learning', 'pytorch', 'fastapi'],
    preferredSkills: ['transformers', 'elasticsearch', 'docker', 'pandas', 'scikit-learn'],
    status: 'Active',
    postedDate: '2026-09-12',
    applicantsCount: 4
  },
  {
    id: 'job-3',
    title: 'Cloud DevOps & Infrastructure Engineer',
    department: 'DevOps & SRE',
    location: 'KPHB, Kukatpally, Hyderabad (Remote)',
    type: 'Full-time',
    minExperience: 3,
    salaryRange: '₹16,00,000 - ₹22,00,000 LPA',
    educationRequired: 'Bachelor degree in Engineering / CS',
    description: 'Cognizant is responsible for maintaining 99.99% system availability, managing Kubernetes clusters on AWS, automating multi-region CI/CD pipelines, and establishing enterprise observability with Prometheus and Grafana.',
    requiredSkills: ['aws', 'kubernetes', 'docker', 'terraform', 'ci/cd', 'linux'],
    preferredSkills: ['helm', 'ansible', 'prometheus', 'grafana', 'python', 'bash'],
    status: 'Active',
    postedDate: '2026-09-08',
    applicantsCount: 5
  },
  {
    id: 'job-4',
    title: 'Frontend Platform Engineer (React & TypeScript)',
    department: 'Product Engineering',
    location: 'Kukatpally, Hyderabad (Remote)',
    type: 'Full-time',
    minExperience: 2,
    salaryRange: '₹12,00,000 - ₹18,00,000 LPA',
    educationRequired: 'Bachelor degree',
    description: 'Google is looking to craft high-performance, accessible, and aesthetically stunning user interfaces. Collaborate with designers to evolve our design system, optimize Core Web Vitals, and build interactive dashboards.',
    requiredSkills: ['react', 'typescript', 'javascript', 'html5', 'css3', 'tailwind css'],
    preferredSkills: ['next.js', 'vite', 'redux', 'jest', 'web accessibility'],
    status: 'Active',
    postedDate: '2026-09-14',
    applicantsCount: 7
  },
  {
    id: 'job-5',
    title: 'Backend Systems Engineer (Distributed Systems)',
    department: 'Core Infrastructure',
    location: 'Hitech City, Hyderabad (Hybrid)',
    type: 'Full-time',
    minExperience: 4,
    salaryRange: '₹19,00,000 - ₹26,00,000 LPA',
    educationRequired: 'Bachelor or Master in CS',
    description: 'Wipro seeks engineers to build fault-tolerant event-driven backend services handling millions of transactions daily. Deep hands-on experience with relational and NoSQL databases, message queues, and caching architectures.',
    requiredSkills: ['node.js', 'postgresql', 'redis', 'microservices', 'rest api', 'docker'],
    preferredSkills: ['golang', 'kubernetes', 'elasticsearch', 'grpc'],
    status: 'Active',
    postedDate: '2026-09-05',
    applicantsCount: 3
  }
];

// Seed Candidate Resumes
const INITIAL_CANDIDATES = [
  {
    id: 'cand-1',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 91234 56789',
    links: {
      linkedin: 'linkedin.com/in/priyasharma-dev',
      github: 'github.com/priyasharma',
      portfolio: 'priyasharma.dev'
    },
    summary: 'Versatile Full Stack Engineer with 5 years building scalable web apps with React, Node.js, TypeScript, and AWS. Passionate about clean architecture, CI/CD automation, and modern UX.',
    experienceYears: 5,
    education: ['Bachelor of Technology in Computer Science, IIT Hyderabad'],
    gpa: '8.85',
    skills: ['react', 'node.js', 'typescript', 'javascript', 'mongodb', 'docker', 'aws', 'rest api', 'tailwind css', 'git', 'ci/cd', 'redux'],
    status: 'Applied',
    createdAt: '2026-09-11'
  },
  {
    id: 'cand-2',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    phone: '+91 98765 43210',
    links: {
      linkedin: 'linkedin.com/in/rahul-verma-ai',
      github: 'github.com/rahul-v-nlp'
    },
    summary: 'Machine Learning & NLP Specialist with 3.5 years developing deep learning models, sentiment analysis, NER tokenizers, and fast Python APIs with spaCy, PyTorch, and FastAPI.',
    experienceYears: 3.5,
    education: ['Master of Technology in Artificial Intelligence, IIT Bombay', 'B.Tech in Computer Science, JNTU Hyderabad'],
    gpa: '9.02',
    skills: ['python', 'spacy', 'nlp', 'machine learning', 'pytorch', 'fastapi', 'scikit-learn', 'pandas', 'docker', 'transformers', 'data visualization'],
    status: 'Shortlisted',
    createdAt: '2026-09-13'
  },
  {
    id: 'cand-3',
    name: 'Arun Kumar',
    email: 'arun.kumar@example.com',
    phone: '+91 87654 32109',
    links: {
      linkedin: 'linkedin.com/in/arunkumar-devops',
      github: 'github.com/akumar-ops'
    },
    summary: 'DevOps & Cloud Engineer specializing in AWS multi-region infrastructure, Kubernetes cluster deployments, Terraform IaC, and zero-downtime CI/CD release pipelines.',
    experienceYears: 4,
    education: ['Bachelor of Engineering in Information Technology, Osmania University, Hyderabad'],
    gpa: '7.80',
    skills: ['aws', 'kubernetes', 'docker', 'terraform', 'ci/cd', 'linux', 'bash', 'prometheus', 'grafana', 'python', 'git'],
    status: 'Interview',
    createdAt: '2026-09-09'
  }
];

// Initial ATS Applications
const INITIAL_APPLICATIONS = [
  {
    id: 'app-1',
    jobId: 'job-1',
    candidateId: 'cand-1',
    candidateName: 'Priya Sharma',
    candidateEmail: 'priya.sharma@example.com',
    jobTitle: 'Senior Full Stack Engineer (React & Node.js)',
    overallMatchScore: 94,
    stage: 'Shortlisted',
    matchedSkills: ['react', 'node.js', 'typescript', 'mongodb', 'docker', 'rest api', 'aws', 'tailwind css'],
    missingSkills: ['redis', 'graphql'],
    experienceScore: 100,
    educationScore: 100,
    appliedDate: '2026-09-12',
    notes: 'Exceeded all technical requirements; outstanding open source portfolio.'
  },
  {
    id: 'app-2',
    jobId: 'job-2',
    candidateId: 'cand-2',
    candidateName: 'Rahul Verma',
    candidateEmail: 'rahul.verma@example.com',
    jobTitle: 'AI / NLP Machine Learning Engineer',
    overallMatchScore: 91,
    stage: 'Interview',
    matchedSkills: ['python', 'spacy', 'nlp', 'machine learning', 'pytorch', 'fastapi', 'transformers', 'docker'],
    missingSkills: ['elasticsearch'],
    experienceScore: 100,
    educationScore: 100,
    appliedDate: '2026-09-13',
    notes: 'M.Tech in AI from IIT Bombay, published work in conversational NLP.'
  },
  {
    id: 'app-3',
    jobId: 'job-3',
    candidateId: 'cand-3',
    candidateName: 'Arun Kumar',
    candidateEmail: 'arun.kumar@example.com',
    jobTitle: 'Cloud DevOps & Infrastructure Engineer',
    overallMatchScore: 89,
    stage: 'Interview',
    matchedSkills: ['aws', 'kubernetes', 'docker', 'terraform', 'ci/cd', 'linux', 'prometheus', 'grafana'],
    missingSkills: ['helm', 'ansible'],
    experienceScore: 100,
    educationScore: 90,
    appliedDate: '2026-09-10',
    notes: 'Strong AWS & Kubernetes production background.'
  }
];

// Initial Scheduled Interviews
const INITIAL_INTERVIEWS = [
  {
    id: 'int-1',
    applicationId: 'app-2',
    candidateName: 'Rahul Verma',
    jobTitle: 'AI / NLP Machine Learning Engineer',
    interviewer: 'Dr. Suresh Reddy (Head of AI & ML, Amazon)',
    date: '2026-09-20',
    time: '14:00',
    durationMinutes: 60,
    type: 'Technical & System Design',
    mode: 'Google Meet',
    meetingLink: 'https://meet.google.com/xyz-jobp-nlp',
    status: 'Scheduled',
    notes: 'Focus on transformer fine-tuning and real-time inference latency.'
  },
  {
    id: 'int-2',
    applicationId: 'app-3',
    candidateName: 'Arun Kumar',
    jobTitle: 'Cloud DevOps & Infrastructure Engineer',
    interviewer: 'Vikram Nair (Principal SRE, Cognizant)',
    date: '2026-09-22',
    time: '11:00',
    durationMinutes: 45,
    type: 'Technical Architecture Round',
    mode: 'Zoom',
    meetingLink: 'https://zoom.us/j/9876543210',
    status: 'Scheduled',
    notes: 'Evaluate Terraform modularization and multi-cluster ingress.'
  }
];

class DatabaseStore {
  constructor() {
    this.jobs = [...INITIAL_JOBS];
    this.candidates = [...INITIAL_CANDIDATES];
    this.applications = [...INITIAL_APPLICATIONS];
    this.interviews = [...INITIAL_INTERVIEWS];
    this.users = new Map();
    this.isMongoConnected = false;
  }

  // ─── Sync with MongoDB on Startup ─────────────────────────────────────────

  async syncFromMongoDB() {
    try {
      this.isMongoConnected = true;

      // 1. Sync Users
      const mongoUsers = await UserModel.find({}).lean();
      for (const u of mongoUsers) {
        this.users.set(u.email.toLowerCase(), {
          id: u.id || u._id.toString(),
          name: u.name || u.email.split('@')[0],
          email: u.email.toLowerCase(),
          role: u.role || 'candidate',
          passwordHash: u.passwordHash,
          createdAt: u.createdAt
        });
      }
      console.log(`👤 Synchronized ${this.users.size} user(s) from MongoDB`);

      // 2. Sync Jobs
      const mongoJobsCount = await JobModel.countDocuments();
      if (mongoJobsCount === 0) {
        // Seed initial jobs to MongoDB so Compass shows them
        await JobModel.insertMany(INITIAL_JOBS);
        console.log(`💼 Seeded ${INITIAL_JOBS.length} jobs into MongoDB`);
      } else {
        const mongoJobs = await JobModel.find({}).lean();
        this.jobs = mongoJobs.map(j => ({
          id: j.id || j._id.toString(),
          title: j.title,
          department: j.department || 'Engineering',
          location: typeof j.location === 'object' ? `${j.location.city || ''}, ${j.location.country || ''}`.trim() : (j.location || 'Remote'),
          type: j.type || j.employmentType || 'Full-time',
          minExperience: j.minExperience || 2,
          salaryRange: j.salaryRange || (j.salary ? `₹${j.salary.min} - ₹${j.salary.max}` : '₹12,00,000 - ₹18,00,000 LPA'),
          educationRequired: j.educationRequired || 'Bachelor Degree',
          description: j.description || '',
          requiredSkills: Array.isArray(j.requiredSkills) ? j.requiredSkills.map(s => typeof s === 'string' ? s : s.name) : [],
          preferredSkills: Array.isArray(j.preferredSkills) ? j.preferredSkills.map(s => typeof s === 'string' ? s : s.name) : [],
          status: j.status || 'Active',
          postedDate: j.postedDate || (j.postedAt ? new Date(j.postedAt).toISOString().split('T')[0] : '2026-09-15'),
          applicantsCount: j.applicantsCount || 0
        }));
        console.log(`💼 Loaded ${this.jobs.length} job(s) from MongoDB`);
      }

      // 3. Sync Applications
      const mongoAppsCount = await ApplicationModel.countDocuments();
      if (mongoAppsCount === 0) {
        await ApplicationModel.insertMany(INITIAL_APPLICATIONS);
      } else {
        const mongoApps = await ApplicationModel.find({}).lean();
        this.applications = mongoApps.map(a => ({
          id: a.id || a._id.toString(),
          jobId: a.jobId,
          candidateId: a.candidateId,
          candidateName: a.candidateName || 'Candidate',
          candidateEmail: a.candidateEmail || '',
          jobTitle: a.jobTitle || 'Position',
          overallMatchScore: a.overallMatchScore || 80,
          stage: a.stage || a.currentStage || 'Applied',
          matchedSkills: a.matchedSkills || [],
          missingSkills: a.missingSkills || [],
          experienceScore: a.experienceScore || 80,
          educationScore: a.educationScore || 85,
          appliedDate: a.appliedDate || new Date().toISOString().split('T')[0],
          notes: a.notes || ''
        }));
      }

      // 4. Sync Interviews
      const mongoIntsCount = await InterviewModel.countDocuments();
      if (mongoIntsCount === 0) {
        await InterviewModel.insertMany(INITIAL_INTERVIEWS);
      } else {
        const mongoInts = await InterviewModel.find({}).lean();
        this.interviews = mongoInts.map(i => ({
          id: i.id || i._id.toString(),
          applicationId: i.applicationId,
          candidateName: i.candidateName,
          jobTitle: i.jobTitle,
          interviewer: i.interviewer,
          date: i.date || (i.scheduledAt ? new Date(i.scheduledAt).toISOString().split('T')[0] : ''),
          time: i.time || '10:00',
          durationMinutes: i.durationMinutes || 45,
          type: i.type || i.interviewType || 'Technical',
          mode: i.mode || 'Google Meet',
          meetingLink: i.meetingLink || i.locationOrLink || '',
          status: i.status || 'Scheduled',
          notes: i.notes || ''
        }));
      }
    } catch (err) {
      console.error('Error syncing with MongoDB:', err);
    }
  }

  // ─── Users ────────────────────────────────────────────────────────────────

  async findUserByEmail(email) {
    const normalized = email.toLowerCase();
    // 1. Check in-memory first
    if (this.users.has(normalized)) {
      return this.users.get(normalized);
    }
    // 2. Query MongoDB if connected
    if (this.isMongoConnected) {
      try {
        const doc = await UserModel.findOne({ email: normalized }).lean();
        if (doc) {
          const u = {
            id: doc.id || doc._id.toString(),
            name: doc.name || doc.email.split('@')[0],
            email: doc.email.toLowerCase(),
            role: doc.role || 'candidate',
            passwordHash: doc.passwordHash,
            createdAt: doc.createdAt
          };
          this.users.set(normalized, u);
          return u;
        }
      } catch (err) {
        console.warn('MongoDB findUserByEmail fallback:', err.message);
      }
    }
    return undefined;
  }

  async createUser({ name, email, role, passwordHash }) {
    const id = `user-${uuidv4().slice(0, 8)}`;
    const user = {
      id,
      name,
      email: email.toLowerCase(),
      role,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    // Save in-memory
    this.users.set(user.email, user);

    // Save in MongoDB collection 'users'
    if (this.isMongoConnected) {
      try {
        await UserModel.create({
          id,
          name,
          email: user.email,
          role,
          passwordHash,
          status: 'active'
        });
        console.log(`✅ Saved user to MongoDB [jobportal > users]: ${user.email}`);
      } catch (err) {
        console.warn('MongoDB createUser save error:', err.message);
      }
    }

    return user;
  }

  // ─── Jobs ─────────────────────────────────────────────────────────────────

  getJobs() {
    return this.jobs;
  }

  getJobById(id) {
    return this.jobs.find(j => j.id === id);
  }

  async createJob(jobData) {
    const newJob = {
      id: `job-${uuidv4().slice(0, 8)}`,
      applicantsCount: 0,
      status: 'Active',
      postedDate: new Date().toISOString().split('T')[0],
      ...jobData
    };
    this.jobs.unshift(newJob);

    // Save in MongoDB collection 'jobs'
    if (this.isMongoConnected) {
      try {
        await JobModel.create(newJob);
        console.log(`✅ Saved job to MongoDB [jobportal > jobs]: ${newJob.title}`);
      } catch (err) {
        console.warn('MongoDB createJob save error:', err.message);
      }
    }

    return newJob;
  }

  updateJob(id, updates) {
    const idx = this.jobs.findIndex(j => j.id === id);
    if (idx === -1) return null;
    this.jobs[idx] = { ...this.jobs[idx], ...updates };

    if (this.isMongoConnected) {
      JobModel.updateOne({ id }, updates).catch(err => console.warn('MongoDB updateJob error:', err.message));
    }

    return this.jobs[idx];
  }

  // ─── Candidates ───────────────────────────────────────────────────────────

  getCandidates() {
    return this.candidates;
  }

  getCandidateById(id) {
    return this.candidates.find(c => c.id === id);
  }

  createCandidate(candData) {
    const newCand = {
      id: `cand-${uuidv4().slice(0, 8)}`,
      status: 'Applied',
      createdAt: new Date().toISOString().split('T')[0],
      ...candData
    };
    this.candidates.unshift(newCand);
    return newCand;
  }

  // ─── Resumes Collection Persistence ────────────────────────────────────────

  async saveResume({ originalname = 'resume.pdf', mimetype = 'application/pdf', parsedProfile, rawText = '', user = null }) {
    if (!parsedProfile) return null;

    const fileType = originalname.toLowerCase().endsWith('.docx') ? 'docx' : originalname.toLowerCase().endsWith('.txt') ? 'txt' : 'pdf';
    const candName = parsedProfile.name || user?.name || 'Varnika Komali';
    const candEmail = (parsedProfile.email || user?.email || 'varnikakomali@gmail.com').toLowerCase();
    const candPhone = parsedProfile.phone || user?.phone || '+91 98765 43210';
    const candYears = Number(parsedProfile.experienceYears || 4);

    // In-memory record update
    const memoryCandidate = {
      id: `cand-${uuidv4().slice(0, 8)}`,
      name: candName,
      email: candEmail,
      phone: candPhone,
      summary: parsedProfile.summary || '',
      experienceYears: candYears,
      education: parsedProfile.education || ['Bachelor of Science in Computer Science'],
      skills: parsedProfile.skills || [],
      status: 'Applied',
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.candidates.unshift(memoryCandidate);

    if (this.isMongoConnected) {
      try {
        // 1. Find or create candidate document in MongoDB [jobportal > candidates]
        let candidateDoc = await CandidateModel.findOne({ 
          $or: [{ email: candEmail }, { fullName: candName }]
        });

        const formattedSkills = (parsedProfile.skills || []).map(s => ({
          name: s,
          proficiency: 'intermediate',
          source: 'resume_parsed',
          confidence: 0.92
        }));

        const formattedEducation = (parsedProfile.education || []).map(deg => ({
          degree: deg,
          institution: 'Accredited University',
          field: 'Computer Science',
          startYear: 2019,
          endYear: 2023
        }));

        if (!candidateDoc) {
          candidateDoc = await CandidateModel.create({
            fullName: candName,
            email: candEmail,
            phone: candPhone,
            location: { city: 'Hyderabad', country: 'India' },
            headline: `${candName} — ${candYears} Yrs Exp`,
            summary: parsedProfile.summary || '',
            yearsExperience: candYears,
            currentTitle: parsedProfile.detectedRoles?.[0] || 'Software Engineer',
            openToWork: true,
            skills: formattedSkills,
            education: formattedEducation,
            experience: [
              {
                title: parsedProfile.detectedRoles?.[0] || 'Software Engineer',
                company: 'Technology Systems',
                startDate: '2022-06',
                endDate: null,
                description: parsedProfile.summary || ''
              }
            ]
          });
          console.log(`✅ Saved new candidate in MongoDB [jobportal > candidates]: ${candName}`);
        } else {
          candidateDoc.fullName = candName;
          candidateDoc.email = candEmail;
          candidateDoc.phone = candPhone;
          candidateDoc.summary = parsedProfile.summary || candidateDoc.summary;
          candidateDoc.yearsExperience = candYears;
          candidateDoc.skills = formattedSkills.length > 0 ? formattedSkills : candidateDoc.skills;
          candidateDoc.education = formattedEducation.length > 0 ? formattedEducation : candidateDoc.education;
          await candidateDoc.save();
          console.log(`✅ Updated existing candidate in MongoDB [jobportal > candidates]: ${candName}`);
        }

        // 2. Insert resume into MongoDB [jobportal > resumes] (matches Compass schema)
        const resumeDoc = await ResumeModel.create({
          candidateId: candidateDoc._id,
          fileUrl: `https://example-bucket.s3.amazonaws.com/resumes/${encodeURIComponent(originalname)}`,
          fileName: originalname,
          fileType,
          isPrimary: true,
          parseStatus: 'completed',
          rawText: rawText || parsedProfile.rawTextSnippet || '',
          parsedData: {
            parsedName: candName,
            parsedEmail: candEmail,
            parsedPhone: candPhone,
            summary: parsedProfile.summary || '',
            totalExperienceYears: candYears,
            totalExperienceMonths: Math.round(candYears * 12),
            nlpModelVersion: 'v1.0',
            skills: parsedProfile.skills || [],
            categorizedSkills: parsedProfile.categorizedSkills || {},
            education: parsedProfile.education || [],
            gpa: parsedProfile.gpa || '',
            detectedRoles: parsedProfile.detectedRoles || [],
            certifications: [],
            languages: ['English']
          },
          parsedAt: new Date()
        });

        // 3. Link primaryResumeId to candidate
        candidateDoc.primaryResumeId = resumeDoc._id;
        await candidateDoc.save();

        console.log(`📄 Saved resume to MongoDB [jobportal > resumes]: ${resumeDoc._id} (${originalname})`);
        return { resumeDoc, candidateDoc };
      } catch (err) {
        console.error('MongoDB saveResume error:', err.message);
      }
    }

    return { resumeDoc: null, candidateDoc: memoryCandidate };
  }


  // ─── Applications ─────────────────────────────────────────────────────────

  getApplications() {
    return this.applications;
  }

  async createApplication(appData) {
    const newApp = {
      id: `app-${uuidv4().slice(0, 8)}`,
      stage: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      ...appData
    };
    this.applications.unshift(newApp);

    // Increment applicantsCount on the job
    const job = this.getJobById(newApp.jobId);
    if (job) {
      job.applicantsCount = (job.applicantsCount || 0) + 1;
    }

    // Save to MongoDB collection 'applications'
    if (this.isMongoConnected) {
      try {
        await ApplicationModel.create(newApp);
        console.log(`✅ Saved application to MongoDB [jobportal > applications]: ${newApp.candidateName}`);
      } catch (err) {
        console.warn('MongoDB createApplication save error:', err.message);
      }
    }

    return newApp;
  }

  updateApplicationStage(id, newStage, notes = '') {
    const app = this.applications.find(a => a.id === id);
    if (!app) return null;
    app.stage = newStage;
    if (notes) app.notes = notes;

    if (this.isMongoConnected) {
      ApplicationModel.updateOne({ id }, { stage: newStage, notes }).catch(err => console.warn('MongoDB stage update error:', err.message));
    }

    return app;
  }

  // ─── Interviews ───────────────────────────────────────────────────────────

  getInterviews() {
    return this.interviews;
  }

  async createInterview(interviewData) {
    const newInt = {
      id: `int-${uuidv4().slice(0, 8)}`,
      status: 'Scheduled',
      ...interviewData
    };
    this.interviews.unshift(newInt);

    if (newInt.applicationId) {
      const app = this.applications.find(a => a.id === newInt.applicationId);
      if (app && app.stage !== 'Interview') {
        app.stage = 'Interview';
        if (this.isMongoConnected) {
          ApplicationModel.updateOne({ id: newInt.applicationId }, { stage: 'Interview' }).catch(() => {});
        }
      }
    }

    if (this.isMongoConnected) {
      try {
        await InterviewModel.create(newInt);
        console.log(`✅ Saved interview to MongoDB [jobportal > interviews]: ${newInt.candidateName}`);
      } catch (err) {
        console.warn('MongoDB createInterview save error:', err.message);
      }
    }

    return newInt;
  }

  updateInterview(id, updates) {
    const idx = this.interviews.findIndex(i => i.id === id);
    if (idx === -1) return null;
    this.interviews[idx] = { ...this.interviews[idx], ...updates };

    if (this.isMongoConnected) {
      InterviewModel.updateOne({ id }, updates).catch(err => console.warn('MongoDB updateInterview error:', err.message));
    }

    return this.interviews[idx];
  }
}

export const db = new DatabaseStore();

/**
 * connectDB — Connect to MongoDB using Mongoose and sync store.
 */
export async function connectDB() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobportal';
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log(`🍃 Connected to MongoDB successfully at: ${mongoUri}`);
    await db.syncFromMongoDB();
  } catch (err) {
    console.warn(`⚠️ MongoDB connection warning (${err.message}). Using resilient in-memory store.`);
  }
}
