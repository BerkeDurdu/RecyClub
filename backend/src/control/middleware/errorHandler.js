// Centralized Express error middleware (SAD §1.6 Reliability)
// eslint-disable-next-line no-unused-vars
module.exports = function errorHandler(err, _req, res, _next) {
  if (err && err.isOperational) {
    return res.status(err.status || 400).json({ error: err.message, details: err.details || null });
  }
  console.error('[ERR]', err);
  return res.status(500).json({ error: 'Internal server error' });
};
