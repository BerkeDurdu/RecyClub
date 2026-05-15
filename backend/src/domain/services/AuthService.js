const bcrypt = require('bcryptjs');
const { User, Business } = require('../../resource/models');
const { sign } = require('../../common/jwt');
const { pickUser } = require('../../common/dto');
const AppError = require('../../common/AppError');

async function register({ name, email, password, role = 'MEMBER', businessName, address }) {
  if (!['MEMBER', 'BUSINESS'].includes(role)) {
    throw new AppError('Invalid role for self-registration', 400);
  }
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new AppError('Email already registered', 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role });

  if (role === 'BUSINESS') {
    await Business.create({
      userId: user.id,
      name: businessName || name,
      email,
      address: address || '',
      isVerified: false,
    });
  }

  const token = sign({ id: user.id, role: user.role });
  return { token, user: pickUser(user) };
}

async function login({ email, password }) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new AppError('Invalid credentials', 401);
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new AppError('Invalid credentials', 401);
  if (user.isFlagged) throw new AppError('Account flagged. Contact support.', 403);
  const token = sign({ id: user.id, role: user.role });
  return { token, user: pickUser(user) };
}

module.exports = { register, login };
