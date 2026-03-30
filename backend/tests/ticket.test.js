const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const { stopInMemoryServer } = require('../src/config/database');

describe('Tickets & Suggestions', () => {
  let token;
  let ticketId;

  beforeAll(async () => {
    await app.dbReady;

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      });

    token = res.body.token;
  });

  it('creates a ticket', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Where is my package?',
        description: 'Shipment delayed 5 days'
      });

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    ticketId = res.body._id;
  });

  it('retrieves ticket audit logs', async () => {
    const res = await request(app)
      .get(`/api/tickets/${ticketId}/audit`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('gets agent suggestions for ticket', async () => {
    const res = await request(app)
      .get(`/api/agent/suggestion/${ticketId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.predictedCategory).toBeDefined();
    expect(res.body.draftReply).toBeDefined();
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await stopInMemoryServer();
});
