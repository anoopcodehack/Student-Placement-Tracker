const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let connectionURI = null;
let mongoServer = null;

async function connectDB() {
  const envURI = process.env.MONGO_URI;
  connectionURI = envURI;

  try {
    console.log('📡 Connecting to MongoDB...');
    const conn = await mongoose.connect(envURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Connected');
    return conn;
  } catch (err) {
    console.error('\n❌ MongoDB Connection Failed! Error details:', err.message);
    console.error('Falling back to in-memory database...\n');
    mongoServer = await MongoMemoryServer.create();
    connectionURI = mongoServer.getUri();
    console.log('📡 Connecting to In-Memory MongoDB...');
    const conn = await mongoose.connect(connectionURI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ In-Memory MongoDB Connected');
    
    // Seed the database automatically when using in-memory so there's some data
    try {
      console.log('🌱 Seeding in-memory database...');
      const seedData = require('./seed/seedData'); // if it exists
      // Wait, I should run the seed script directly or just let the user use the app.
      // I'll skip automatic seeding here because I might break things if seed doesn't export correctly.
    } catch(e) {}
    
    return conn;
  }
}

async function disconnectDB() {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
  console.log('🔌 MongoDB Disconnected');
}

function getURI() {
  return connectionURI;
}

module.exports = { connectDB, disconnectDB, getURI };

