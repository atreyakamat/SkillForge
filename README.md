# SkillForge - Personal Learning Skill Gap Analyzer

A comprehensive skill assessment and gap analysis platform built with React and Node.js.

## Features

- **Skill Assessment**: Self-rating and peer review system
- **Gap Analysis**: Visual skill gap identification with charts
- **Job Matching**: Match skills to job requirements
- **Learning Recommendations**: Personalized learning paths
- **Peer Reviews**: Collaborative skill validation
- **Analytics Dashboard**: Progress tracking and insights

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Chart.js for data visualization
- React Router for navigation
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing
- Express rate limiting

## Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- MongoDB (local or cloud)

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd SkillForge
npm run install:all
```

2. **Set up environment variables:**

Create `server/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillforge
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CORS_ORIGIN=http://localhost:5173
MONGO_MAX_POOL=10
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=SkillForge
```

3. **Start MongoDB:**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas cloud connection
```

4. **Seed the database:**
```bash
cd server
npm run seed
```

5. **Start development servers:**
```bash
# From root directory - starts both client and server
npm run dev

# Or start individually:
npm run client  # Frontend on http://localhost:5173
npm run server  # Backend on http://localhost:5000
```

## Demo Credentials

After seeding, you can log in with:
- Email: `alice@example.com` or `bob@example.com`
- Password: `DemoPass123!`

## Project Structure

```
SkillForge/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── utils/         # Utilities
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/       # Route handlers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── services/         # Business logic
│   └── utils/            # Utilities
└── package.json          # Monorepo configuration
```

## Available Scripts

### Root Level
- `npm run dev` - Start both client and server
- `npm run install:all` - Install all dependencies
- `npm run build` - Build client for production

### Client
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests

### Server
- `npm run dev` - Start with nodemon
- `npm run start` - Start production server
- `npm run seed` - Seed database with demo data
- `npm run test` - Run tests

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request

### Skills & Assessments
- `GET /api/skills` - Get all skills
- `POST /api/assessments` - Create skill assessment
- `GET /api/assessments` - Get user assessments

### Peer Reviews
- `POST /api/peer/request` - Request peer review
- `GET /api/peer/pending` - Get pending reviews
- `POST /api/peer/complete` - Complete peer review

### Analytics
- `GET /api/analytics/gaps` - Get skill gap analysis
- `GET /api/analytics/progress` - Get progress data

## Database Schema

### Users
- Profile information and authentication
- Skills with self-ratings and peer ratings
- Career goals and preferences

### Assessments
- Skill ratings with confidence levels
- Evidence and peer review data
- Validation status

### Peer Reviews
- Review requests and completions
- Anonymous/named review options
- Quality ratings

### Jobs
- Job postings with required skills
- Salary ranges and experience levels
- Industry and department categorization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details