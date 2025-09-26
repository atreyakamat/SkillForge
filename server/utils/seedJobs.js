import Job from '../models/Job.js'

/**
 * Sample job data for testing and development
 */
export const sampleJobs = [
  {
    title: "Senior Full Stack Developer",
    company: {
      name: "TechCorp",
      logo: "https://example.com/techcorp-logo.png",
      website: "https://techcorp.com",
      description: "Leading technology company specializing in enterprise solutions",
      size: "large",
      industry: "Technology"
    },
    description: "We are looking for a Senior Full Stack Developer to join our growing team. You'll work on cutting-edge web applications using modern technologies.",
    responsibilities: [
      "Develop and maintain full-stack web applications",
      "Collaborate with cross-functional teams",
      "Write clean, maintainable code",
      "Participate in code reviews"
    ],
    qualifications: [
      "5+ years of full-stack development experience",
      "Strong knowledge of React and Node.js",
      "Experience with databases and API design",
      "Excellent problem-solving skills"
    ],
    location: {
      city: "San Francisco",
      state: "CA",
      country: "US",
      remote: true,
      hybrid: true
    },
    employmentType: "full-time",
    experienceLevel: "senior",
    salary: {
      min: 120000,
      max: 180000,
      currency: "USD",
      period: "annual"
    },
    skills: {
      required: [
        { name: "React", level: 4, category: "technical", weight: 1 },
        { name: "Node.js", level: 4, category: "technical", weight: 1 },
        { name: "JavaScript", level: 5, category: "technical", weight: 1 },
        { name: "TypeScript", level: 3, category: "technical", weight: 0.8 },
        { name: "MongoDB", level: 3, category: "technical", weight: 0.7 }
      ],
      preferred: [
        { name: "AWS", level: 3, category: "technical", weight: 0.6 },
        { name: "Docker", level: 2, category: "technical", weight: 0.5 },
        { name: "GraphQL", level: 2, category: "technical", weight: 0.4 }
      ]
    },
    benefits: {
      health: true,
      dental: true,
      vision: true,
      retirement: true,
      vacation: "Unlimited PTO",
      professional_development: true,
      remote_work: true,
      flexible_hours: true
    },
    application: {
      url: "https://techcorp.com/careers/senior-fullstack",
      status: "active"
    },
    source: "company"
  },
  
  {
    title: "Frontend Developer",
    company: {
      name: "StartupXYZ",
      logo: "https://example.com/startupxyz-logo.png",
      website: "https://startupxyz.com", 
      description: "Fast-growing fintech startup",
      size: "startup",
      industry: "Financial Services"
    },
    description: "Join our dynamic team as a Frontend Developer and help build the next generation of financial tools.",
    responsibilities: [
      "Build responsive user interfaces",
      "Optimize application performance",
      "Work closely with designers",
      "Implement new features"
    ],
    qualifications: [
      "3+ years of frontend development experience",
      "Proficiency in React",
      "Knowledge of modern CSS",
      "Experience with state management"
    ],
    location: {
      city: "New York",
      state: "NY", 
      country: "US",
      remote: false,
      hybrid: true
    },
    employmentType: "full-time",
    experienceLevel: "mid",
    salary: {
      min: 90000,
      max: 130000,
      currency: "USD",
      period: "annual",
      equity: {
        offered: true,
        range: "0.1% - 0.5%"
      }
    },
    skills: {
      required: [
        { name: "React", level: 4, category: "technical", weight: 1 },
        { name: "JavaScript", level: 4, category: "technical", weight: 1 },
        { name: "CSS", level: 4, category: "technical", weight: 0.9 },
        { name: "HTML", level: 5, category: "technical", weight: 0.8 }
      ],
      preferred: [
        { name: "TypeScript", level: 3, category: "technical", weight: 0.7 },
        { name: "Redux", level: 2, category: "technical", weight: 0.6 },
        { name: "Figma", level: 2, category: "technical", weight: 0.4 }
      ]
    },
    benefits: {
      health: true,
      dental: true,
      vision: false,
      retirement: false,
      vacation: "20 days",
      professional_development: true,
      remote_work: false,
      flexible_hours: true
    },
    application: {
      url: "https://startupxyz.com/jobs/frontend-dev",
      status: "active"
    },
    source: "company"
  },

  {
    title: "Backend Engineer", 
    company: {
      name: "DataFlow Inc",
      logo: "https://example.com/dataflow-logo.png",
      website: "https://dataflow.com",
      description: "Data analytics and machine learning company",
      size: "medium",
      industry: "Data & Analytics"
    },
    description: "We're seeking a Backend Engineer to design and implement scalable API services for our analytics platform.",
    responsibilities: [
      "Design and develop RESTful APIs",
      "Optimize database queries",
      "Implement security best practices",
      "Monitor system performance"
    ],
    qualifications: [
      "4+ years of backend development experience",
      "Strong Python or Node.js skills",
      "Database design experience",
      "Cloud platform knowledge"
    ],
    location: {
      city: "Austin",
      state: "TX",
      country: "US", 
      remote: true,
      hybrid: false
    },
    employmentType: "full-time",
    experienceLevel: "senior",
    salary: {
      min: 110000,
      max: 150000,
      currency: "USD", 
      period: "annual"
    },
    skills: {
      required: [
        { name: "Python", level: 4, category: "technical", weight: 1 },
        { name: "PostgreSQL", level: 4, category: "technical", weight: 0.9 },
        { name: "API Design", level: 4, category: "technical", weight: 0.9 },
        { name: "AWS", level: 3, category: "technical", weight: 0.8 }
      ],
      preferred: [
        { name: "Docker", level: 3, category: "technical", weight: 0.6 },
        { name: "Kubernetes", level: 2, category: "technical", weight: 0.5 },
        { name: "Redis", level: 2, category: "technical", weight: 0.4 }
      ]
    },
    benefits: {
      health: true,
      dental: true,
      vision: true,
      retirement: true,
      vacation: "25 days",
      professional_development: true, 
      remote_work: true,
      flexible_hours: true
    },
    application: {
      url: "https://dataflow.com/careers/backend-engineer",
      status: "active"
    },
    source: "company"
  },

  {
    title: "Junior Web Developer",
    company: {
      name: "Creative Agency",
      logo: "https://example.com/creative-logo.png", 
      website: "https://creativeagency.com",
      description: "Full-service digital marketing and web development agency",
      size: "small",
      industry: "Marketing & Advertising"
    },
    description: "Perfect opportunity for a Junior Web Developer to grow their skills in a collaborative environment.",
    responsibilities: [
      "Build websites using HTML, CSS, and JavaScript", 
      "Assist with WordPress development",
      "Collaborate on client projects",
      "Learn from senior developers"
    ],
    qualifications: [
      "1-2 years of web development experience",
      "Knowledge of HTML, CSS, JavaScript",
      "Basic understanding of responsive design", 
      "Eagerness to learn new technologies"
    ],
    location: {
      city: "Portland",
      state: "OR",
      country: "US",
      remote: false,
      hybrid: false
    },
    employmentType: "full-time",
    experienceLevel: "junior", 
    salary: {
      min: 50000,
      max: 70000,
      currency: "USD",
      period: "annual"
    },
    skills: {
      required: [
        { name: "HTML", level: 3, category: "technical", weight: 1 },
        { name: "CSS", level: 3, category: "technical", weight: 1 },
        { name: "JavaScript", level: 2, category: "technical", weight: 0.9 }
      ],
      preferred: [
        { name: "WordPress", level: 2, category: "technical", weight: 0.7 },
        { name: "PHP", level: 1, category: "technical", weight: 0.5 },
        { name: "Photoshop", level: 2, category: "technical", weight: 0.4 }
      ]
    },
    benefits: {
      health: true,
      dental: false,
      vision: false,
      retirement: false,
      vacation: "15 days",
      professional_development: true,
      remote_work: false, 
      flexible_hours: false
    },
    application: {
      url: "https://creativeagency.com/careers",
      status: "active"
    },
    source: "company"
  },

  {
    title: "DevOps Engineer",
    company: {
      name: "CloudTech Solutions",
      logo: "https://example.com/cloudtech-logo.png",
      website: "https://cloudtech.com",
      description: "Cloud infrastructure and DevOps consulting company",
      size: "medium", 
      industry: "Technology"
    },
    description: "Looking for a DevOps Engineer to help clients build and maintain scalable cloud infrastructure.",
    responsibilities: [
      "Design CI/CD pipelines",
      "Manage cloud infrastructure",
      "Implement monitoring solutions",
      "Automate deployment processes"
    ],
    qualifications: [
      "3+ years of DevOps experience",
      "Strong knowledge of AWS/Azure",
      "Experience with containerization",
      "Infrastructure as Code experience"
    ],
    location: {
      city: "Seattle",
      state: "WA",
      country: "US",
      remote: true,
      hybrid: true
    },
    employmentType: "full-time",
    experienceLevel: "mid",
    salary: {
      min: 100000,
      max: 140000, 
      currency: "USD",
      period: "annual"
    },
    skills: {
      required: [
        { name: "AWS", level: 4, category: "technical", weight: 1 },
        { name: "Docker", level: 4, category: "technical", weight: 1 },
        { name: "Kubernetes", level: 3, category: "technical", weight: 0.9 },
        { name: "Terraform", level: 3, category: "technical", weight: 0.8 }
      ],
      preferred: [
        { name: "Jenkins", level: 3, category: "technical", weight: 0.6 },
        { name: "Python", level: 2, category: "technical", weight: 0.5 },
        { name: "Prometheus", level: 2, category: "technical", weight: 0.4 }
      ]
    },
    benefits: {
      health: true,
      dental: true, 
      vision: true,
      retirement: true,
      vacation: "Unlimited PTO",
      professional_development: true,
      remote_work: true,
      flexible_hours: true
    },
    application: {
      url: "https://cloudtech.com/jobs/devops-engineer", 
      status: "active"
    },
    source: "company"
  }
]

/**
 * Seed the database with sample job data
 */
export async function seedJobDatabase() {
  try {
    // Clear existing jobs
    await Job.deleteMany({})
    
    // Insert sample jobs
    const insertedJobs = await Job.insertMany(sampleJobs)
    
    console.log(`Successfully seeded ${insertedJobs.length} jobs`)
    return insertedJobs
    
  } catch (error) {
    console.error('Error seeding job database:', error)
    throw error
  }
}

/**
 * Get sample job data for testing
 */
export function getSampleJobs() {
  return sampleJobs
}