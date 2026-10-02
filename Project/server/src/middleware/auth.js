import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-please-set-env';

/**
 * verifyToken — Express middleware that protects routes behind JWT auth.
 *
 * Reads the Authorization header (Bearer <token>), verifies the JWT,
 * and attaches the decoded payload to req.user before calling next().
 *
 * Usage:
 *   import { verifyToken } from '../middleware/auth.js';
 *   router.get('/protected', verifyToken, (req, res) => { ... });
 */
export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No token provided.'
    });
  }

  const token = authHeader.slice(7); // Remove "Bearer " prefix

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, email, role, iat, exp }
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError'
      ? 'Session expired. Please log in again.'
      : 'Invalid token. Please log in again.';

    return res.status(401).json({ success: false, error: message });
  }
}
