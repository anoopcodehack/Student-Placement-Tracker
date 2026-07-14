# 🎓 PlaceTrack — Student Placement Tracker

> A full-stack **MERN** web application that digitizes campus placement management for colleges — featuring real-time notifications via Socket.IO, AI-powered Resume ATS Scoring, AI Mock Interview simulation, JWT + Google OAuth authentication, role-based access control (Admin / Student / Viewer), and a 7-chart analytics dashboard built on MongoDB aggregation pipelines.

---

## 🚀 Live Demo

| | Link |
|---|---|
| 🔗 Frontend | [https://student-placement-tracker-navy.vercel.app/login] |


---

## 📸 Screenshots

> Dashboard · Students · Analytics · Profile


<img width="1897" height="857" alt="image" src="https://github.com/user-attachments/assets/ed8bf8d0-a068-4bd9-84e4-3a82f72a80ef" />


---

## 🧩 Features

| Module | What it does |
|--------|-------------|
| 📊 **Dashboard** | KPI cards, placement rate banner, branch-wise chart, donut chart, top companies table |
| 👥 **Students** | Full list with search, branch / batch / status filters, pagination, clickable profiles |
| 🏢 **Companies** | Card grid with package range, roles offered, eligibility criteria, hired count |
| 🏆 **Placements** | Offer records with auto status update, package highlights, offer type badges |
| 📈 **Analytics** | 7+ charts — bar, line, doughnut, radar, dual-axis trend, company breakdown |
| 👤 **Profile** | Student tabs — Academic, Resume upload, Placement status, Change password |
| 🔐 **Auth** | JWT login, Google OAuth, role-based access (Admin / Student / Viewer) |
| 🌙 **Dark Mode** | Full dark / light mode toggle with localStorage persistence |
| 🌱 **Seed Script** | 120 students, 12 companies, ~78 placement records auto-generated |

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Bootstrap 5, Chart.js, react-chartjs-2 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT (JSON Web Tokens) + Google OAuth (Passport.js) |
| **File Upload** | Multer (Resume PDF upload) |
| **Charts** | Chart.js / react-chartjs-2 |
| **Styling** | Bootstrap 5 + Custom CSS |

---

## 📁 Project Structure

```
placement-tracker/
├── server/                  ← Express + MongoDB backend
│   ├── models/              ← Mongoose schemas
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Company.js
│   │   └── Placement.js
│   ├── routes/              ← REST API routes
│   │   ├── auth.js
│   │   ├── students.js
│   │   ├── companies.js
│   │   ├── placements.js
│   │   ├── stats.js
│   │   └── profile.js
│   ├── middleware/
│   │   └── auth.js          ← JWT middleware
│   ├── seed/
│   │   └── seed.js          ← Demo data seeder
│   ├── uploads/             ← Resume PDF storage
│   └── index.js             ← Entry point
│
└── client/                  ← React frontend
    └── src/
        ├── pages/           ← Dashboard, Students, Companies,
        │                       Placements, Analytics, Profile
        ├── components/      ← Layout, Sidebar, Modals
        └── context/         ← AuthContext, ThemeContext
```

---

## 🛠️ Setup & Run

### Prerequisites
- Node.js v16+
- MongoDB running locally **OR** MongoDB Atlas URI

---

### 1️⃣ Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/placement-tracker.git
cd placement-tracker
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` file:

```env
PORT=5000
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/placement_tracker
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Load demo data:

```bash
npm run seed        # Loads 120 students + 12 companies + ~78 placements
```

Start backend:

```bash
npm run dev         # Starts on http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```bash
cd ../client
npm install
npm start           # Starts on http://localhost:3000
```

---

## 🔐 Demo Login Credentials

| Role | Email | Password | Access |
|------|-------|----------|--------|
| 🛡️ Admin || Full access — add / edit / delete |
| 👁️ Viewer | viewer@college.edu | viewer123 | Read only — view data & analytics |
| 🎓 Student | Sign up with Roll No | — | Own profile, resume, placement status |

---

## 🌐 API Endpoints

### Auth
```
POST   /api/auth/register        ← Register (with rollNo for student)
POST   /api/auth/login           ← Login
GET    /api/auth/me              ← Get current user
GET    /api/auth/google          ← Google OAuth
```

### Students
```
GET    /api/students             ← Get all (filters: search, branch, batch, isPlaced, page)
POST   /api/students             ← Add student (admin)
PUT    /api/students/:id         ← Update student (admin)
DELETE /api/students/:id         ← Delete student (admin)
```

### Companies
```
GET    /api/companies            ← Get all (filters: search, industry)
POST   /api/companies            ← Add company (admin)
DELETE /api/companies/:id        ← Delete company (admin)
```

### Placements
```
GET    /api/placements           ← Get all (filters: offerType, status)
POST   /api/placements           ← Record placement — auto updates student (admin)
DELETE /api/placements/:id       ← Remove placement (admin)
```

### Analytics
```
GET    /api/stats/overview       ← KPI numbers (batch filter)
GET    /api/stats/branch-wise    ← Branch placement counts
GET    /api/stats/package-distribution  ← Package brackets
GET    /api/stats/monthly-trend  ← Monthly offer trend
GET    /api/stats/company-wise   ← Top companies
GET    /api/stats/batches        ← Available batch years
```

### Profile
```
GET    /api/profile              ← Get my profile + student data
PUT    /api/profile              ← Update name, phone, linkedin, github
POST   /api/profile/resume       ← Upload resume PDF (student only)
PUT    /api/profile/change-password  ← Change password
```

---

## 🎯 User Roles Explained

```
Admin      →  Full access. Add students, companies, placements. View everything.
Viewer     →  Read only. View dashboard, students, analytics. No edit access.
Student    →  Sign up with Roll No → auto-linked to student profile
               → View own CGPA, skills, placement status
               → Upload / download resume PDF
               → Change password
```

---

## 📊 Analytics Dashboard Includes

- ✅ Overall placement rate banner
- ✅ Branch-wise placement bar chart
- ✅ Placed vs Unplaced doughnut chart
- ✅ Package distribution bar chart
- ✅ Monthly offer trend line chart (dual axis)
- ✅ Top companies by offers bar chart
- ✅ Avg CGPA by branch radar chart
- ✅ Company-wise breakdown table with share %

---

## 🌍 Societal Impact & SDGs

| SDG | Mapping |
|-----|---------|
| 🎓 SDG 4 — Quality Education | Improves placement process transparency in institutions |
| 💼 SDG 8 — Decent Work & Economic Growth | Connects students to employment opportunities efficiently |
| 🏗️ SDG 9 — Industry, Innovation & Infrastructure | Promotes digital infrastructure in educational institutions |

---

## 🔮 Future Scope

- [ ] Email notifications to eligible students when company visits
- [ ] Eligibility auto-filter based on CGPA, branch, backlogs
- [ ] Export placement report as Excel / PDF
- [ ] Placement prediction using ML scoring
- [ ] Interview experience section for placed students
- [ ] Mobile app using React Native

---

## 👨‍💻 Built With

**React · Express · MongoDB · Bootstrap 5 · Chart.js · JWT · Passport.js · Multer · Mongoose**

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <p>⭐ Star this repo if you found it helpful!</p>
  <p>Made with ❤️ to solve a real problem</p>
</div>
