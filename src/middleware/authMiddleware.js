const { admin } = require('../config/firebase');
async function authMiddleware(req, res, next) {

  try {
    const header = req.headers.authorization || '';
    const match = header.match(/^Bearer\s+(.+)$/i);

    if (!match) 
      return res.status(401).json({ error: 'Missing Bearer Firebase ID token' });

    const decoded = await admin.auth().verifyIdToken(match[1]);
    req.user = { uid: decoded.uid, email: decoded.email || null, claims: decoded };

    next();
      } 
  catch (_err)
  { 
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
}
module.exports = authMiddleware;
