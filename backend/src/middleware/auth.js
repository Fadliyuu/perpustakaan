const jwt = require('jsonwebtoken');

function auth(requiredRoles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
      req.user = payload;

      if (requiredRoles.length > 0 && !requiredRoles.includes(payload.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}

module.exports = {
  auth
};


