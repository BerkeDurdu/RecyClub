const { verify } = require('../../common/jwt');
const AppError = require('../../common/AppError');

// JWT Middleware (SAD §2.4 step 3)
function auth(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new AppError('Missing Authorization header', 401));
  try {
    const payload = verify(token);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (_e) {
    next(new AppError('Invalid or expired token', 401));
  }
}

module.exports = auth;
