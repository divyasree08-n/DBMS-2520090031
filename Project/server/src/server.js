import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jobsRouter from './routes/jobs.js';
import resumesRouter from './routes/resumes.js';
import atsRouter from './routes/ats.js';
import interviewsRouter from './routes/interviews.js';
import analyticsRouter from './routes/analytics.js';
import authRouter from './routes/auth.js';
import { connectDB } from './services/db.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable robust CORS for local Vite dev server and microservices
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
app.options('*', cors());


app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Job Portal API with Explainable NLP Matching Engine',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/resumes', resumesRouter);
app.use('/api/ats', atsRouter);
app.use('/api/interviews', interviewsRouter);
app.use('/api/analytics', analyticsRouter);

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.url}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Job Portal Backend running at http://127.0.0.1:${PORT}`);
  console.log(`📊 API Health: http://127.0.0.1:${PORT}/api/health`);
});
