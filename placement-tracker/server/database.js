const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let connectionURI = null;
let mongoServer = null;

async function connectToMongo(uri, options, label) {
  console.log(`📡 Connecting to ${label}...`);
  const conn = await mongoose.connect(uri, options);
  console.log(`✅ ${label} connected`);
  return conn;
}

async function connectDB() {
  const atlasURI = process.env.MONGO_URI || process.env.MONGODB_URI;
  const localURI = process.env.LOCAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/placement-tracker';
  const connectOptions = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  if (atlasURI) {
    try {
      connectionURI = atlasURI;
      return await connectToMongo(atlasURI, connectOptions, 'MongoDB Atlas');
    } catch (err) {
      console.error('\n❌ MongoDB Atlas connection failed:', err.message);
      console.error('Please verify your Atlas IP whitelist and network access.');
    }
  } else {
    console.warn('⚠️  No MongoDB Atlas URI found in MONGO_URI or MONGODB_URI.');
  }

  try {
    connectionURI = localURI;
    return await connectToMongo(localURI, connectOptions, 'local MongoDB');
  } catch (err) {
    console.error('\n❌ Local MongoDB connection failed:', err.message);
    console.error('Make sure mongod is running and reachable at', localURI);
  }

  console.warn('⚠️  Falling back to in-memory database; data will not persist after restart.');
  mongoServer = await MongoMemoryServer.create();
  connectionURI = mongoServer.getUri();
  return await connectToMongo(connectionURI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }, 'In-Memory MongoDB');
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

