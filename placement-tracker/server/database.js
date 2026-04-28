const mongoose = require('mongoose');

let connectionURI = null;

async function connectDB() {
  const envURI = process.env.MONGO_URI;

  if (!envURI || envURI.trim() === '') {
    throw new Error(
      'MONGO_URI is not set in your .env file.\n' +
      'Please add your MongoDB connection string:\n' +
      'MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority\n\n' +
      'Get this from MongoDB Atlas → Database → Connect → Drivers → Node.js'
    );
  }

  connectionURI = envURI;

  try {
    console.log('📡 Connecting to MongoDB...');
    const conn = await mongoose.connect(envURI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Connected');
    return conn;
  } catch (err) {
    console.error('\n❌ MongoDB Connection Failed!\n');

    if (err.message.includes('IP')) {
      console.error('👉 IP WHITELIST ISSUE:');
      console.error('   Your current IP is not allowed to access the Atlas cluster.');
      console.error('   Fix: Go to MongoDB Atlas → Network Access → Add IP Address → Allow from anywhere (0.0.0.0/0) or your current IP\n');
    }

    if (err.message.includes('authentication failed') || err.message.includes('bad auth')) {
      console.error('👉 AUTHENTICATION FAILED:');
      console.error('   Check your username and password in the MONGO_URI.');
      console.error('   Make sure the database user exists in Atlas → Database Access.');
      console.error('   Remember: use the DATABASE user password, not your Atlas account password!\n');
    }

    if (err.message.includes('ECONNREFUSED') || err.message.includes('ENOTFOUND')) {
      console.error('👉 CANNOT REACH CLUSTER:');
      console.error('   Check that your cluster name is correct in the connection string.');
      console.error('   Make sure your internet connection is active.\n');
    }

    console.error('Error details:', err.message);
    throw err;
  }
}

async function disconnectDB() {
  await mongoose.disconnect();
  console.log('🔌 MongoDB Disconnected');
}

function getURI() {
  return connectionURI;
}

module.exports = { connectDB, disconnectDB, getURI };

