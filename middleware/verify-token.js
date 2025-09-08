// middleware/verify-token.js
const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const [, token] = auth.split(' ');
    if (!token) return res.status(401).json({ err: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.payload; // {_id, username}
    next();
  } catch (err) {
    res.status(401).json({ err: 'Invalid or expired token' });
  }
}

module.exports = requireAuth;

