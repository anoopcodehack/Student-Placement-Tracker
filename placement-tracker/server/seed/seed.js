const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { connectDB, disconnectDB } = require('../database');

const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Placement = require('../models/Placement');

const companiesData = [
  { name: 'Google', industry: 'Product', type: 'MNC', packageRange: { min: 20, max: 45 }, roles: ['SWE', 'SRE'], visitDate: new Date('2024-08-15') },
  { name: 'Microsoft', industry: 'Product', type: 'MNC', packageRange: { min: 18, max: 35 }, roles: ['Software Engineer', 'PM'], visitDate: new Date('2024-08-20') },
  { name: 'Amazon', industry: 'Product', type: 'MNC', packageRange: { min: 15, max: 32 }, roles: ['SDE', 'Data Engineer'], visitDate: new Date('2024-09-01') },
  { name: 'TCS', industry: 'IT', type: 'MNC', packageRange: { min: 3.5, max: 7 }, roles: ['Software Engineer', 'Analyst'], visitDate: new Date('2024-07-10') },
  { name: 'Infosys', industry: 'IT', type: 'MNC', packageRange: { min: 3.6, max: 8 }, roles: ['Systems Engineer', 'Analyst'], visitDate: new Date('2024-07-15') },
  { name: 'Wipro', industry: 'IT', type: 'MNC', packageRange: { min: 3.5, max: 6.5 }, roles: ['Project Engineer'], visitDate: new Date('2024-07-20') },
  { name: 'Deloitte', industry: 'Consulting', type: 'MNC', packageRange: { min: 7, max: 14 }, roles: ['Analyst', 'Consultant'], visitDate: new Date('2024-08-05') },
  { name: 'Razorpay', industry: 'Finance', type: 'Startup', packageRange: { min: 12, max: 22 }, roles: ['Backend Engineer', 'Full Stack'], visitDate: new Date('2024-09-10') },
  { name: 'Swiggy', industry: 'Startup', type: 'Startup', packageRange: { min: 10, max: 20 }, roles: ['SDE-1', 'Data Analyst'], visitDate: new Date('2024-09-12') },
  { name: 'Accenture', industry: 'Consulting', type: 'MNC', packageRange: { min: 4.5, max: 9 }, roles: ['Associate SE', 'Analyst'], visitDate: new Date('2024-07-25') },
  { name: 'BHEL', industry: 'Core', type: 'PSU', packageRange: { min: 7, max: 12 }, roles: ['Engineer Trainee'], visitDate: new Date('2024-08-30') },
  { name: 'PhonePe', industry: 'Finance', type: 'Startup', packageRange: { min: 14, max: 25 }, roles: ['SDE', 'Data Engineer'], visitDate: new Date('2024-09-05') },
];

const branches = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'AIDS', 'AIML'];
const batches = [2024, 2025];
const firstNames = ['Aarav', 'Priya', 'Rohan', 'Neha', 'Arjun', 'Divya', 'Karan', 'Sneha', 'Vikram', 'Ananya', 'Rahul', 'Pooja', 'Aditya', 'Meera', 'Siddharth', 'Ishaan', 'Kavya', 'Nikhil', 'Shreya', 'Tanvi', 'Harsh', 'Nisha', 'Akash', 'Simran', 'Dev', 'Riya', 'Arnav', 'Pallavi', 'Yash', 'Komal'];
const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Joshi', 'Agarwal', 'Verma', 'Reddy', 'Nair', 'Shah', 'Mehta', 'Iyer', 'Pillai', 'Das'];

async function seedDatabase() {
  // Check if already seeded
  const existingUsers = await User.countDocuments();
  if (existingUsers > 0) {
    console.log('📦 Database already seeded, skipping...');
    return;
  }

  console.log('🌱 Seeding database...');

  // Create admin user
  await User.create({ name: 'Admin User', email: 'admin@college.edu', password: 'admin123', role: 'admin' });
  await User.create({ name: 'Viewer User', email: 'viewer@college.edu', password: 'viewer123', role: 'viewer' });
  console.log('👤 Users created — admin@college.edu / admin123');

  // Create companies
  const companies = await Company.insertMany(companiesData);
  console.log(`🏢 ${companies.length} companies created`);

  // Create students
  const studentsData = [];
  let rollCounter = 1;
  for (let i = 0; i < 120; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const branch = branches[i % branches.length];
    const batch = batches[i % batches.length];
    const cgpa = parseFloat((6 + Math.random() * 4).toFixed(2));
    studentsData.push({
      name: `${firstName} ${lastName}`,
      rollNo: `${batch}${branch}${String(rollCounter++).padStart(3, '0')}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@college.edu`,
      phone: `98${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      branch,
      batch,
      cgpa,
      tenthPercent: parseFloat((75 + Math.random() * 25).toFixed(1)),
      twelfthPercent: parseFloat((70 + Math.random() * 30).toFixed(1)),
      backlogs: Math.random() > 0.85 ? Math.floor(Math.random() * 3) + 1 : 0,
      skills: ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'DSA'].slice(0, Math.floor(Math.random() * 4) + 2),
      gender: Math.random() > 0.4 ? 'Male' : 'Female',
      isPlaced: false,
    });
  }
  const students = await Student.insertMany(studentsData);
  console.log(`🎓 ${students.length} students created`);

  // Create placements — ~65% placement rate
  const placementData = [];
  const shuffled = [...students].sort(() => Math.random() - 0.5);
  const toPlace = shuffled.slice(0, Math.floor(students.length * 0.65));

  for (const student of toPlace) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const pkg = parseFloat((company.packageRange.min + Math.random() * (company.packageRange.max - company.packageRange.min)).toFixed(2));
    const role = company.roles[Math.floor(Math.random() * company.roles.length)];
    const dateOfOffer = new Date(2024, Math.floor(Math.random() * 6) + 7, Math.floor(Math.random() * 28) + 1);

    placementData.push({
      student: student._id,
      company: company._id,
      package: pkg,
      role,
      offerType: Math.random() > 0.2 ? 'FTE' : 'Intern+FTE',
      dateOfOffer,
      status: 'Confirmed',
      location: ['Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Mumbai', 'Delhi'][Math.floor(Math.random() * 6)],
    });
  }

  const placements = await Placement.insertMany(placementData);

  // Update students and companies
  for (const p of placements) {
    await Student.findByIdAndUpdate(p.student, {
      isPlaced: true,
      'placementDetails.company': p.company,
      'placementDetails.package': p.package,
      'placementDetails.role': p.role,
      'placementDetails.offerType': p.offerType,
      'placementDetails.dateOfOffer': p.dateOfOffer,
    });
    await Company.findByIdAndUpdate(p.company, { $inc: { studentsHired: 1 } });
  }

  console.log(`🎉 ${placements.length} placement records created`);
  console.log('\n✅ Seed complete!');
  console.log('📧 Admin: admin@college.edu | Password: admin123');
  console.log('📧 Viewer: viewer@college.edu | Password: viewer123');
}

// CLI usage: node seed/seed.js
async function runSeedCLI() {
  await connectDB();
  await seedDatabase();
  await disconnectDB();
}

if (require.main === module) {
  runSeedCLI().catch(async err => { console.error(err); await disconnectDB(); });
}

module.exports = { seedDatabase };

