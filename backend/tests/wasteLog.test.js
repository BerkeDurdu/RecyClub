// Integration test — Recycling Log + QR validation (SAD v2 §4.2)
// Requires a reachable PostgreSQL test DB. Set DB_NAME=recyclub_test in .env
// or in your CI env before running `npm test`.

const request = require('supertest');
const app = require('../server');
const { resetDb, closeDb, createMember, login, models } = require('./helpers');

const MEMBER = { email: 'member@test.local', password: 'pw12345' };

beforeAll(async () => {
  await resetDb();
  await createMember(MEMBER);
});
afterAll(closeDb);

describe('WasteLog flow', () => {
  let token;
  let qrCode;

  test('login member', async () => {
    token = await login(request, app, MEMBER.email, MEMBER.password);
    expect(token).toBeTruthy();
  });

  test('create pending waste log → 201, returns QR', async () => {
    const res = await request(app)
      .post('/api/waste-logs')
      .set('Authorization', `Bearer ${token}`)
      .send({ wasteType: 'PLASTIC', quantity: 3 });
    expect(res.status).toBe(201);
    expect(res.body.qrCode).toBeTruthy();
    expect(res.body.status).toBe('PENDING');
    qrCode = res.body.qrCode;
  });

  test('reject invalid wasteType → 400', async () => {
    const res = await request(app)
      .post('/api/waste-logs')
      .set('Authorization', `Bearer ${token}`)
      .send({ wasteType: 'XXX', quantity: 1 });
    expect(res.status).toBe(400);
  });

  test('validate QR → 200, points credited, log VALIDATED', async () => {
    const res = await request(app)
      .post('/api/waste-logs/validate')
      .set('Authorization', `Bearer ${token}`)
      .send({ qrCode });
    expect(res.status).toBe(200);
    expect(res.body.log.status).toBe('VALIDATED');
    expect(res.body.points).toBeGreaterThan(0);
  });

  test('cannot validate same QR twice → 409', async () => {
    const res = await request(app)
      .post('/api/waste-logs/validate')
      .set('Authorization', `Bearer ${token}`)
      .send({ qrCode });
    expect(res.status).toBe(409);
  });
});
