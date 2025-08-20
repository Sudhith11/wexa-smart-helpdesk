const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // just the Express app

afterAll(async () => {
  // close MongoDB connection when tests finish
  await mongoose.connection.close();
});

describe('Auth', () => {
  it('registers', async () => {
    const r = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'T',
        email: `t${Date.now()}@e.com`,
        password: 'p123456',
      });
    expect(r.status).toBe(201);
    expect(r.body.token).toBeDefined();
  });
});
