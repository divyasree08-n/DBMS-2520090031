import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../services/db.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-please-set-env';
const JWT_EXPIRES_IN = '7d';

/**
 * Sign a JWT for a given user object.
 * Payload contains non-sensitive identity fields only — no passwordHash.
 */
function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// ─── POST /api/auth/register ───────────────────────────────────────────────

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required: name, email, password, role'
      });
    }

    if (!['candidate', 'recruiter'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Role must be "candidate" or "recruiter"'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters'
      });
    }

    // 2. Check for duplicate email
    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email already exists'
      });
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Persist user
    const user = await db.createUser({ name: name.trim(), email, role, passwordHash });

    // 5. Issue JWT
    const token = signToken(user);

    return res.status(201).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('[auth/register]', err);
    return res.status(500).json({ success: false, error: 'Registration failed. Please try again.' });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // 2. Find user
    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // 3. Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // 4. Role mismatch check: Candidate and Recruiter accounts must be strictly separated
    if (req.body.role && user.role !== req.body.role) {
      const expected = req.body.role === 'recruiter' ? 'Recruiter' : 'Candidate';
      const actual = user.role === 'recruiter' ? 'Recruiter' : 'Candidate';
      return res.status(403).json({
        success: false,
        error: `Account role mismatch: This account is registered as a ${actual}. You cannot log into the ${expected} portal. Please select "${actual}" to log in, or create a separate account.`
      });
    }

    // 5. Issue JWT
    const token = signToken(user);


    return res.status(200).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('[auth/login]', err);
    return res.status(500).json({ success: false, error: 'Login failed. Please try again.' });
  }
});

export default router;
