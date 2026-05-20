// Integration test — Reward redemption (SAD v2 §4.3)
// Verifies insufficient-points / out-of-stock / happy path.

const request = require('supertest');
const app = require('../server');
const { resetDb, closeDb, createMember, createBusiness, createReward, login } = require('./helpers');

const POOR_MEMBER = { email: 'poor@test.local', password: 'pw12345' };
const RICH_MEMBER = { email: 'rich@test.local', password: 'pw12345' };
const BIZ        = { email: 'biz@test.local',  password: 'pw12345' };

let rewardId;
let rewardOutOfStockId;

beforeAll(async () => {
  await resetDb();
  await createMember({ ...POOR_MEMBER, points: 10 });
  await createMember({ ...RICH_MEMBER, points: 1000 });
  const { business } = await createBusiness(BIZ);
  const r = await createReward(business.id, { pointCost: 100, stock: 2 });
  const r2 = await createReward(business.id, { title: 'Empty', pointCost: 50, stock: 0 });
  rewardId = r.id;
  rewardOutOfStockId = r2.id;
});
afterAll(closeDb);

describe('Redemption flow', () => {
  test('insufficient points → 402', async () => {
    const token = await login(request, app, POOR_MEMBER.email, POOR_MEMBER.password);
    const res = await request(app)
      .post('/api/redemptions')
      .set('Authorization', `Bearer ${token}`)
      .send({ rewardId });
    expect(res.status).toBe(402);
  });

  test('out of stock → 409', async () => {
    const token = await login(request, app, RICH_MEMBER.email, RICH_MEMBER.password);
    const res = await request(app)
      .post('/api/redemptions')
      .set('Authorization', `Bearer ${token}`)
      .send({ rewardId: rewardOutOfStockId });
    expect(res.status).toBe(409);
  });

  test('successful redemption → 201 + QR; user points debited', async () => {
    const token = await login(request, app, RICH_MEMBER.email, RICH_MEMBER.password);
    const res = await request(app)
      .post('/api/redemptions')
      .set('Authorization', `Bearer ${token}`)
      .send({ rewardId });
    expect(res.status).toBe(201);
    expect(res.body.qrCode).toBeTruthy();
    expect(res.body.pointsSpent).toBe(100);
    expect(res.body.status).toBe('PENDING');
  });
});
