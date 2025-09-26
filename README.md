SkillForge - Personal Learning Skill Gap Analyzer

Overview
SkillForge is a full‑stack web application that helps learners identify skill gaps, assess proficiency, and receive personalized learning recommendations. It supports authenticated user accounts, assessments, peer reviews, and job/role matching powered by a skill analysis service.

Tech Stack
- Frontend: React 18, Vite, Tailwind CSS, Axios, React Router
- Backend: Node.js, Express.js, MongoDB, Mongoose, JSON Web Tokens (JWT), Joi/Zod (validation)
- Tooling: npm, ESLint (optional), dotenv, CORS

Monorepo Layout
```
skillforge/
├── README.md
├── .gitignore
├── package.json
├── client/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── tailwind.config.js
│   ├── .env.example
│   ├── public/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       ├── contexts/
│       ├── hooks/
│       ├── services/
│       ├── utils/
│       └── pages/
├── server/
│   ├── package.json
│   ├── server.js
│   ├── .env.example
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   ├── services/
│   └── utils/
└── docs/
```

Quick Start
1) Requirements
- Node.js 18+
- npm 9+
- MongoDB (Atlas or local)

2) Install dependencies
```bash
npm run install:all
```

3) Environment setup
- Copy `client/.env.example` to `client/.env`
- Copy `server/.env.example` to `server/.env`

4) Start development (concurrently)
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

5) Build frontend
```bash
npm run build
```

Environment Variables
- Frontend (`client/.env`):
  - VITE_API_BASE_URL=http://localhost:5000/api

- Backend (`server/.env`):
  - PORT=5000
  - MONGODB_URI=mongodb://localhost:27017/skillforge
  - JWT_SECRET=replace_with_a_secure_random_string
  - CORS_ORIGIN=http://localhost:5173

Root Scripts
- `install:all` – install deps for client and server
- `dev` – run client and server concurrently
- `client` – start frontend dev server
- `server` – start backend server with nodemon
- `build` – build the React app

Project Goals (Hackathon TODOs)
- [ ] Implement authentication flows (register/login/logout, protected routes)
- [ ] Build assessment creation and submission flows
- [ ] Implement skill analysis and recommendations
- [ ] Add dashboard with progress and gap visualization
- [ ] Add peer review feature MVP

Team
- Product: Your Names Here
- Engineering: Your Names Here
- Design: Your Names Here

Notes
- This repository is scaffolded for fast iteration. Files include TODO comments where appropriate.

