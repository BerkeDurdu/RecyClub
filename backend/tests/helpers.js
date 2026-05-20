// Test helpers — bootstrap a clean DB and create demo users/business/reward.
// Run with a real PostgreSQL (test DB) — point DB_NAME at e.g. "recyclub_test".

require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const models = require('../src/resource/models');

async function resetDb() {
  await sequelize.sync({ force: true });
}

async function closeDb() {
  await sequelize.close();
}

async function createMember({ email = 'm@test.local', password = 'pw12345', points = 500 } = {}) {
  return models.User.create({
    name: 'Test Member', email, role: 'MEMBER', points,
    passwordHash: await bcrypt.hash(password, 4),
  });
}

async function createBusiness({ email = 'b@test.local', password = 'pw12345' } = {}) {
  const user = await models.User.create({
    name: 'Test Biz Owner', email, role: 'BUSINESS',
    passwordHash: await bcrypt.hash(password, 4),
  });
  const business = await models.Business.create({
    userId: user.id, name: 'Test Biz', email, address: '—', isVerified: true,
  });
  return { user, business };
}

async function createReward(businessId, overrides = {}) {
  return models.Reward.create({
    businessId, title: 'Test Reward', description: '', pointCost: 100, stock: 5, isActive: true,
    ...overrides,
  });
}

async function login(request, app, email, password) {
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.body.token;
}

module.exports = { resetDb, closeDb, createMember, createBusiness, createReward, login, models };
