const Config = require('../models/Config');
const KBItem = require('../models/KBItem');
const User = require('../models/User');

module.exports = async function ensureDefaults() {
  const config = await Config.findOne();

  if (!config) {
    await Config.create({ autoClose: true, threshold: 0.78 });
  }

  const userCount = await User.countDocuments();

  if (userCount === 0) {
    await User.create([
      { name: 'Admin', email: 'admin@helpdesk.com', password: 'admin123', role: 'admin' },
      { name: 'Agent', email: 'agent@helpdesk.com', password: 'agent123', role: 'agent' },
      { name: 'User', email: 'user@helpdesk.com', password: 'user123', role: 'user' },
    ]);
  }

  const kbCount = await KBItem.countDocuments();

  if (kbCount === 0) {
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
  }
};
