"""
Campus Complaint Management System (CCMS)
FastAPI Machine Learning REST Microservice
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from classifier import triage_model

# Indian Standard Time (IST) Zone: UTC+05:30
IST = timezone(timedelta(hours=5, minutes=30))

app = FastAPI(
    title="CCMS Intelligent AI Microservice",
    description="NLP-based category prediction and hazard priority escalation for Indian University Campuses",
    version="1.0.0"
)

# Enable CORS for frontend and Spring Boot backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ClassifyRequest(BaseModel):
    title: str = Field(..., min_length=3, description="Complaint title")
    description: str = Field(..., min_length=5, description="Detailed problem description")
    location: Optional[str] = Field(None, description="Campus location or room")


class ClassifyResponse(BaseModel):
    predicted_category: str
    confidence_score: float
    recommended_priority: str
    hazard_triggers: List[str]
    explanation: str
    timestamp_ist: str


@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "CCMS Intelligent Triage Microservice",
        "model": "TF-IDF + Multinomial Naive Bayes",
        "timezone": "Asia/Kolkata (IST)",
        "current_time_ist": datetime.now(IST).strftime("%d %b %Y, %I:%M %p IST")
    }


@app.post("/api/v1/ml/classify", response_model=ClassifyResponse)
def classify_complaint(request: ClassifyRequest):
    try:
        prediction = triage_model.predict(request.title, request.description)
        timestamp_ist = datetime.now(IST).strftime("%d %b %Y, %I:%M %p IST")

        return ClassifyResponse(
            predicted_category=prediction["predicted_category"],
            confidence_score=prediction["confidence_score"],
            recommended_priority=prediction["recommended_priority"],
            hazard_triggers=prediction["hazard_triggers"],
            explanation=prediction["explanation"],
            timestamp_ist=timestamp_ist
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML Triage Error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
