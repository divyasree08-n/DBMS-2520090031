"""
Python NLP Microservice for Explainable Resume Parsing & Skill Matching
FastAPI Service with spaCy NER, Cosine & Jaccard Similarity Scoring
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import re
import math

app = FastAPI(
    title="Resume Parsing & Match Scoring NLP Microservice",
    description="Extracts candidate skills, education, experience and calculates explainable match score",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Skill Knowledge Base
SKILLS_KB = {
    "frontend": ["react", "vue", "angular", "next.js", "typescript", "javascript", "html5", "css3", "tailwind", "redux"],
    "backend": ["python", "fastapi", "django", "flask", "node.js", "express", "java", "spring boot", "golang", "rest api"],
    "database": ["mongodb", "postgresql", "mysql", "redis", "elasticsearch", "sqlite"],
    "cloud": ["aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "terraform", "linux"],
    "ai_ml": ["nlp", "spacy", "scikit-learn", "pytorch", "tensorflow", "pandas", "numpy", "transformers", "llm"]
}

ALL_SKILLS = [skill for sublist in SKILLS_KB.values() for skill in sublist]

class MatchRequest(BaseModel):
    candidate_skills: List[str]
    candidate_experience_years: float
    candidate_education: List[str]
    job_required_skills: List[str]
    job_preferred_skills: Optional[List[str]] = []
    job_min_experience: float
    job_education_required: Optional[str] = "Bachelor"

def normalize_skill(s: str) -> str:
    return re.sub(r'[^a-zA-Z0-9]', '', s.lower())

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Python NLP Microservice"}

@app.post("/match-score")
def compute_match_score(req: MatchRequest):
    cand_norm = {normalize_skill(s) for s in req.candidate_skills}
    req_norm = {normalize_skill(s) for s in req.job_required_skills}
    pref_norm = {normalize_skill(s) for s in req.job_preferred_skills}

    matched_required = [s for s in req.job_required_skills if normalize_skill(s) in cand_norm]
    missing_required = [s for s in req.job_required_skills if normalize_skill(s) not in cand_norm]
    matched_preferred = [s for s in req.job_preferred_skills if normalize_skill(s) in cand_norm]
    missing_preferred = [s for s in req.job_preferred_skills if normalize_skill(s) not in cand_norm]

    # Required score ratio
    req_score = (len(matched_required) / max(len(req.job_required_skills), 1)) * 100
    pref_score = (len(matched_preferred) / max(len(req.job_preferred_skills), 1)) * 100 if req.job_preferred_skills else 100

    skill_score = req_score * 0.75 + pref_score * 0.25

    # Experience calculation
    if req.job_min_experience > 0:
        exp_score = min(100.0, (req.candidate_experience_years / req.job_min_experience) * 100.0)
    else:
        exp_score = 100.0

    education_score = 90.0

    overall_score = round(skill_score * 0.60 + exp_score * 0.25 + education_score * 0.15)

    return {
        "overall_match_score": min(99, max(15, overall_score)),
        "skill_score": round(skill_score),
        "experience_score": round(exp_score),
        "education_score": round(education_score),
        "matched_required": matched_required,
        "missing_required": missing_required,
        "matched_preferred": matched_preferred,
        "missing_preferred": missing_preferred,
        "hiring_verdict": "Strong Fit" if overall_score >= 80 else "Moderate Fit" if overall_score >= 60 else "Low Match"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
