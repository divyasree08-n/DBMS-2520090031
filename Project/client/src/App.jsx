import React, { useState, useEffect } from 'react';
import Layout from './pages/Layout.jsx';
import CandidateDashboard from './pages/CandidateDashboard.jsx';
import ResumeUpload from './pages/ResumeUpload.jsx';
import JobSearch from './pages/JobSearch.jsx';
import CandidateMatches from './pages/CandidateMatches.jsx';
import Applications from './pages/Applications.jsx';
import CandidateProfile from './pages/CandidateProfile.jsx';
import RecruiterDashboard from './pages/RecruiterDashboard.jsx';
import ATSBoard from './pages/ATSBoard.jsx';
import PostJob from './pages/PostJob.jsx';
import ComponentsShowcase from './components/ComponentsShowcase.jsx';
import AuthPage from './components/AuthPage.jsx';
import InterviewSchedulerModal from './components/InterviewSchedulerModal.jsx';
import { calculateExplainableMatch } from './services/clientMatcher.js';

const API_BASE_URL = '';

export default function App() {
  // Navigation & User State (Loaded from localStorage if logged in)
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const savedUser = localStorage.getItem('recruitai_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        return u.role === 'recruiter' ? 'recruiterDashboard' : 'jobSearch';
      }
      return 'jobSearch';
    } catch {
      return 'jobSearch';
    }
  });
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('recruitai_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [apiHealthy, setApiHealthy] = useState(false);

  // Application Data States
  const [jobs, setJobs] = useState([]);
  const [candidateProfile, setCandidateProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('recruitai_profile');
      if (saved) return JSON.parse(saved);
      const savedUser = localStorage.getItem('recruitai_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        return {
          name: u.name,
          email: u.email,
          phone: u.phone || '+91 98765 43210',
          summary: `${u.name} — Software professional with technical expertise in systems development.`,
          experienceYears: 4,
          education: ['Bachelor of Science in Computer Science'],
          skills: ['react', 'node.js', 'typescript', 'javascript', 'mongodb', 'docker', 'rest api', 'tailwind css']
        };
      }
      return null;
    } catch {
      return null;
    }
  });

  const [jobMatches, setJobMatches] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());


  // Interview Modals
  const [activeInterviewApp, setActiveInterviewApp] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);


  // Enforce strict role-based page navigation
  useEffect(() => {
    if (user?.role === 'candidate') {
      const recruiterPages = ['recruiterDashboard', 'atsBoard', 'postJob'];
      if (recruiterPages.includes(currentPage)) {
        setCurrentPage('candidateDashboard');
      }
    } else if (user?.role === 'recruiter') {
      const candidatePages = ['resumeUpload', 'candidateProfile'];
      if (candidatePages.includes(currentPage)) {
        setCurrentPage('recruiterDashboard');
      }
    }
  }, [user, currentPage]);

  // Fetch initial data from Express backend
  const fetchAllData = async () => {
    try {
      // 1. Health check
      try {
        const healthRes = await fetch(`${API_BASE_URL}/api/health`);
        if (healthRes.ok) setApiHealthy(true);
      } catch {
        // Direct fallback
        const healthRes = await fetch('http://127.0.0.1:5000/api/health');
        if (healthRes.ok) setApiHealthy(true);
      }

      // 2. Fetch Jobs
      const jobsRes = await fetch(`${API_BASE_URL}/api/jobs`);
      const jobsJson = await jobsRes.json();
      if (jobsJson.success) setJobs(jobsJson.data);

      // 3. Fetch Applications
      const appsRes = await fetch(`${API_BASE_URL}/api/ats/applications`);
      const appsJson = await appsRes.json();
      if (appsJson.success) {
        setApplications(appsJson.data);
        setAppliedJobIds(new Set(appsJson.data.map(a => a.jobId)));
      }

      // 4. Fetch Interviews
      const intRes = await fetch(`${API_BASE_URL}/api/interviews`);
      const intJson = await intRes.json();
      if (intJson.success) setInterviews(intJson.data);

      // 5. Generate dynamic job matches if candidate profile exists
      if (candidateProfile && jobsJson.data) {
        const matches = jobsJson.data.map(job => {
          const matchReport = calculateExplainableMatch(candidateProfile, job);
          return { job, matchReport };
        }).sort((a, b) => b.matchReport.overallMatchScore - a.matchReport.overallMatchScore);
        setJobMatches(matches);
      }
    } catch (err) {
      console.warn('Backend connection fallback:', err.message);
      setApiHealthy(false);
    }
  };


  useEffect(() => {
    fetchAllData();
  }, []);

  // Handle Candidate Applying to a Job
  const handleApplyJob = async (job, matchReport) => {
    try {
      const payload = {
        jobId: job.id,
        candidateName: candidateProfile?.name || user?.name,
        candidateEmail: candidateProfile?.email || user?.email,
        jobTitle: job.title,
        overallMatchScore: matchReport?.overallMatchScore || 80,
        matchedSkills: matchReport?.skills?.allMatched || [],
        missingSkills: matchReport?.skills?.allMissing || [],
        experienceScore: matchReport?.breakdown?.experienceScore || 90,
        educationScore: matchReport?.breakdown?.educationScore || 90
      };

      const res = await fetch(`${API_BASE_URL}/api/ats/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setApplications(prev => [json.data, ...prev]);
        setAppliedJobIds(prev => new Set([...prev, job.id]));
      }
    } catch (err) {
      console.error('Error applying to job:', err);
    }
  };

  // Handle Recruiter Changing ATS Stage
  const handleUpdateStage = async (appId, newStage) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/ats/applications/${appId}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage })
      });
      const json = await res.json();
      if (json.success) {
        setApplications(prev => prev.map(a => a.id === appId ? json.data : a));
      }
    } catch (err) {
      console.error('Error updating stage:', err);
    }
  };

  // Handle Recruiter Scheduling Interview
  const handleScheduleInterview = async (interviewPayload) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/interviews/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interviewPayload)
      });
      const json = await res.json();
      if (json.success) {
        setInterviews(prev => [json.data, ...prev]);
        // Also update local application stage to Interview
        if (interviewPayload.applicationId) {
          setApplications(prev => prev.map(a => 
            a.id === interviewPayload.applicationId ? { ...a, stage: 'Interview' } : a
          ));
        }
      }
    } catch (err) {
      console.error('Error scheduling interview:', err);
    }
  };

  // Handle Recruiter Creating New Job
  const handleCreateJob = async (jobData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      const json = await res.json();
      if (json.success) {
        setJobs(prev => [json.data, ...prev]);
        fetchAllData();
      }
    } catch (err) {
      console.error('Error creating job:', err);
    }
  };

  const openScheduleModalForApp = (app) => {
    setActiveInterviewApp(app);
    setIsScheduleModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('recruitai_token');
    localStorage.removeItem('recruitai_user');
    localStorage.removeItem('recruitai_profile');
    setUser(null);
    setIsAuthOpen(true);
  };

  return (
    <Layout
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      user={user}
      onLogout={handleLogout}
      onOpenAuth={() => setIsAuthOpen(true)}
      apiHealthy={apiHealthy}
      stats={{ jobsCount: jobs.length, appsCount: applications.length }}
    >
      {/* 1. Candidate Dashboard */}
      {currentPage === 'candidateDashboard' && (
        <CandidateDashboard
          user={user}
          candidateProfile={candidateProfile}
          jobMatches={jobMatches}
          applications={applications}
          setCurrentPage={setCurrentPage}
          onOpenExplainMatch={(job) => {
            setCurrentPage('jobSearch');
          }}
        />
      )}

      {/* 2. Resume Uploader & Live Parser */}
      {currentPage === 'resumeUpload' && (
        <ResumeUpload
          candidateProfile={candidateProfile}
          setCandidateProfile={setCandidateProfile}
          setJobMatches={setJobMatches}
          setCurrentPage={setCurrentPage}
          apiBaseUrl={API_BASE_URL}
        />
      )}

      {/* 3. Job Search & Explainable Match Explorer */}
      {currentPage === 'jobSearch' && (
        <JobSearch
          jobs={jobs}
          jobMatches={jobMatches}
          candidateProfile={candidateProfile}
          onApplyJob={handleApplyJob}
          appliedJobIds={appliedJobIds}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* 4. Ranked Candidate-Job Matches Matrix */}
      {currentPage === 'candidateMatches' && (
        <CandidateMatches
          jobs={jobs}
          jobMatches={jobMatches}
          candidateProfile={candidateProfile}
          onApplyJob={handleApplyJob}
          appliedJobIds={appliedJobIds}
          setCurrentPage={setCurrentPage}
          user={user}
          onScheduleInterview={openScheduleModalForApp}
        />
      )}

      {/* 5. Applications Pipeline & Interview Invites */}
      {currentPage === 'applications' && (
        <Applications
          applications={applications}
          interviews={interviews}
          setCurrentPage={setCurrentPage}
          user={user}
        />
      )}

      {/* 6. Candidate Profile Manager */}
      {currentPage === 'candidateProfile' && (
        <CandidateProfile
          candidateProfile={candidateProfile}
          setCandidateProfile={setCandidateProfile}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* 7. Recruiter Dashboard & Visual Analytics */}
      {currentPage === 'recruiterDashboard' && (
        <RecruiterDashboard
          jobs={jobs}
          applications={applications}
          interviews={interviews}
          setCurrentPage={setCurrentPage}
          onOpenNewJobModal={() => setCurrentPage('postJob')}
          onOpenScheduleModal={openScheduleModalForApp}
          apiBaseUrl={API_BASE_URL}
        />
      )}

      {/* 8. Recruiter ATS Kanban Board */}
      {currentPage === 'atsBoard' && (
        <ATSBoard
          applications={applications}
          onUpdateStage={handleUpdateStage}
          onOpenScheduleModal={openScheduleModalForApp}
        />
      )}

      {/* 9. Recruiter Post New Job */}
      {currentPage === 'postJob' && (
        <PostJob
          onCreateJob={handleCreateJob}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* 10. Components Showcase Section (Specifically requested) */}
      {currentPage === 'componentsShowcase' && (
        <ComponentsShowcase />
      )}

      {/* Auth Modal */}
      {isAuthOpen && (
        <AuthPage
          onLogin={(loggedInUser) => {
            setUser(loggedInUser);
            setIsAuthOpen(false);
            if (loggedInUser.role === 'recruiter') {
              setCurrentPage('recruiterDashboard');
            } else {
              setCurrentPage('candidateDashboard');
            }
          }}
          onClose={() => setIsAuthOpen(false)}
        />
      )}

      {/* Interview Scheduler Modal */}
      {isScheduleModalOpen && activeInterviewApp && (
        <InterviewSchedulerModal
          application={activeInterviewApp}
          onClose={() => {
            setIsScheduleModalOpen(false);
            setActiveInterviewApp(null);
          }}
          onSchedule={handleScheduleInterview}
        />
      )}
    </Layout>
  );
}
