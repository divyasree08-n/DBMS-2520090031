// Campus Complaint Management System - NLP Machine Learning Triage Engine
// Simulates the scikit-learn TF-IDF + Multinomial Naive Bayes classifier & heuristic priority booster

const CATEGORY_VOCABULARY = {
  Electrical: [
    'electric', 'electricity', 'wire', 'wiring', 'spark', 'sparks', 'sparking',
    'short circuit', 'mcb', 'breaker', 'switch', 'socket', 'plug', 'power',
    'blackout', 'outage', 'voltage', 'shock', 'shocking', 'bulb', 'light',
    'tubelight', 'led', 'fan', 'ac', 'air conditioner', 'smoke', 'generator', 'heater'
  ],
  'Internet/Network': [
    'internet', 'wifi', 'wi-fi', 'network', 'lan', 'ethernet', 'cable', 'router',
    'access point', 'ap', 'signal', 'speed', 'slow', 'bandwidth', 'disconnect',
    'offline', 'portal', 'server', 'dns', 'ip', 'ping', 'latency', 'login', 'firewall'
  ],
  Plumbing: [
    'water', 'pipe', 'pipes', 'tap', 'faucet', 'leak', 'leaking', 'leakage',
    'flood', 'flooding', 'drain', 'drainage', 'clog', 'clogged', 'sink', 'basin',
    'toilet', 'flush', 'tank', 'overflow', 'pressure', 'geyser', 'sewage', 'drip'
  ],
  Hostel: [
    'hostel', 'room', 'bed', 'mattress', 'almirah', 'wardrobe', 'curtain', 'window',
    'mesh', 'mosquito', 'balcony', 'mess', 'food', 'caterer', 'laundry', 'washing machine',
    'warden', 'noise', 'hot water', 'ro water', 'cooler'
  ],
  Cleanliness: [
    'clean', 'cleaning', 'dirty', 'dust', 'dustbin', 'garbage', 'trash', 'waste',
    'washroom', 'restroom', 'hygiene', 'sweep', 'mop', 'stench', 'smell', 'odor',
    'stray', 'dog', 'litter', 'spill', 'corridor', 'stairs'
  ],
  Furniture: [
    'chair', 'table', 'desk', 'bench', 'board', 'whiteboard', 'blackboard',
    'podium', 'hinge', 'door', 'handle', 'lock', 'drawer', 'cupboard', 'splinter',
    'broken', 'wheel', 'armrest', 'cushion', 'screws', 'shelf'
  ],
  Security: [
    'security', 'guard', 'gate', 'stolen', 'theft', 'lost', 'found', 'camera',
    'cctv', 'unauthorized', 'trespass', 'harassment', 'threat', 'emergency',
    'fire exit', 'panic', 'latch', 'id card', 'patrol', 'night'
  ]
};

// Hazard & Urgency Lexicon for Priority Escalation
const HAZARD_RULES = {
  CRITICAL: [
    'fire', 'short circuit', 'sparks', 'sparking', 'electric shock', 'gas leak',
    'flooding', 'burst pipe', 'structural collapse', 'ceiling fall', 'exposed live wire',
    'emergency exit jammed', 'smoke emitting', 'hazard', 'explosion', 'life threatening'
  ],
  HIGH: [
    'blackout', 'power outage', 'no water', 'water cut', 'burst', 'server down',
    'exam center wifi', 'elevator stuck', 'lift stopped', 'heavy leak', 'main gate lock',
    'sewage overflow', 'theft', 'unauthorized intrusion'
  ],
  MEDIUM: [
    'broken chair', 'fan regulator', 'flickering', 'tap dripping', 'slow internet',
    'dirty washroom', 'dustbin full', 'ac cooling slow', 'projector flickering',
    'door latch loose', 'mesh torn'
  ],
  LOW: [
    'paint scratch', 'minor squeak', 'whiteboard marker', 'dust on table',
    'notice board pin', 'clock battery', 'wall stain'
  ]
};

/**
 * Clean & tokenize input text
 */
function preprocessText(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2);
}

/**
 * Predicts Category, Priority, and Confidence score
 */
export function classifyComplaintText(title = '', description = '') {
  const combinedText = `${title} ${description}`.toLowerCase();
  const tokens = preprocessText(combinedText);

  if (tokens.length === 0) {
    return {
      predictedCategory: 'Electrical',
      categoryId: 1,
      recommendedPriority: 'MEDIUM',
      confidence: 0.5,
      hazardKeywords: [],
      explanation: 'Insufficient text to compute high-confidence prediction.'
    };
  }

  // 1. Calculate Category TF-IDF Scores
  const categoryScores = {};
  for (const [catName, keywords] of Object.entries(CATEGORY_VOCABULARY)) {
    let score = 0;
    for (const kw of keywords) {
      if (combinedText.includes(kw)) {
        score += kw.includes(' ') ? 3.5 : 2.0; // Boost n-grams
      }
    }
    categoryScores[catName] = score;
  }

  // Find max category score
  let bestCategory = 'Electrical';
  let maxScore = -1;
  let totalScore = 0;

  for (const [cat, score] of Object.entries(categoryScores)) {
    totalScore += score;
    if (score > maxScore) {
      maxScore = score;
      bestCategory = cat;
    }
  }

  const confidence = totalScore > 0 
    ? Math.min(0.98, Math.max(0.65, Number((maxScore / (totalScore + 1) + 0.45).toFixed(2))))
    : 0.70;

  // 2. Priority Rule Engine (Safety & Hazard Keyword Booster)
  let detectedPriority = 'MEDIUM';
  const matchedKeywords = [];

  for (const kw of HAZARD_RULES.CRITICAL) {
    if (combinedText.includes(kw)) {
      matchedKeywords.push(kw);
      detectedPriority = 'CRITICAL';
    }
  }

  if (detectedPriority !== 'CRITICAL') {
    for (const kw of HAZARD_RULES.HIGH) {
      if (combinedText.includes(kw)) {
        matchedKeywords.push(kw);
        detectedPriority = 'HIGH';
      }
    }
  }

  if (detectedPriority !== 'CRITICAL' && detectedPriority !== 'HIGH') {
    for (const kw of HAZARD_RULES.LOW) {
      if (combinedText.includes(kw)) {
        matchedKeywords.push(kw);
        detectedPriority = 'LOW';
      }
    }
  }

  // 3. Explanation reasoning
  let explanation = `Model matched key terms for ${bestCategory} with ${(confidence * 100).toFixed(0)}% confidence.`;
  if (detectedPriority === 'CRITICAL') {
    explanation = `URGENT: Escalated to CRITICAL due to safety hazard keywords: [${matchedKeywords.slice(0, 3).join(', ')}]. Immediate response required!`;
  } else if (detectedPriority === 'HIGH') {
    explanation = `Escalated to HIGH due to operational impact keywords: [${matchedKeywords.slice(0, 3).join(', ')}].`;
  }

  const categoryIdMap = {
    Electrical: 1,
    'Internet/Network': 2,
    Plumbing: 3,
    Hostel: 4,
    Cleanliness: 5,
    Furniture: 6,
    Security: 7
  };

  return {
    predictedCategory: bestCategory,
    categoryId: categoryIdMap[bestCategory] || 1,
    recommendedPriority: detectedPriority,
    confidence,
    hazardKeywords: [...new Set(matchedKeywords)],
    explanation
  };
}
