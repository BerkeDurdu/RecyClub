// Integration test — Complaint create + admin resolve (SAD v2 §4.5)

const request = require('supertest');
const app = require('../server');
const bcrypt = require('bcryptjs');
const { resetDb, closeDb, createMember, login, models } = require('./helpers');

const MEMBER = { email: 'cmp-member@test.local', password: 'pw12345' };
const ADMIN  = { email: 'cmp-admin@test.local',  password: 'pw12345' };

beforeAll(async () => {
  await resetDb();
  await createMember(MEMBER);
  await models.User.create({
    name: 'Admin', email: ADMIN.email, role: 'ADMIN',
    passwordHash: await bcrypt.hash(ADMIN.password, 4),
  });
});
afterAll(closeDb);

describe('Complaint flow', () => {
  let complaintId;
  let memberToken;
  let adminToken;

  test('member creates complaint → 201', async () => {
    memberToken = await login(request, app, MEMBER.email, MEMBER.password);
    const res = await request(app)
      .post('/api/complaints')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ subject: 'Broken QR scanner', body: 'At Kadikoy.' });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('OPEN');
    complaintId = res.body.id;
  });

  test('admin lists complaints → contains created one', async () => {
    adminToken = await login(request, app, ADMIN.email, ADMIN.password);
    const res = await request(app)
      .get('/api/admin/complaints')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.some((c) => c.id === complaintId)).toBe(true);
  });

  test('admin resolves complaint → status CLOSED, resolution stored', async () => {
    const res = await request(app)
      .patch(`/api/admin/complaints/${complaintId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'CLOSED', resolution: 'Scanner replaced 2026-05-16.' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('CLOSED');
    expect(res.body.resolution).toMatch(/Scanner replaced/);
  });

  test('non-admin cannot list admin complaints → 403', async () => {
    const res = await request(app)
      .get('/api/admin/complaints')
      .set('Authorization', `Bearer ${memberToken}`);
    expect(res.status).toBe(403);
  });
});
