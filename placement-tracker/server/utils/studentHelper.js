const Student = require('../models/Student');

/**
 * Derives engineering branch and graduation batch from a VTU/Sahyadri USN (roll number).
 * Example: '4SF24CS002' -> CSE, batch 2028 (2024 join + 4 years)
 *          '4SF21IS045' -> IT,  batch 2025
 */
function parseBranchAndBatch(rollNo) {
  if (!rollNo) return { branch: 'CSE', batch: new Date().getFullYear() + 1 };
  const r = rollNo.toUpperCase();

  let branch = 'CSE';
  if (r.includes('CS') || r.includes('CSE')) branch = 'CSE';
  else if (r.includes('IS') || r.includes('IT') || r.includes('ISE')) branch = 'IT';
  else if (r.includes('EC') || r.includes('ECE')) branch = 'ECE';
  else if (r.includes('EE') || r.includes('EEE')) branch = 'EEE';
  else if (r.includes('ME') || r.includes('MECH')) branch = 'ME';
  else if (r.includes('CV') || r.includes('CIVIL') || r.includes('CE')) branch = 'CE';
  else if (r.includes('AI') || r.includes('AD') || r.includes('AIDS')) branch = 'AIDS';
  else if (r.includes('ML') || r.includes('AIML')) branch = 'AIML';
  else if (r.includes('CD') || r.includes('CSD')) branch = 'CSD';
  else branch = 'Other';

  let batch = new Date().getFullYear() + 1; // default e.g. 2025 / 2026
  const match = r.match(/4SF(\d{2})/i) || r.match(/\D(\d{2})\D/);
  if (match) {
    const joinYear = 2000 + parseInt(match[1], 10);
    batch = joinYear + 4;
  }

  return { branch, batch };
}

/**
 * Ensures a user who is a student has:
 * 1. user.isStudent = true
 * 2. user.role = 'student' (if not admin)
 * 3. user.studentRef pointing to a valid Student document in MongoDB.
 * If no Student document exists for their rollNo or email, one is auto-created.
 */
async function ensureStudentForUser(user) {
  if (!user) return null;

  const hasStudentIndicator = user.isStudent || (user.rollNo && user.rollNo.trim() !== '') || user.role === 'student';
  if (!hasStudentIndicator) return null;

  let changed = false;

  if (!user.isStudent) {
    user.isStudent = true;
    changed = true;
  }

  if (user.role !== 'admin' && user.role !== 'student') {
    user.role = 'student';
    changed = true;
  }

  const normalizedRoll = (user.rollNo || '').trim().toUpperCase();
  if (normalizedRoll && user.rollNo !== normalizedRoll) {
    user.rollNo = normalizedRoll;
    changed = true;
  }

  let student = null;

  // 1. Try finding by existing studentRef
  if (user.studentRef) {
    student = await Student.findById(user.studentRef);
  }

  // 2. Try finding by rollNo
  if (!student && normalizedRoll) {
    student = await Student.findOne({ rollNo: normalizedRoll });
  }

  // 3. Try finding by email
  if (!student && user.email) {
    student = await Student.findOne({ email: user.email.toLowerCase() });
  }

  // 4. If still not found, auto-create the Student profile for this student
  if (!student) {
    const { branch, batch } = parseBranchAndBatch(normalizedRoll);
    student = await Student.create({
      name: user.name || 'Student',
      rollNo: normalizedRoll || `4SF${new Date().getFullYear().toString().slice(-2)}CS${Math.floor(100 + Math.random() * 900)}`,
      email: user.email.toLowerCase(),
      branch,
      batch,
      cgpa: 8.5,
      tenthPercent: 85,
      twelfthPercent: 85,
      skills: ['C++', 'Python', 'Web Development'],
      isPlaced: false,
    });
  }

  // Ensure rollNo and email are kept in sync
  if (normalizedRoll && student.rollNo !== normalizedRoll) {
    student.rollNo = normalizedRoll;
    await student.save();
  }

  if (user.studentRef?.toString() !== student._id.toString()) {
    user.studentRef = student._id;
    changed = true;
  }

  if (changed) {
    await user.save();
  }

  return student;
}

module.exports = {
  parseBranchAndBatch,
  ensureStudentForUser,
};
