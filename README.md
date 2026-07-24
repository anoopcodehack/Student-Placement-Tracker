# 🎓 PlaceTrack — AI-Powered Student Placement Tracker

> A full-stack **MERN** web application that completely digitizes campus placement management — featuring **real-time Socket.IO notifications**, **AI Resume ATS Scoring**, **AI Mock Interview Bot**, **Eligibility Engine**, **Email Automation**, **JWT + Google OAuth**, **role-based access control**, and a **7-chart analytics dashboard** built on MongoDB aggregation pipelines.

---

## 🚀 Live Demo

| | Link |
|---|---|
| 🔗 Frontend | **https://student-placement-tracker-navy.vercel.app** |

---

## 📸 Screenshots

> Dashboard · Students · Analytics · Profile · Landing Page

<img width="1897" height="857" alt="image" src="https://github.com/user-attachments/assets/ed8bf8d0-a068-4bd9-84e4-3a82f72a80ef" />

---

## 🔄 System Flow

<img width="1536" height="1024" alt="flow pic" src="https://github.com/user-attachments/assets/39c909e0-5f0d-42ea-a68e-532c5788b9a6" />

---

## ✨ Features

| Module | What it does |
|--------|-------------|
| 🌐 **Landing Page** | Animated public page with live ticker, stat counters, company showcase, dark/light mode |
| 📊 **Dashboard** | KPI cards, placement rate banner, branch-wise chart, donut chart, top companies table |
| 👥 **Students** | Full list with search, branch/batch/status filters, pagination, clickable profiles |
| 🏢 **Companies** | Card grid with package range, roles offered, eligibility criteria, hired count |
| 🏆 **Placements** | Offer records with auto status update, package highlights, offer type badges |
| 📈 **Analytics** | 7+ charts — bar, line, doughnut, radar, dual-axis trend, company breakdown |
| 🎯 **Eligibility Engine** | Auto-filters eligible students by CGPA, backlogs, branch when company is added |
| 🤖 **AI ATS Scorer** | Upload resume + paste JD → match %, missing keywords, improvement tips (Gemini AI) |
| 🎤 **AI Mock Interview** | Company + role specific questions → real-time evaluation → score + ideal answers |
| 🔔 **Real-time Notifications** | Socket.IO powered — instant alerts for drives, results, eligibility |
| 📧 **Email Automation** | Beautiful HTML emails via Nodemailer — eligibility alerts + congratulations on placement |
| 👤 **Profile** | Student tabs — Academic, Resume upload, ATS Scorer, Mock Interview, Placement status |
| 🔐 **Auth** | JWT login, Google OAuth, role-based access (Admin / Student / Viewer) |
| 🌙 **Dark Mode** | Full dark/light mode toggle with persistence |
| 🗓️ **Drive Calendar** | Upcoming company visits with date tracking |
| 💬 **Interview Experiences** | Placed students share rounds, questions & tips for juniors |
| 🌱 **Seed Script** | 120 students, 12 companies, ~78 placement records auto-generated |

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Bootstrap 5, Chart.js, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Real-time** | Socket.IO (WebSockets) |
| **AI** | Google Gemini API (ATS Scoring + Mock Interview) |
| **Email** | Nodemailer + Gmail SMTP |
| **Auth** | JWT + Google OAuth (Passport.js) |
| **File Upload** | Multer (Resume PDF) |
| **Charts** | Chart.js / react-chartjs-2 |
| **Styling** | Bootstrap 5 + Custom CSS |

---

## 📁 Project Structure

```
placement-tracker/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Company.js
│   │   └── Placement.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── students.js
│   │   ├── companies.js       ← Eligibility Engine + Email
│   │   ├── placements.js      ← Congratulations Email
│   │   ├── eligibility.js     ← Eligibility check + notify
│   │   ├── ats.js             ← AI Resume ATS Scorer
│   │   ├── mockInterview.js   ← AI Mock Interview
│   │   ├── stats.js
│   │   └── profile.js
│   ├── socket/
│   │   └── socketHandler.js   ← Socket.IO notification helper
│   ├── utils/
│   │   └── emailService.js    ← Nodemailer HTML emails
│   ├── middleware/
│   │   └── auth.js
│   ├── seed/
│   │   └── seed.js
│   ├── uploads/
│   └── server.js              ← Express + Socket.IO setup
│
└── client/
    └── src/
        ├── pages/
        │   ├── LandingPage.js     ← Public animated landing
        │   ├── Dashboard.js
        │   ├── Students.js
        │   ├── Companies.js
        │   ├── Placements.js
        │   ├── Analytics.js
        │   ├── Profile.js
        │   ├── Notifications.js
        │   └── ...
        ├── components/
        │   ├── Layout.js
        │   ├── ATSScorer.js       ← AI Resume Scorer
        │   ├── MockInterview.js   ← AI Mock Interview
        │   ├── EligibilityChecker.js ← Eligibility Engine UI
        │   ├── NotificationBell.js
        │   └── ...
        ├── context/
        │   ├── AuthContext.js
        │   ├── ThemeContext.js
        │   └── NotificationProvider.js ← Socket.IO context
        └── socket.js              ← Socket.IO client
```

---

## 🛠️ Setup & Run

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Gmail account with App Password
- Google Gemini API key

---

### 1️⃣ Clone the repo

```bash
git clone https://github.com/anoopcodehack/placement-tracker.git
cd placement-tracker
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/placement_tracker
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:3000
NODE_ENV=development

# Email (Gmail App Password)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_digit_app_password

# AI
GEMINI_API_KEY=your_gemini_api_key_here
```

Seed demo data:

```bash
npm run seed
```

Start backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd ../client
npm install
npm start
```

> 🌐 Frontend: `http://localhost:3000` · Backend: `http://localhost:5000`

---

## 🔐 Demo Login

| Role | Email | Password | Access |
|------|-------|----------|--------|
| 🛡️ Admin | admin@college.edu | admin123 | Full access |
| 👁️ Viewer | viewer@college.edu | viewer123 | Read only |
| 🎓 Student | Sign up with Roll No | — | Own profile + AI tools |

---

## 🌐 API Endpoints

### Auth
```
POST  /api/auth/register
POST  /api/auth/login
GET   /api/auth/me
GET   /api/auth/google
```

### Students
```
GET    /api/students             ← Filters: search, branch, batch, isPlaced, page
POST   /api/students             ← Admin only
PUT    /api/students/:id         ← Admin only
DELETE /api/students/:id         ← Admin only
```

### Companies
```
GET    /api/companies            ← Filters: search, industry
POST   /api/companies            ← Triggers eligibility + email + socket notify
DELETE /api/companies/:id
```

### Placements
```
GET    /api/placements
POST   /api/placements           ← Auto updates student + sends congrats email
DELETE /api/placements/:id
```

### Eligibility Engine
```
GET   /api/eligibility/:companyId        ← Get eligible students
POST  /api/eligibility/:companyId/notify ← Notify all eligible
POST  /api/eligibility/check             ← Check one student
```

### AI
```
POST  /api/ats                           ← Resume ATS Scorer (PDF + JD)
POST  /api/mock-interview/questions      ← Generate 5 questions
POST  /api/mock-interview/evaluate       ← Evaluate one answer
POST  /api/mock-interview/result         ← Final score + tips
```

### Analytics
```
GET   /api/stats/overview
GET   /api/stats/branch-wise
GET   /api/stats/package-distribution
GET   /api/stats/monthly-trend
GET   /api/stats/company-wise
GET   /api/stats/batches
```

---

## 🎯 Role Access Matrix

```
Feature                    Admin    Student    Viewer
─────────────────────────────────────────────────────
View Dashboard             ✅        ✅         ✅
View Analytics             ✅        ✅         ✅
Add/Delete Students        ✅        ❌         ❌
Add/Delete Companies       ✅        ❌         ❌
Record Placements          ✅        ❌         ❌
Eligibility Engine         ✅        ❌         ❌
AI ATS Resume Scorer       ❌        ✅         ❌
AI Mock Interview          ❌        ✅         ❌
Upload Resume              ❌        ✅         ❌
View Own Profile           ❌        ✅         ✅
Real-time Notifications    ✅        ✅         ❌
```

---

## 📊 Analytics Dashboard

- ✅ Overall placement rate banner with progress bar
- ✅ Branch-wise placement bar chart
- ✅ Placed vs Unplaced doughnut chart
- ✅ Package distribution bar chart
- ✅ Monthly offer trend line chart (dual axis)
- ✅ Top companies by offers bar chart
- ✅ Avg CGPA by branch radar chart
- ✅ Company-wise breakdown table with share %
- ✅ Export to Excel / PDF

---

## 🤖 AI Features

### Resume ATS Scorer
```
Student uploads PDF resume
         ↓
Paste job description
         ↓
Gemini AI analyzes both
         ↓
Returns: Match % · Matched keywords
         Missing keywords · Strengths
         Improvement suggestions
```

### Mock Interview Bot
```
Select Company + Role + Round
         ↓
Gemini generates 5 real questions
         ↓
Student answers each one
         ↓
AI evaluates → Score/10 + Ideal answer
         ↓
Final result + Tips to improve
```

---

## 🔔 Notification System

```
Admin adds company
      ↓
Eligibility Engine runs
      ↓
┌─────────────────────────┐
│ Eligible Students       │
│ 🎯 "You are eligible!" │ ← Socket.IO popup
│ 📧 Detailed HTML email  │ ← Nodemailer
│ 🔔 Dashboard bell       │ ← Notifications page
└─────────────────────────┘
┌─────────────────────────┐
│ Other Students          │
│ 🏢 "New company added"  │ ← Socket.IO only
└─────────────────────────┘

Admin records placement
      ↓
🎉 Congratulations email → Student
```

---

## 🌍 Societal Impact

| SDG | Mapping |
|-----|---------|
| 🎓 SDG 4 — Quality Education | Improves placement transparency in institutions |
| 💼 SDG 8 — Decent Work | Connects students to employment efficiently |
| 🏗️ SDG 9 — Innovation | Promotes digital infrastructure in colleges |

---

## 🔮 Roadmap

- [ ] Placement prediction using ML scoring
- [ ] Mobile app (React Native)
- [ ] Admin bulk import via CSV
- [ ] QR-code based student check-in for drives
- [ ] Multi-college support

---

## 👨‍💻 Author

**Anoop A** — Full Stack Developer · GFG Campus Mantri · Sahyadri College

[![GitHub](https://img.shields.io/badge/GitHub-anoopcodehack-181717?style=flat&logo=github)](https://github.com/anoopcodehack)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Anoop_A-0077B5?style=flat&logo=linkedin)](https://www.linkedin.com/in/anoop-a-95b7b3331/)

---

## 📄 License

MIT License — open source and free to use.

---

<div align="center">
  <p>⭐ Star this repo if you found it helpful!</p>
  <p>Made with ❤️ to solve a real problem at Sahyadri College</p>
</div>
