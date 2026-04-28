export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatPackage = (pkg) => {
  if (!pkg) return '—';
  return `₹${pkg} LPA`;
};

export const cgpaColor = (cgpa) => {
  if (cgpa >= 8) return '#059669';
  if (cgpa >= 6) return '#d97706';
  return '#dc2626';
};

export const pkgColor = (pkg) => {
  if (pkg >= 20) return '#7c3aed';
  if (pkg >= 10) return '#1a56db';
  if (pkg >= 5)  return '#059669';
  return '#64748b';
};

export const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

export const placementRate = (placed, total) =>
  total ? ((placed / total) * 100).toFixed(1) : '0.0';

export const BRANCHES = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'AIDS', 'AIML', 'CSD', 'Other'];
export const SKILLS_LIST = [
  'JavaScript','Python','Java','C++','React','Node.js',
  'MongoDB','SQL','DSA','Machine Learning','AWS','Docker',
  'TypeScript','Go','Rust','Flutter','Kotlin','Swift'
];
export const INDUSTRIES = ['IT','Finance','Core','Consulting','Product','Service','Startup','PSU','Other'];
export const CHART_COLORS = [
  '#1a56db','#06b6d4','#8b5cf6','#f59e0b','#10b981',
  '#ef4444','#f97316','#6366f1','#ec4899','#14b8a6'
];
