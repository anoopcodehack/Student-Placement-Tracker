const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send eligibility email
const sendEligibilityEmail = async ({
  to,
  studentName,
  companyName,
  roles,
  packageMin,
  packageMax,
  minCGPA,
  branches,
  visitDate,
}) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Placement Drive Alert</title>
    </head>
    <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <div style="background:linear-gradient(135deg,#1a56db,#06b6d4);padding:32px 40px;text-align:center;">
          <div style="font-size:2.5rem;margin-bottom:8px;">🎓</div>
          <h1 style="color:#fff;margin:0;font-size:1.6rem;font-weight:800;letter-spacing:-0.02em;">PlaceTrack</h1>
          <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:0.85rem;">Sahyadri College Placement Portal</p>
        </div>

        <div style="text-align:center;padding:24px 40px 0;">
          <span style="background:#dcfce7;color:#166534;padding:6px 18px;border-radius:20px;font-size:0.8rem;font-weight:700;">
            🎯 YOU ARE ELIGIBLE
          </span>
        </div>

        <div style="padding:24px 40px;">
          <h2 style="color:#0f172a;font-size:1.3rem;font-weight:800;margin:0 0 8px;">
            Hi ${studentName}! 👋
          </h2>
          <p style="color:#64748b;font-size:0.95rem;line-height:1.6;margin:0 0 24px;">
            Great news! You are eligible for the upcoming placement drive at <strong style="color:#1a56db;">${companyName}</strong>. Don't miss this opportunity!
          </p>

          <div style="background:linear-gradient(135deg,#0f172a,#1e3a5f);border-radius:12px;padding:24px;margin-bottom:24px;">
            <div style="font-size:1.8rem;font-weight:800;color:#fff;margin-bottom:4px;">${companyName}</div>
            <div style="color:#94a3b8;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:16px;">Placement Drive</div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
              <div style="background:rgba(255,255,255,0.06);border-radius:8px;padding:12px;">
                <div style="color:#94a3b8;font-size:0.65rem;text-transform:uppercase;letter-spacing:0.06em;">Package Range</div>
                <div style="color:#34d399;font-weight:800;font-size:1.1rem;margin-top:4px;">₹${packageMin}–${packageMax} LPA</div>
              </div>
              <div style="background:rgba(255,255,255,0.06);border-radius:8px;padding:12px;">
                <div style="color:#94a3b8;font-size:0.65rem;text-transform:uppercase;letter-spacing:0.06em;">Min CGPA</div>
                <div style="color:#93c5fd;font-weight:800;font-size:1.1rem;margin-top:4px;">${minCGPA}+</div>
              </div>
              ${visitDate ? `
              <div style="background:rgba(255,255,255,0.06);border-radius:8px;padding:12px;">
                <div style="color:#94a3b8;font-size:0.65rem;text-transform:uppercase;letter-spacing:0.06em;">Visit Date</div>
                <div style="color:#fbbf24;font-weight:800;font-size:0.95rem;margin-top:4px;">${new Date(visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>` : ''}
              <div style="background:rgba(255,255,255,0.06);border-radius:8px;padding:12px;">
                <div style="color:#94a3b8;font-size:0.65rem;text-transform:uppercase;letter-spacing:0.06em;">Eligible Branches</div>
                <div style="color:#fff;font-weight:700;font-size:0.85rem;margin-top:4px;">${branches?.join(', ') || 'All'}</div>
              </div>
            </div>
          </div>

          ${roles?.length ? `
          <div style="margin-bottom:24px;">
            <div style="font-weight:700;font-size:0.85rem;color:#1e293b;margin-bottom:10px;">🎯 Roles Offered</div>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
              ${roles.map(r => `<span style="background:#eff6ff;color:#1a56db;padding:5px 14px;border-radius:20px;font-size:0.78rem;font-weight:600;border:1px solid #bfdbfe;">${r}</span>`).join('')}
            </div>
          </div>` : ''}

          <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px;margin-bottom:24px;">
            <div style="font-weight:700;font-size:0.85rem;color:#92400e;margin-bottom:8px;">💡 Quick Tips</div>
            <ul style="margin:0;padding-left:18px;color:#78350f;font-size:0.82rem;line-height:1.8;">
              <li>Update your resume on PlaceTrack before the drive</li>
              <li>Check interview experiences from seniors on the platform</li>
              <li>Practice mock interviews using our AI tool</li>
              <li>Keep your documents ready (Aadhaar, marksheets, photos)</li>
            </ul>
          </div>

          <div style="text-align:center;margin-bottom:24px;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/login"
              style="background:linear-gradient(135deg,#1a56db,#06b6d4);color:#fff;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:700;font-size:0.95rem;display:inline-block;box-shadow:0 4px 16px rgba(26,86,219,0.4);">
              🚀 Login to PlaceTrack
            </a>
          </div>

          <p style="color:#94a3b8;font-size:0.78rem;text-align:center;margin:0;">
            All the best! 💪 — Sahyadri Placement Cell
          </p>
        </div>

        <div style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;text-align:center;">
          <p style="color:#94a3b8;font-size:0.75rem;margin:0;">
            PlaceTrack · Sahyadri College of Engineering & Management, Mangaluru<br/>
            <span style="color:#cbd5e1;">You received this because you are a registered student.</span>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"PlaceTrack · Sahyadri" <${process.env.EMAIL_USER}>`,
    to,
    subject: `🎯 You're Eligible for ${companyName} — ₹${packageMin}–${packageMax} LPA`,
    html,
  });
};

const sendResultEmail = async ({ to, studentName, companyName, role, package: pkg, status }) => {
  const isSelected = status === 'selected';
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <div style="background:${isSelected ? 'linear-gradient(135deg,#059669,#10b981)' : 'linear-gradient(135deg,#dc2626,#ef4444)'};padding:32px 40px;text-align:center;">
          <div style="font-size:3rem;">${isSelected ? '🎉' : '💪'}</div>
          <h1 style="color:#fff;margin:8px 0 0;font-size:1.6rem;font-weight:800;">${isSelected ? 'Congratulations!' : 'Keep Going!'}</h1>
        </div>
        <div style="padding:32px 40px;">
          <h2 style="color:#0f172a;margin:0 0 12px;">Hi ${studentName}!</h2>
          ${isSelected ? `
          <p style="color:#64748b;line-height:1.6;">You have been <strong style="color:#059669;">SELECTED</strong> at <strong>${companyName}</strong>! 🎊</p>
          <div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #bbf7d0;border-radius:12px;padding:24px;margin:20px 0;text-align:center;">
            <div style="font-size:0.75rem;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">Package Offered</div>
            <div style="font-size:3rem;font-weight:800;color:#059669;line-height:1;">₹${pkg}</div>
            <div style="font-size:0.85rem;color:#64748b;">LPA · ${role}</div>
          </div>
          <p style="color:#64748b;line-height:1.6;">Your hard work paid off. Welcome to the next chapter! 🚀</p>
          ` : `
          <p style="color:#64748b;line-height:1.6;">The result for <strong>${companyName}</strong> has been updated. Keep practicing and stay confident — more opportunities are coming!</p>
          <div style="background:#eff6ff;border-radius:10px;padding:16px;margin:16px 0;">
            <p style="color:#1e40af;margin:0;font-size:0.88rem;font-weight:600;">💡 Use our AI Mock Interview tool to practice and improve for the next drive!</p>
          </div>
          `}
          <div style="text-align:center;margin-top:24px;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/login" style="background:linear-gradient(135deg,#1a56db,#06b6d4);color:#fff;padding:13px 32px;border-radius:10px;text-decoration:none;font-weight:700;display:inline-block;">
              View on PlaceTrack
            </a>
          </div>
        </div>
        <div style="background:#f8fafc;padding:16px 40px;border-top:1px solid #e2e8f0;text-align:center;">
          <p style="color:#94a3b8;font-size:0.75rem;margin:0;">PlaceTrack · Sahyadri College, Mangaluru</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"PlaceTrack · Sahyadri" <${process.env.EMAIL_USER}>`,
    to,
    subject: isSelected ? `🎉 Congratulations! Selected at ${companyName} — ₹${pkg} LPA` : `Result Update — ${companyName}`,
    html,
  });
};

module.exports = { sendEligibilityEmail, sendResultEmail };
