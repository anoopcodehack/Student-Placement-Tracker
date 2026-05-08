const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function checkUsers() {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = await User.find({}, 'email role');
  console.log('Users in DB:', users);
  await mongoose.disconnect();
}

checkUsers();
