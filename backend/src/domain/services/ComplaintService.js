const { Complaint } = require('../../resource/models');
const AppError = require('../../common/AppError');

async function create({ userId, subject, body }) {
  if (!subject || !body) throw new AppError('subject and body required', 400);
  return Complaint.create({ userId, subject, body });
}

async function listForUser(userId) {
  return Complaint.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
}

module.exports = { create, listForUser };
