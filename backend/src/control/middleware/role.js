const AppError = require('../../common/AppError');

function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(new AppError('Not authenticated', 401));
    if (!roles.includes(req.user.role)) return next(new AppError('Forbidden', 403));
    next();
  };
}

module.exports = requireRole;
