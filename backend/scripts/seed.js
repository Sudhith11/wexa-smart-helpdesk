require('dotenv').config();
const connect = require('../src/config/database');
const User = require('../src/models/User');
const KBItem = require('../src/models/KBItem');
const Ticket = require('../src/models/Ticket');
const AgentSuggestion = require('../src/models/AgentSuggestion');
const AuditLog = require('../src/models/AuditLog');
const Config = require('../src/models/Config');

(async () => {
  await connect();
  await Promise.all([
    User.deleteMany({}),
    KBItem.deleteMany({}),
    Ticket.deleteMany({}),
    AgentSuggestion.deleteMany({}),
    AuditLog.deleteMany({}),
    Config.deleteMany({}),
  ]);

  await User.create({ name: 'Admin', email: 'admin@helpdesk.com', password: 'admin123', role: 'admin' });
  await User.create({ name: 'Agent', email: 'agent@helpdesk.com', password: 'agent123', role: 'agent' });
  await User.create({ name: 'User', email: 'user@helpdesk.com', password: 'user123', role: 'user' });

  await Config.create({ autoClose: true, threshold: 0.78 });

  await KBItem.insertMany([
    {
      title: 'How to update payment method',
      body: 'Go to billing settings, choose your active payment profile, and save the new method.',
      tags: ['billing', 'payments'],
      status: 'published',
    },
    {
      title: 'Troubleshooting login and 500 errors',
      body: 'Clear cached sessions, verify account access, and retry from an incognito window.',
      tags: ['tech', 'errors', 'login'],
      status: 'published',
    },
    {
      title: 'Tracking your shipment',
      body: 'Open the shipping confirmation email and use the tracking link to monitor delivery progress.',
      tags: ['shipping', 'delivery', 'tracking'],
      status: 'published',
    },
  ]);

  console.log('Seed complete');
  process.exit(0);
})();
