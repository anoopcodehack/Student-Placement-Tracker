🎓 PlaceTrack — Student Placement Tracker
A full stack MERN app (MongoDB, Express, React, Node.js) with Bootstrap 5 for tracking college campus placements.

📁 Project Structure
placement-tracker/
├── server/          ← Express + MongoDB backend
│   ├── models/      ← Mongoose schemas
│   ├── routes/      ← REST API routes
│   ├── middleware/  ← JWT auth middleware
│   ├── seed/        ← Demo data seeder
│   └── index.js     ← Entry point
│
└── client/          ← React frontend
    └── src/
        ├── pages/   ← Dashboard, Students, Companies, Placements, Analytics
        ├── components/ ← Layout, Sidebar
        └── context/ ← Auth context (JWT)
⚙️ Tech Stack
Layer	Tech
Frontend	React 18, Bootstrap 5, Chart.js
Backend	Node.js, Express.js
Database	MongoDB + Mongoose
Auth	JWT (JSON Web Tokens)
Charts	react-chartjs-2
🚀 Setup & Run
1. Prerequisites
Node.js v16+
MongoDB running locally OR MongoDB Atlas URI
2. Backend Setup
cd server
npm install
cp .env.example .env        # Edit MONGO_URI if needed
npm run seed                # Load 120 students + 12 companies + placements
npm run dev                 # Start on http://localhost:5000
3. Frontend Setup
cd client
npm install
npm start                   # Start on http://localhost:3000
🔐 Demo Login Credentials
Role	Email	Password
Admin	admin@college.edu	admin123
Viewer	viewer@college.edu	viewer123
Admin can Add / Edit / Delete students, companies, placements.
Viewer can only view data & analytics.

📊 Features
Dashboard — KPI cards, branch-wise chart, placement donut, top companies table
Students — Full list with search, branch/batch/status filters, pagination
Companies — Card view with package range, roles, hired count
Placements — Offer records with student + company info, package highlights
Analytics — 7+ charts: bar, line, doughnut, radar, dual-axis trend, company breakdown
Auth — JWT login, role-based access (admin vs viewer)
Seed Script — 120 students, 12 companies, ~78 placement records auto-generated
🌐 API Endpoints
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me

GET    /api/students          ?search= &branch= &batch= &isPlaced= &page=
POST   /api/students
PUT    /api/students/:id
DELETE /api/students/:id

GET    /api/companies         ?search= &industry=
POST   /api/companies
DELETE /api/companies/:id

GET    /api/placements        ?offerType= &status=
POST   /api/placements
DELETE /api/placements/:id

GET    /api/stats/overview    ?batch=
GET    /api/stats/branch-wise
GET    /api/stats/package-distribution
GET    /api/stats/monthly-trend
GET    /api/stats/company-wise
GET    /api/stats/batches
🏗️ Deploy
Backend → Railway / Render / Heroku
Frontend → Vercel / Netlify (set REACT_APP_API_URL to backend URL)
Database → MongoDB Atlas (free tier)

👨‍💻 Built With
React · Express · MongoDB · Bootstrap 5 · Chart.js · JWT · Mongoose
