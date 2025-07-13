const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  console.log('✅ [AUTH MIDDLEWARE] Incoming Authorization header:', authHeader);
console.log('✅ [AUTH MIDDLEWARE] Split token:', token);
console.log('✅ [AUTH MIDDLEWARE] Verifying with JWT_SECRET:', process.env.JWT_SECRET);


  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not defined in environment');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.userId = decoded.id;

    console.log('✅ Token verified, user ID:', decoded.id);
    console.log('✅ [AUTH MIDDLEWARE] Token verified, decoded user ID:', decoded.id);


    next();
  } catch (err) {
    console.error('❌ Invalid token:', err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;
