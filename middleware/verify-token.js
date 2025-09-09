// middleware/verify-token.js
const jwt = require('jsonwebtoken');

module.exports = function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const [, token] = auth.split(' ');
  if (!token) return res.status(401).json({ err: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.payload; // {_id, username}
    next();
  } catch {
    return res.status(401).json({ err: 'Invalid or expired token' });
  }
};


