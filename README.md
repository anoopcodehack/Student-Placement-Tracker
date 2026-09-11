# PlaceTrack — AI-Powered Student Placement Tracker

A full-stack MERN web application that digitizes campus placement management. It features real-time notifications, AI-driven resume scoring, an AI mock interview bot, an automated eligibility engine, email automation, and a multi-chart analytics dashboard built on MongoDB aggregation pipelines.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://student-placement-tracker-navy.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Live Demo

| | Link |
|---|---|
| Frontend | https://student-placement-tracker-navy.vercel.app |

---

## Screenshots

Dashboard · Students · Analytics · Profile · Landing Page

<img width="1897" height="857" alt="Dashboard preview" src="https://github.com/user-attachments/assets/ed8bf8d0-a068-4bd9-84e4-3a82f72a80ef" />

---

## System Flow

<img width="1536" height="1024" alt="System flow diagram" src="https://github.com/user-attachments/assets/39c909e0-5f0d-42ea-a68e-532c5788b9a6" />

---

## Features

| Module | Description |
|--------|-------------|
| Landing Page | Animated public page with live ticker, stat counters, company showcase, and dark/light mode |
| Dashboard | KPI cards, placement rate banner, branch-wise chart, donut chart, top companies table |
| Students | Full list with search, branch/batch/status filters, pagination, and clickable profiles |
| Companies | Card grid with package range, roles offered, eligibility criteria, and hired count |
| Placements | Offer records with automatic status updates, package highlights, and offer type badges |
| Analytics | Seven-plus charts — bar, line, doughnut, radar, and dual-axis trend visualizations |
| Eligibility Engine | Automatically filters eligible students by CGPA, backlogs, and branch when a company is added |
| AI Resume Scorer (ATS) | Upload resume and job description to receive match percentage, missing keywords, and improvement tips (Gemini AI) |
| AI Mock Interview | Company- and role-specific questions with real-time evaluation, scoring, and ideal answers |
| Real-Time Notifications | Socket.IO-powered instant alerts for drives, results, and eligibility updates |
| Email Automation | HTML emails via Nodemailer for eligibility alerts and placement congratulations |
| Profile | Student-facing tabs for academics, resume upload, ATS scoring, mock interviews, and placement status |
| Authentication | JWT login, Google OAuth, and role-based access control (Admin / Student / Viewer) |
| Dark Mode | Full dark/light theme toggle with persistence |
| Drive Calendar | Upcoming company visits with date tracking |
| Interview Experiences | Placed students share round details, questions, and tips for juniors |
| Seed Script | Generates 120 students, 12 companies, and roughly 78 placement records for demo purposes |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Bootstrap 5, Chart.js, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Real-Time | Socket.IO (WebSockets) |
| AI | Google Gemini API (ATS scoring, mock interview) |
| Email | Nodemailer, Gmail SMTP |
| Auth | JWT, Google OAuth (Passport.js) |
| File Upload | Multer (resume PDF) |
| Charts | Chart.js / react-chartjs-2 |
| Styling | Bootstrap 5, custom CSS |

---

## Project Structure

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
│   │   ├── companies.js       # Eligibility engine + email
│   │   ├── placements.js      # Congratulations email
│   │   ├── eligibility.js     # Eligibility check + notify
│   │   ├── ats.js             # AI resume ATS scorer
│   │   ├── mockInterview.js   # AI mock interview
│   │   ├── stats.js
│   │   └── profile.js
│   ├── socket/
│   │   └── socketHandler.js   # Socket.IO notification helper
│   ├── utils/
│   │   └── emailService.js    # Nodemailer HTML emails
│   ├── middleware/
│   │   └── auth.js
│   ├── seed/
│   │   └── seed.js
│   ├── uploads/
│   └── server.js              # Express + Socket.IO setup
│
└── client/
    └── src/
        ├── pages/
        │   ├── LandingPage.js
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
        │   ├── ATSScorer.js
        │   ├── MockInterview.js
        │   ├── EligibilityChecker.js
        │   ├── NotificationBell.js
        │   └── ...
        ├── context/
        │   ├── AuthContext.js
        │   ├── ThemeContext.js
        │   └── NotificationProvider.js
        └── socket.js
```

---

## Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Gmail account with an app password
- Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/anoopcodehack/placement-tracker.git
cd placement-tracker
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file:

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

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd ../client
npm install
npm start
```

Frontend runs at `http://localhost:3000`, backend at `http://localhost:5000`.

---

## Demo Login

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Admin | admin@college.edu | admin123 | Full access |
| Viewer | viewer@college.edu | viewer123 | Read only |
| Student | Sign up with roll number | — | Own profile + AI tools |

---

## API Endpoints

### Auth
```
POST  /api/auth/register
POST  /api/auth/login
GET   /api/auth/me
GET   /api/auth/google
```

### Students
```
GET    /api/students             # Filters: search, branch, batch, isPlaced, page
POST   /api/students             # Admin only
PUT    /api/students/:id         # Admin only
DELETE /api/students/:id         # Admin only
```

### Companies
```
GET    /api/companies            # Filters: search, industry
POST   /api/companies            # Triggers eligibility check, email, and socket notify
DELETE /api/companies/:id
```

### Placements
```
GET    /api/placements
POST   /api/placements           # Auto-updates student record + sends congratulations email
DELETE /api/placements/:id
```

### Eligibility Engine
```
GET   /api/eligibility/:companyId        # Get eligible students
POST  /api/eligibility/:companyId/notify # Notify all eligible students
POST  /api/eligibility/check             # Check a single student
```

### AI
```
POST  /api/ats                           # Resume ATS scorer (PDF + job description)
POST  /api/mock-interview/questions      # Generate five interview questions
POST  /api/mock-interview/evaluate       # Evaluate one answer
POST  /api/mock-interview/result         # Final score + improvement tips
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

## Role Access Matrix

| Feature | Admin | Student | Viewer |
|---|:---:|:---:|:---:|
| View Dashboard | Yes | Yes | Yes |
| View Analytics | Yes | Yes | Yes |
| Add/Delete Students | Yes | No | No |
| Add/Delete Companies | Yes | No | No |
| Record Placements | Yes | No | No |
| Eligibility Engine | Yes | No | No |
| AI ATS Resume Scorer | No | Yes | No |
| AI Mock Interview | No | Yes | No |
| Upload Resume | No | Yes | No |
| View Own Profile | No | Yes | Yes |
| Real-Time Notifications | Yes | Yes | No |

---

## Analytics Dashboard

- Overall placement rate banner with progress bar
- Branch-wise placement bar chart
- Placed vs. unplaced doughnut chart
- Package distribution bar chart
- Monthly offer trend line chart (dual axis)
- Top companies by offers bar chart
- Average CGPA by branch radar chart
- Company-wise breakdown table with share percentage
- Export to Excel / PDF

---

## AI Features

### Resume ATS Scorer
1. Student uploads a PDF resume
2. Student pastes a job description
3. Gemini AI analyzes both
4. Returns match percentage, matched keywords, missing keywords, strengths, and improvement suggestions

### Mock Interview Bot
1. Student selects company, role, and round
2. Gemini generates five real interview questions
3. Student answers each question
4. AI evaluates and returns a score out of 10 with an ideal answer
5. Final result includes overall score and improvement tips

---

## Notification System

**When an admin adds a company:**
1. The eligibility engine runs automatically
2. Eligible students receive a real-time Socket.IO alert, a detailed HTML email, and a dashboard notification
3. All other students receive a general "new company added" notification via Socket.IO

**When an admin records a placement:**
- The placed student receives a congratulations email automatically

---

## Societal Impact

| SDG | Mapping |
|-----|---------|
| SDG 4 — Quality Education | Improves placement transparency in institutions |
| SDG 8 — Decent Work | Connects students to employment efficiently |
| SDG 9 — Innovation | Promotes digital infrastructure in colleges |

---

## Roadmap

- [ ] Placement prediction using ML scoring
- [ ] Mobile app (React Native)
- [ ] Admin bulk import via CSV
- [ ] QR-code based student check-in for drives
- [ ] Multi-college support

---

## Author

**Anoop A** — Full Stack Developer, GFG Campus Mantri, Sahyadri College

[![GitHub](https://img.shields.io/badge/GitHub-anoopcodehack-181717?style=flat&logo=github)](https://github.com/anoopcodehack)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Anoop_A-0077B5?style=flat&logo=linkedin)](https://www.linkedin.com/in/anoop-a-95b7b3331/)

---

## License

MIT License — open source and free to use.
