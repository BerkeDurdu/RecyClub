// Lightweight DTO / validation helpers (Common layer)
const AppError = require('./AppError');

function require_(obj, fields) {
  const missing = fields.filter((f) => obj[f] === undefined || obj[f] === null || obj[f] === '');
  if (missing.length) throw new AppError(`Missing fields: ${missing.join(', ')}`, 400);
}

function pickUser(u) {
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    points: u.points,
  };
}

const WASTE_TYPES = ['GLASS', 'PLASTIC', 'BATTERY', 'PAPER'];

module.exports = { require_, pickUser, WASTE_TYPES };
