# Python NLP Microservice

Microservice for Resume Parsing and Explainable Skill Matching using FastAPI, spaCy, and scikit-learn.

## Setup Instructions

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   ```

3. Run the microservice:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

The service runs on `http://localhost:8000` with interactive Swagger docs at `http://localhost:8000/docs`.

*Note: The Node.js Express backend already includes an integrated NLP extraction and explainable matching engine that runs out of the box with zero setup. When this microservice is launched, Express will automatically coordinate with it.*
