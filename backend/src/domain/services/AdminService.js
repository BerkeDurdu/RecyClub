const { User, Complaint, Business } = require('../../resource/models');
const AppError = require('../../common/AppError');

async function listUsers() {
  return User.findAll({ attributes: ['id', 'name', 'email', 'role', 'points', 'isFlagged', 'createdAt'] });
}

async function flagUser(id, isFlagged) {
  const user = await User.findByPk(id);
  if (!user) throw new AppError('User not found', 404);
  user.isFlagged = !!isFlagged;
  await user.save();
  return user;
}

async function listComplaints() {
  return Complaint.findAll({
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
    order: [['createdAt', 'DESC']],
  });
}

async function resolveComplaint(id, { status, resolution }) {
  const c = await Complaint.findByPk(id);
  if (!c) throw new AppError('Complaint not found', 404);
  if (status) c.status = status;
  if (resolution !== undefined) c.resolution = resolution;
  await c.save();
  return c;
}

async function verifyBusiness(id, isVerified = true) {
  const b = await Business.findByPk(id);
  if (!b) throw new AppError('Business not found', 404);
  b.isVerified = !!isVerified;
  await b.save();
  return b;
}

module.exports = { listUsers, flagUser, listComplaints, resolveComplaint, verifyBusiness };
