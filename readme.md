# 📄 Career Spark AI Resume Analyzer

An end-to-end full-stack web application that allows users to upload resumes (PDF), extract structured information, and get **AI-powered feedback** such as strengths, weaknesses, suggested skills, and ATS score.

---

## 🚀 Features

- **User Authentication**
  - Register/Login with JWT and cookies
  - Protected routes on backend
- **Resume Upload**
  - PDF parsing via [`pdf-parse`](https://www.npmjs.com/package/pdf-parse)
  - File validation (PDF only, max 10 MB)
- **AI Analysis**
  - Integrated with [Google Gemini API](https://ai.google.dev/)
  - Generates:
    - Candidate summary
    - Strengths
    - Areas to improve
    - Suggested skills
    - Overall rating (1–10)
    - ATS score (0–100)
- **History View**
  - Store analyzed resumes in PostgreSQL
  - Retrieve previous analyses with full details
- **Modern Frontend**
  - Built with React + Tailwind CSS
  - File drag & drop upload
  - Clean UI with loading states and responsive design

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Axios  
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL (Neon free tier or local Postgres)  
- **AI Integration:** Google Gemini API via `@google/generative-ai`  
- **Auth:** JWT + cookies (`httpOnly` or client-managed token)  

---

## 📂 Project Structure

```text
career-spark-ai-resume-analyzer/
├── server/                  # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/          # DB connection + env configs
│   │   ├── controllers/     # Auth + Resume controllers
│   │   ├── routes/          # Express route definitions
│   │   ├── middleware/      # Auth middleware
│   │   └── utils/           # Gemini service, helpers
│   ├── package.json
│   └── server.js
│
├── client/                  # Frontend (React + Vite + TS)
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page-level views (Login, Register, Dashboard)
│   │   ├── services/        # API + auth service functions
│   │   ├── utils/           # Axios instance & helpers
│   │   └── types/           # TypeScript types
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── sample_data/             # Example resumes for testing
├── screenshots/             # UI screenshots
└── README.md

yaml
Copy code

---

## ⚙️ Setup & Installation

### 1. Clone repo

```bash
git clone https://github.com/rahulprasanna012/career-spark-ai-resume-analyzer.git
cd career-spark-ai-resume-analyzer
2. Backend setup
bash
Copy code
cd server
npm install
Create .env inside /server:

env
Copy code
PORT=8080
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=your_db_host
DB_PORT=5432
DB_DATABASE=your_db
JWT_SECRET=your_secret_key
GOOGLE_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
Run server:

bash
Copy code
npm run dev
3. Frontend setup
bash
Copy code
cd ../client
npm install
Create .env inside /client:

env
Copy code
VITE_API_BASE_URL=http://localhost:8080/api
Run frontend:

bash
Copy code
npm run dev
🧪 Testing
Upload a sample resume PDF from /sample_data/

Observe analysis results with strengths, weaknesses, and ATS score

Register/Login → upload → check history tab