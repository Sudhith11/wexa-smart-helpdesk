const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let connectionPromise;
let memoryServer;

async function createMemoryUri() {
  if (!memoryServer) {
    memoryServer = await MongoMemoryServer.create({
      instance: { dbName: 'wexa-smart-helpdesk' },
    });
    console.log('Using in-memory MongoDB');
  }

  return memoryServer.getUri();
}

async function connectWithUri(uri, label) {
  const connection = await mongoose.connect(uri);
  console.log(`${label} connected`);
  return connection;
}

module.exports = async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    const shouldUseInMemory =
      process.env.USE_IN_MEMORY_DB === 'true' ||
      process.env.NODE_ENV === 'test' ||
      !process.env.MONGO_URI;

    if (shouldUseInMemory) {
      return connectWithUri(await createMemoryUri(), 'Mongo');
    }

    try {
      return await connectWithUri(process.env.MONGO_URI, 'Mongo');
    } catch (error) {
      if (process.env.ALLOW_DB_FALLBACK === 'false') {
        console.error('Mongo error', error.message);
        throw error;
      }

      console.warn(`Mongo unavailable, falling back to in-memory MongoDB: ${error.message}`);
      return connectWithUri(await createMemoryUri(), 'In-memory Mongo');
    }
  })().catch((error) => {
    connectionPromise = null;
    throw error;
  });

  return connectionPromise;
};

module.exports.stopInMemoryServer = async function stopInMemoryServer() {
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};
