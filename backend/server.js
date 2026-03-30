require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/database');
const ensureDefaults = require('./src/bootstrap/ensureDefaults');

const app = express();
const dbReady = connectDB().then(() => ensureDefaults());

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true
}));
app.use(morgan('combined'));
app.use(express.json());

app.get('/healthz', (req, res) => res.json({ status: 'OK' }));
app.get('/readyz', async (req, res) => {
  await dbReady;
  res.json({ status: 'READY' });
});

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/kb', require('./src/routes/kb'));
app.use('/api/tickets', require('./src/routes/tickets'));
app.use('/api/agent', require('./src/routes/agent'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error.',
  });
});

const PORT = process.env.PORT || 8080;
let server;

async function startServer() {
  await dbReady;

  if (server) {
    return server;
  }

  return new Promise((resolve) => {
    server = app.listen(PORT, () => {
      console.log('API on', PORT);
      resolve(server);
    });
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Failed to start API', error);
    process.exit(1);
  });
}

module.exports = app;
module.exports.dbReady = dbReady;
module.exports.startServer = startServer;
