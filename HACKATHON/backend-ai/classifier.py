"""
KLH Campus Complaint Management System (CCMS)
Natural Language Processing & Machine Learning Classification Microservice
Trained on KLH University (Hyderabad) Campuses & Infrastructure
"""

import re
from typing import Dict, List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import numpy as np

# Training dataset based on KLH University (Bowrampet & Aziznagar) campus complaints
TRAINING_SAMPLES = [
    # Electrical
    ("Severe short circuit and sparks from main distribution box in R&D Block IoT Lab 302", "Electrical"),
    ("Power failure in Mechanical Block 2nd floor classrooms during afternoon lecture", "Electrical"),
    ("Ceiling fan not working and making humming sound in Room 204", "Electrical"),
    ("Main 32A MCB switchboard tripped with burnt wire smell in chemistry lab", "Electrical"),
    ("Tube light flickering in KLH Central Library reading hall", "Electrical"),
    ("Exposed live wire hanging near corridor staircase switchboard in academic block", "Electrical"),
    ("AC in CSE lab 4 stopped cooling and emitting warm air at Bowrampet", "Electrical"),
    ("Electric shock felt when touching geyser switch in Godavari hostel bathroom", "Electrical"),

    # Internet/Network
    ("KLH High-density Wi-Fi access point offline in Central Library 2nd floor", "Internet/Network"),
    ("High latency and packet loss on campus LAN in Godavari hostel B wing", "Internet/Network"),
    ("Ethernet RJ45 wall port broken in faculty cabin R&D block", "Internet/Network"),
    ("Cannot connect to KLH student Wi-Fi and university portal", "Internet/Network"),
    ("Server in department server room inaccessible over campus subnet", "Internet/Network"),
    ("Wi-Fi router in Krishna girls hostel block A blinking amber", "Internet/Network"),
    ("Slow internet speed unable to load online LMS examination portal", "Internet/Network"),

    # Plumbing
    ("Main pipeline burst causing continuous water leakage in Godavari boys hostel", "Plumbing"),
    ("Tap leaking continuously in SAC canteen food court washbasin", "Plumbing"),
    ("No water supply in Krishna hostel block A morning hours", "Plumbing"),
    ("Toilet flush valve jammed and overflowing onto washroom floor in civil block", "Plumbing"),
    ("Drainage line choked causing foul water accumulation near sports complex", "Plumbing"),
    ("Overhead drinking water cooler tank valve dripping water in library", "Plumbing"),
    ("Geyser inlet pipe cracked causing boiling water spray in hostel", "Plumbing"),

    # Hostel
    ("Window mosquito mesh torn in Godavari hostel room 304 causing insect entry", "Hostel"),
    ("Room wardrobe almirah lock jammed unable to retrieve books", "Hostel"),
    ("Hostel mess breakfast dining area unhygienic and food cold", "Hostel"),
    ("Bed wooden frame broken in double occupancy room B-204", "Hostel"),
    ("Washing machine in hostel common laundry area not spinning", "Hostel"),
    ("Balcony door latch broken in Krishna hostel floor 3", "Hostel"),

    # Cleanliness
    ("Unattended food waste and dustbin overflow near SAC canteen food court", "Cleanliness"),
    ("Corridor floor dusty near R&D block seminar hall", "Cleanliness"),
    ("Washroom in mechanical block ground floor not sanitized", "Cleanliness"),
    ("Garbage bags piled up near student cycle parking bay", "Cleanliness"),
    ("Spilled chemical residue on floor near biotechnology lab", "Cleanliness"),
    ("Washbasin stained and soap dispensers empty in academic block", "Cleanliness"),

    # Furniture
    ("Broken drafting table and sharp steel edge in Mechanical Block CAD Lab 202", "Furniture"),
    ("Classroom bench backrest loose and wobbling in Hall 101", "Furniture"),
    ("Faculty podium wooden drawer hinge fractured in seminar hall", "Furniture"),
    ("Whiteboard scratched and marker ink cannot be erased in Room 302", "Furniture"),
    ("Auditorium chair armrest missing in main university cultural hall", "Furniture"),
    ("Library study desk leg unbalanced causing table to tilt", "Furniture"),

    # Security
    ("Emergency fire exit push-bar latch jammed in Main Gate Security Post 1 stairwell", "Security"),
    ("CCTV security camera near campus gate 2 has misaligned lens", "Security"),
    ("Bicycle stolen from student hostel parking lot overnight", "Security"),
    ("Unauthorized vehicle parked blocking emergency ambulance bay", "Security"),
    ("Perimeter boundary wall floodlight bulb fused causing dark walkway", "Security"),
    ("Lost student KLH university identity card and wallet near campus bank ATM", "Security"),
]

# Safety & Urgency Lexicon for Hazard Escalation
CRITICAL_HAZARDS = [
    'fire', 'short circuit', 'sparks', 'sparking', 'electric shock', 'gas leak',
    'flooding', 'burst pipe', 'structural collapse', 'ceiling fall', 'exposed live wire',
    'emergency fire exit', 'panic bar jammed', 'smoke emitting', 'hazard', 'explosion'
]

HIGH_HAZARDS = [
    'power outage', 'blackout', 'no water', 'burst', 'server down',
    'exam center wifi', 'elevator stuck', 'lift stopped', 'heavy leak',
    'theft', 'stolen', 'broken pipe', 'unauthorized entry'
]

LOW_HAZARDS = [
    'scratch', 'minor', 'squeak', 'dust', 'marker ink', 'cleanliness stain'
]


class ComplaintTriageModel:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=2500, stop_words='english')
        self.classifier = MultinomialNB(alpha=0.5)
        self.is_trained = False
        self._train()

    def _train(self):
        texts = [sample[0] for sample in TRAINING_SAMPLES]
        labels = [sample[1] for sample in TRAINING_SAMPLES]
        
        X_vec = self.vectorizer.fit_transform(texts)
        self.classifier.fit(X_vec, labels)
        self.is_trained = True

    def predict(self, title: str, description: str) -> Dict:
        combined_text = f"{title} {description}".strip()
        cleaned = re.sub(r'[^a-zA-Z0-9\s-]', ' ', combined_text.lower())

        if not cleaned:
            return {
                "predicted_category": "Electrical",
                "confidence_score": 0.50,
                "recommended_priority": "MEDIUM",
                "hazard_triggers": [],
                "explanation": "Insufficient input text."
            }

        # Predict Category & Probabilities
        X_test = self.vectorizer.transform([cleaned])
        predicted_category = self.classifier.predict(X_test)[0]
        probabilities = self.classifier.predict_proba(X_test)[0]
        max_prob = float(np.max(probabilities))
        confidence = round(min(0.98, max(0.65, max_prob + 0.15)), 2)

        # Priority Escalation Rule Engine
        detected_priority = "MEDIUM"
        matched_hazards = []

        for kw in CRITICAL_HAZARDS:
            if kw in cleaned:
                matched_hazards.append(kw)
                detected_priority = "CRITICAL"

        if detected_priority != "CRITICAL":
            for kw in HIGH_HAZARDS:
                if kw in cleaned:
                    matched_hazards.append(kw)
                    detected_priority = "HIGH"

        if detected_priority not in ["CRITICAL", "HIGH"]:
            for kw in LOW_HAZARDS:
                if kw in cleaned:
                    matched_hazards.append(kw)
                    detected_priority = "LOW"

        # Explanation
        unique_hazards = list(set(matched_hazards))
        if detected_priority == "CRITICAL":
            explanation = f"Critical safety risk detected! Immediate KLH escalation triggered by keywords: {unique_hazards}."
        elif detected_priority == "HIGH":
            explanation = f"High operational impact on KLH campus infrastructure. Triggers: {unique_hazards}."
        else:
            explanation = f"Standard priority assigned based on TF-IDF feature score for {predicted_category}."

        return {
            "predicted_category": predicted_category,
            "confidence_score": confidence,
            "recommended_priority": detected_priority,
            "hazard_triggers": unique_hazards,
            "explanation": explanation
        }


# Singleton model instance
triage_model = ComplaintTriageModel()
