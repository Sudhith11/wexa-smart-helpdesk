require('dotenv').config();
const connect = require('../src/config/database');
const User = require('../src/models/User');
const KBItem = require('../s../models/KBItem');
const Ticket = require('../src/models/Ticket');
const Config = require('../src/models/Config');

(async ()=>{
  await connect();
  await Promise.all([User.deleteMany({}), KBItem.deleteMany({}), Ticket.deleteMany({}), Config.deleteMany({})]);

  const admin = await User.create({name:'Admin', email:'admin@helpdesk.com', password:'admin123', role:'admin'});
  const agent = await User.create({name:'Agent', email:'agent@helpdesk.com', password:'agent123', role:'agent'});
  const user = await User.create({name:'User', email:'user@helpdesk.com', password:'user123', role:'user'});

  await Config.create({autoCloseEnabled:true, confidenceThreshold:0.78, slaHours:24});

  await KBItem.insertMany([
    {title:'How to update payment method', body:'Steps to update payment method...', tags:['billing','payments'], status:'published'},
    {title:'Troubleshooting 500 errors', body:'Common causes and fixes...', tags:['tech','errors'], status:'published'},
    {title:'Tracking your shipment', body:'Use the tracking link in your email...', tags:['shipping','delivery'], status:'published'}
  ]);

  console.log('Seed complete');
  process.exit(0);
})();
