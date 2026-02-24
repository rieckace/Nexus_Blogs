const jwt = require('jsonwebtoken');

function getAccessSecret() {
  return process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me';
}

function readAccessToken(req) {
  return req.cookies?.access_token;
}

function requireAuth(req, res, next) {
  const token = readAccessToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, getAccessSecret());
    req.auth = payload;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function optionalAuth(req, _res, next) {
  const token = readAccessToken(req);
  if (!token) return next();
  try {
    req.auth = jwt.verify(token, getAccessSecret());
  } catch {
    // ignore
  }
  return next();
}

module.exports = { requireAuth, optionalAuth };
