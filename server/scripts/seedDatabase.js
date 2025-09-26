import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

// Import your models (adjust paths as needed)
import User from '../models/User.js'
import Skill from '../models/Skill.js'
import Job from '../models/Job.js'
import Assessment from '../models/Assessment.js'
import PeerReview from '../models/PeerReview.js'

// COMPREHENSIVE SKILLS DATA (50+ skills across all domains)
const skillsData = [
  // ===== PROGRAMMING LANGUAGES =====
  {
    name: 'JavaScript',
    category: 'Programming Languages',
    subcategory: 'Frontend',
    description: 'Dynamic programming language for web development',
    industryRelevance: 9,
    marketDemand: 10,
    salaryImpact: { entry: 65000, mid: 85000, senior: 120000 },
    relatedSkills: ['React', 'Node.js', 'TypeScript', 'Vue.js'],
    prerequisites: ['HTML', 'CSS'],
    proficiencyLevels: {
      '1-2': 'Basic syntax, variables, functions, basic DOM manipulation',
      '3-4': 'Event handling, AJAX, ES6 features, async programming',
      '5-6': 'Advanced ES6+, modules, webpack, testing frameworks',
      '7-8': 'Design patterns, performance optimization, complex applications',
      '9-10': 'Architecture decisions, mentoring, framework contributions'
    }
  },
  {
    name: 'TypeScript',
    category: 'Programming Languages',
    subcategory: 'Frontend',
    description: 'Typed superset of JavaScript for large-scale applications',
    industryRelevance: 8,
    marketDemand: 9,
    salaryImpact: { entry: 70000, mid: 90000, senior: 128000 },
    relatedSkills: ['JavaScript', 'React', 'Angular', 'Node.js'],
    prerequisites: ['JavaScript'],
    proficiencyLevels: {
      '1-2': 'Basic types, interfaces, basic compilation',
      '3-4': 'Advanced types, generics, utility types',
      '5-6': 'Complex type systems, conditional types, mapped types',
      '7-8': 'Advanced patterns, library development, complex configs',
      '9-10': 'Type system mastery, tooling development, community contributions'
    }
  },
  {
    name: 'Python',
    category: 'Programming Languages',
    subcategory: 'Backend',
    description: 'Versatile language for web development, data science, and automation',
    industryRelevance: 10,
    marketDemand: 10,
    salaryImpact: { entry: 70000, mid: 95000, senior: 140000 },
    relatedSkills: ['Django', 'Flask', 'Data Science', 'Machine Learning', 'PostgreSQL'],
    prerequisites: ['Programming Basics'],
    proficiencyLevels: {
      '1-2': 'Basic syntax, data types, control structures, simple scripts',
      '3-4': 'Functions, classes, file I/O, exception handling',
      '5-6': 'Advanced OOP, decorators, generators, package management',
      '7-8': 'Metaprogramming, async programming, performance optimization',
      '9-10': 'Architecture design, framework development, team leadership'
    }
  },
  {
    name: 'Java',
    category: 'Programming Languages',
    subcategory: 'Backend',
    description: 'Enterprise-grade object-oriented programming language',
    industryRelevance: 9,
    marketDemand: 8,
    salaryImpact: { entry: 68000, mid: 88000, senior: 125000 },
    relatedSkills: ['Spring Boot', 'Maven', 'Gradle', 'JUnit'],
    prerequisites: ['Programming Basics', 'OOP Concepts'],
    proficiencyLevels: {
      '1-2': 'Basic syntax, OOP principles, simple applications',
      '3-4': 'Collections, exceptions, multithreading basics',
      '5-6': 'Advanced OOP, design patterns, Spring framework',
      '7-8': 'JVM internals, performance tuning, enterprise patterns',
      '9-10': 'Architecture design, framework development, mentoring'
    }
  },
  {
    name: 'Go',
    category: 'Programming Languages',
    subcategory: 'Backend',
    description: 'Fast, compiled language designed for modern software development',
    industryRelevance: 7,
    marketDemand: 8,
    salaryImpact: { entry: 75000, mid: 95000, senior: 135000 },
    relatedSkills: ['Docker', 'Kubernetes', 'Microservices', 'gRPC'],
    prerequisites: ['Programming Basics'],
    proficiencyLevels: {
      '1-2': 'Basic syntax, goroutines, channels, simple programs',
      '3-4': 'Interfaces, packages, error handling, testing',
      '5-6': 'Advanced concurrency, reflection, build tools',
      '7-8': 'Performance optimization, systems programming',
      '9-10': 'Language expertise, open source contributions, mentoring'
    }
  },
  {
    name: 'Rust',
    category: 'Programming Languages',
    subcategory: 'Systems',
    description: 'Memory-safe systems programming language',
    industryRelevance: 6,
    marketDemand: 7,
    salaryImpact: { entry: 80000, mid: 105000, senior: 150000 },
    relatedSkills: ['Systems Programming', 'WebAssembly', 'CLI Tools'],
    prerequisites: ['Programming Basics', 'Memory Management'],
    proficiencyLevels: {
      '1-2': 'Basic ownership, borrowing, basic syntax',
      '3-4': 'Lifetimes, traits, pattern matching, cargo',
      '5-6': 'Advanced ownership, unsafe code, macros',
      '7-8': 'Systems programming, performance optimization',
      '9-10': 'Language mastery, crate development, community leadership'
    }
  },

  // ===== FRONTEND FRAMEWORKS & LIBRARIES =====
  {
    name: 'React',
    category: 'Frontend Frameworks',
    subcategory: 'JavaScript',
    description: 'Component-based library for building user interfaces',
    industryRelevance: 9,
    marketDemand: 9,
    salaryImpact: { entry: 68000, mid: 88000, senior: 125000 },
    relatedSkills: ['JavaScript', 'TypeScript', 'Redux', 'Next.js', 'Testing Library'],
    prerequisites: ['JavaScript', 'HTML', 'CSS'],
    proficiencyLevels: {
      '1-2': 'Basic components, JSX, props, simple state management',
      '3-4': 'Hooks, context, lifecycle methods, event handling',
      '5-6': 'Advanced patterns, performance optimization, custom hooks',
      '7-8': 'Architecture patterns, testing strategies, accessibility',
      '9-10': 'Framework expertise, performance optimization, team leadership'
    }
  },
  {
    name: 'Vue.js',
    category: 'Frontend Frameworks',
    subcategory: 'JavaScript',
    description: 'Progressive framework for building user interfaces',
    industryRelevance: 7,
    marketDemand: 7,
    salaryImpact: { entry: 62000, mid: 82000, senior: 115000 },
    relatedSkills: ['JavaScript', 'Vuex', 'Nuxt.js', 'Vue Router'],
    prerequisites: ['JavaScript', 'HTML', 'CSS'],
    proficiencyLevels: {
      '1-2': 'Basic templates, directives, component basics',
      '3-4': 'Component communication, lifecycle, Vue CLI',
      '5-6': 'Vuex state management, router, advanced components',
      '7-8': 'Custom directives, plugins, performance optimization',
      '9-10': 'Framework mastery, architectural decisions, mentoring'
    }
  },
  {
    name: 'Angular',
    category: 'Frontend Frameworks',
    subcategory: 'TypeScript',
    description: 'Full-featured framework for building web applications',
    industryRelevance: 8,
    marketDemand: 7,
    salaryImpact: { entry: 70000, mid: 90000, senior: 125000 },
    relatedSkills: ['TypeScript', 'RxJS', 'Angular CLI', 'NgRx'],
    prerequisites: ['TypeScript', 'HTML', 'CSS'],
    proficiencyLevels: {
      '1-2': 'Components, templates, basic services, dependency injection',
      '3-4': 'Routing, forms, HTTP client, pipes',
      '5-6': 'Advanced patterns, RxJS, testing, guards',
      '7-8': 'Performance optimization, custom schematics, architecture',
      '9-10': 'Framework expertise, enterprise applications, leadership'
    }
  },
  {
    name: 'Next.js',
    category: 'Frontend Frameworks',
    subcategory: 'React',
    description: 'Production-ready React framework with SSR and static generation',
    industryRelevance: 8,
    marketDemand: 8,
    salaryImpact: { entry: 70000, mid: 92000, senior: 130000 },
    relatedSkills: ['React', 'JavaScript', 'TypeScript', 'Vercel'],
    prerequisites: ['React', 'JavaScript'],
    proficiencyLevels: {
      '1-2': 'Basic routing, pages, API routes, deployment',
      '3-4': 'SSR, SSG, dynamic routing, optimization',
      '5-6': 'Advanced features, middleware, configuration',
      '7-8': 'Performance optimization, custom server, scaling',
      '9-10': 'Framework mastery, architectural decisions, team guidance'
    }
  },

  // ===== BACKEND FRAMEWORKS =====
  {
    name: 'Node.js',
    category: 'Backend Frameworks',
    subcategory: 'JavaScript',
    description: 'JavaScript runtime for server-side development',
    industryRelevance: 8,
    marketDemand: 8,
    salaryImpact: { entry: 72000, mid: 92000, senior: 130000 },
    relatedSkills: ['JavaScript', 'Express', 'MongoDB', 'npm', 'API Development'],
    prerequisites: ['JavaScript'],
    proficiencyLevels: {
      '1-2': 'Basic server setup, modules, npm, simple APIs',
      '3-4': 'Express framework, middleware, routing, database integration',
      '5-6': 'Authentication, testing, deployment, performance',
      '7-8': 'Microservices, scaling, security best practices',
      '9-10': 'Architecture design, performance optimization, team leadership'
    }
  },
  {
    name: 'Express',
    category: 'Backend Frameworks',
    subcategory: 'Node.js',
    description: 'Minimal web application framework for Node.js',
    industryRelevance: 8,
    marketDemand: 8,
    salaryImpact: { entry: 70000, mid: 90000, senior: 125000 },
    relatedSkills: ['Node.js', 'JavaScript', 'MongoDB', 'JWT', 'REST APIs'],
    prerequisites: ['Node.js', 'JavaScript'],
    proficiencyLevels: {
      '1-2': 'Basic routing, middleware, request/response handling',
      '3-4': 'Advanced middleware, error handling, templating',
      '5-6': 'Authentication, validation, security, testing',
      '7-8': 'Performance optimization, scalability, best practices',
      '9-10': 'Framework expertise, architectural patterns, mentoring'
    }
  },
  {
    name: 'Django',
    category: 'Backend Frameworks',
    subcategory: 'Python',
    description: 'High-level Python web framework for rapid development',
    industryRelevance: 8,
    marketDemand: 7,
    salaryImpact: { entry: 75000, mid: 95000, senior: 135000 },
    relatedSkills: ['Python', 'PostgreSQL', 'REST APIs', 'Django REST Framework'],
    prerequisites: ['Python'],
    proficiencyLevels: {
      '1-2': 'Models, views, templates, admin interface, basic apps',
      '3-4': 'Forms, authentication, middleware, URL patterns',
      '5-6': 'Advanced models, custom managers, signals, testing',
      '7-8': 'Performance optimization, caching, deployment, security',
      '9-10': 'Framework mastery, custom packages, architectural guidance'
    }
  },
  {
    name: 'Flask',
    category: 'Backend Frameworks',
    subcategory: 'Python',
    description: 'Lightweight Python web framework',
    industryRelevance: 7,
    marketDemand: 6,
    salaryImpact: { entry: 68000, mid: 88000, senior: 125000 },
    relatedSkills: ['Python', 'Jinja2', 'SQLAlchemy', 'REST APIs'],
    prerequisites: ['Python'],
    proficiencyLevels: {
      '1-2': 'Basic routes, templates, request handling',
      '3-4': 'Blueprints, database integration, forms',
      '5-6': 'Authentication, testing, deployment, extensions',
      '7-8': 'Advanced patterns, performance, security',
      '9-10': 'Framework expertise, microservices, team leadership'
    }
  },
  {
    name: 'Spring Boot',
    category: 'Backend Frameworks',
    subcategory: 'Java',
    description: 'Framework for building production-ready Spring applications',
    industryRelevance: 9,
    marketDemand: 8,
    salaryImpact: { entry: 75000, mid: 95000, senior: 135000 },
    relatedSkills: ['Java', 'Spring Framework', 'Maven', 'JPA', 'REST APIs'],
    prerequisites: ['Java', 'Spring Framework'],
    proficiencyLevels: {
      '1-2': 'Basic applications, auto-configuration, REST controllers',
      '3-4': 'Data access, security, testing, profiles',
      '5-6': 'Microservices, actuator, advanced configuration',
      '7-8': 'Performance tuning, monitoring, cloud deployment',
      '9-10': 'Enterprise architecture, framework expertise, mentoring'
    }
  },

  // ===== DATABASES =====
  {
    name: 'MongoDB',
    category: 'Databases',
    subcategory: 'NoSQL',
    description: 'Document-oriented NoSQL database',
    industryRelevance: 8,
    marketDemand: 8,
    salaryImpact: { entry: 65000, mid: 85000, senior: 115000 },
    relatedSkills: ['Node.js', 'Express', 'Mongoose', 'Database Design'],
    prerequisites: ['Database Basics'],
    proficiencyLevels: {
      '1-2': 'Basic CRUD operations, simple queries, collections',
      '3-4': 'Indexes, aggregation pipelines, data modeling',
      '5-6': 'Advanced queries, performance optimization, replication',
      '7-8': 'Sharding, security, monitoring, backup strategies',
      '9-10': 'Architecture design, cluster management, team guidance'
    }
  },
  {
    name: 'PostgreSQL',
    category: 'Databases',
    subcategory: 'SQL',
    description: 'Advanced open-source relational database',
    industryRelevance: 9,
    marketDemand: 9,
    salaryImpact: { entry: 68000, mid: 88000, senior: 125000 },
    relatedSkills: ['SQL', 'Database Design', 'Python', 'Java'],
    prerequisites: ['SQL', 'Database Basics'],
    proficiencyLevels: {
      '1-2': 'Basic SQL operations, table creation, simple queries',
      '3-4': 'Advanced SQL, indexes, constraints, functions',
      '5-6': 'Performance tuning, advanced features, extensions',
      '7-8': 'High availability, replication, security, monitoring',
      '9-10': 'Database architecture, cluster management, expertise sharing'
    }
  },
  {
    name: 'MySQL',
    category: 'Databases',
    subcategory: 'SQL',
    description: 'Popular open-source relational database',
    industryRelevance: 8,
    marketDemand: 8,
    salaryImpact: { entry: 62000, mid: 82000, senior: 115000 },
    relatedSkills: ['SQL', 'Database Design', 'PHP', 'Java'],
    prerequisites: ['SQL', 'Database Basics'],
    proficiencyLevels: {
      '1-2': 'Basic operations, table design, simple queries',
      '3-4': 'Indexes, stored procedures, views, optimization',
      '5-6': 'Advanced features, replication, performance tuning',
      '7-8': 'High availability, security, monitoring, backup',
      '9-10': 'Database expertise, architecture decisions, mentoring'
    }
  },
  {
    name: 'Redis',
    category: 'Databases',
    subcategory: 'Cache',
    description: 'In-memory data structure store for caching and sessions',
    industryRelevance: 7,
    marketDemand: 7,
    salaryImpact: { entry: 70000, mid: 92000, senior: 125000 },
    relatedSkills: ['Caching', 'Session Management', 'Node.js', 'Python'],
    prerequisites: ['Database Basics'],
    proficiencyLevels: {
      '1-2': 'Basic operations, strings, lists, sets, configuration',
      '3-4': 'Advanced data structures, pub/sub, persistence',
      '5-6': 'Clustering, replication, memory optimization',
      '7-8': 'Performance tuning, monitoring, security',
      '9-10': 'Architecture design, scaling strategies, team guidance'
    }
  },

  // ===== CLOUD PLATFORMS =====
  {
    name: 'AWS',
    category: 'Cloud Platforms',
    subcategory: 'Infrastructure',
    description: 'Amazon Web Services cloud computing platform',
    industryRelevance: 9,
    marketDemand: 10,
    salaryImpact: { entry: 75000, mid: 100000, senior: 145000 },
    relatedSkills: ['Docker', 'Kubernetes', 'DevOps', 'Linux'],
    prerequisites: ['Linux Basics', 'Networking'],
    proficiencyLevels: {
      '1-2': 'Basic services (EC2, S3, RDS), console navigation',
      '3-4': 'VPC, security groups, IAM, CloudWatch basics',
      '5-6': 'Advanced services, CloudFormation, auto-scaling',
      '7-8': 'Architecture design, cost optimization, multi-region',
      '9-10': 'Enterprise architecture, disaster recovery, team leadership'
    }
  },
  {
    name: 'Azure',
    category: 'Cloud Platforms',
    subcategory: 'Infrastructure',
    description: 'Microsoft cloud computing platform',
    industryRelevance: 8,
    marketDemand: 8,
    salaryImpact: { entry: 72000, mid: 95000, senior: 140000 },
    relatedSkills: ['Microsoft Technologies', 'DevOps', 'Kubernetes'],
    prerequisites: ['Cloud Basics', 'Networking'],
    proficiencyLevels: {
      '1-2': 'Basic services, resource groups, virtual machines',
      '3-4': 'App services, databases, storage, networking',
      '5-6': 'Advanced services, ARM templates, monitoring',
      '7-8': 'Architecture design, security, cost management',
      '9-10': 'Enterprise solutions, hybrid cloud, leadership'
    }
  },
  {
    name: 'Google Cloud',
    category: 'Cloud Platforms',
    subcategory: 'Infrastructure',
    description: 'Google Cloud Platform for scalable computing',
    industryRelevance: 7,
    marketDemand: 7,
    salaryImpact: { entry: 70000, mid: 92000, senior: 135000 },
    relatedSkills: ['Kubernetes', 'Docker', 'Machine Learning', 'BigQuery'],
    prerequisites: ['Cloud Basics', 'Linux'],
    proficiencyLevels: {
      '1-2': 'Basic services, Compute Engine, Cloud Storage',
      '3-4': 'App Engine, Cloud SQL, networking, monitoring',
      '5-6': 'Advanced services, deployment manager, security',
      '7-8': 'Architecture design, machine learning services',
      '9-10': 'Platform expertise, enterprise solutions, mentoring'
    }
  },

  // ===== DEVOPS & TOOLS =====
  {
    name: 'Docker',
    category: 'DevOps Tools',
    subcategory: 'Containerization',
    description: 'Platform for developing and running containerized applications',
    industryRelevance: 8,
    marketDemand: 9,
    salaryImpact: { entry: 70000, mid: 95000, senior: 135000 },
    relatedSkills: ['Kubernetes', 'CI/CD', 'Linux', 'AWS'],
    prerequisites: ['Linux', 'Command Line'],
    proficiencyLevels: {
      '1-2': 'Basic containers, images, Dockerfile, docker-compose',
      '3-4': 'Multi-stage builds, volumes, networking, registries',
      '5-6': 'Optimization, security, orchestration basics',
      '7-8': 'Production deployment, monitoring, troubleshooting',
      '9-10': 'Container architecture, enterprise patterns, team guidance'
    }
  },
  {
    name: 'Kubernetes',
    category: 'DevOps Tools',
    subcategory: 'Orchestration',
    description: 'Container orchestration platform for automating deployment',
    industryRelevance: 8,
    marketDemand: 9,
    salaryImpact: { entry: 80000, mid: 105000, senior: 150000 },
    relatedSkills: ['Docker', 'AWS', 'DevOps', 'Helm'],
    prerequisites: ['Docker', 'Linux', 'Networking'],
    proficiencyLevels: {
      '1-2': 'Basic concepts, pods, services, deployments',
      '3-4': 'ConfigMaps, secrets, ingress, persistent volumes',
      '5-6': 'Advanced features, RBAC, monitoring, helm',
      '7-8': 'Cluster administration, networking, security',
      '9-10': 'Platform engineering, enterprise deployment, leadership'
    }
  },
  {
    name: 'Jenkins',
    category: 'DevOps Tools',
    subcategory: 'CI/CD',
    description: 'Automation server for continuous integration and deployment',
    industryRelevance: 7,
    marketDemand: 7,
    salaryImpact: { entry: 68000, mid: 88000, senior: 125000 },
    relatedSkills: ['CI/CD', 'Docker', 'Git', 'Scripting'],
    prerequisites: ['Version Control', 'Basic Scripting'],
    proficiencyLevels: {
      '1-2': 'Basic jobs, build triggers, plugins, simple pipelines',
      '3-4': 'Advanced pipelines, parameterized builds, notifications',
      '5-6': 'Declarative pipelines, distributed builds, security',
      '7-8': 'Advanced administration, scaling, integration',
      '9-10': 'Enterprise deployment, custom solutions, mentoring'
    }
  },
  {
    name: 'Git',
    category: 'DevOps Tools',
    subcategory: 'Version Control',
    description: 'Distributed version control system',
    industryRelevance: 10,
    marketDemand: 10,
    salaryImpact: { entry: 0, mid: 5000, senior: 10000 },
    relatedSkills: ['GitHub', 'GitLab', 'CI/CD', 'Code Review'],
    prerequisites: ['Command Line Basics'],
    proficiencyLevels: {
      '1-2': 'Basic commands, commits, branches, remote repositories',
      '3-4': 'Merging, rebasing, conflict resolution, tagging',
      '5-6': 'Advanced workflows, hooks, submodules, workflows',
      '7-8': 'Git internals, advanced troubleshooting, team workflows',
      '9-10': 'Git expertise, workflow optimization, team training'
    }
  },

  // ===== SOFT SKILLS =====
  {
    name: 'Communication',
    category: 'Soft Skills',
    subcategory: 'Interpersonal',
    description: 'Clear and effective verbal and written communication',
    industryRelevance: 10,
    marketDemand: 10,
    salaryImpact: { entry: 5000, mid: 10000, senior: 20000 },
    relatedSkills: ['Leadership', 'Teamwork', 'Presentation', 'Writing'],
    prerequisites: [],
    proficiencyLevels: {
      '1-2': 'Basic clarity, active listening, simple presentations',
      '3-4': 'Structured communication, email etiquette, meeting participation',
      '5-6': 'Persuasive communication, conflict resolution, cross-functional collaboration',
      '7-8': 'Public speaking, stakeholder management, technical writing',
      '9-10': 'Executive communication, influence, thought leadership'
    }
  },
  {
    name: 'Leadership',
    category: 'Soft Skills',
    subcategory: 'Management',
    description: 'Ability to guide, inspire, and develop teams',
    industryRelevance: 9,
    marketDemand: 8,
    salaryImpact: { entry: 10000, mid: 20000, senior: 35000 },
    relatedSkills: ['Communication', 'Project Management', 'Coaching', 'Strategy'],
    prerequisites: ['Communication', 'Teamwork'],
    proficiencyLevels: {
      '1-2': 'Basic delegation, team coordination, simple decisions',
      '3-4': 'Motivation techniques, feedback delivery, goal setting',
      '5-6': 'Strategic thinking, change management, team development',
      '7-8': 'Organizational leadership, vision setting, culture building',
      '9-10': 'Executive leadership, transformation, industry influence'
    }
  },
  {
    name: 'Project Management',
    category: 'Soft Skills',
    subcategory: 'Management',
    description: 'Planning, executing, and delivering projects successfully',
    industryRelevance: 9,
    marketDemand: 8,
    salaryImpact: { entry: 8000, mid: 15000, senior: 25000 },
    relatedSkills: ['Leadership', 'Communication', 'Agile', 'Risk Management'],
    prerequisites: ['Organization', 'Communication'],
    proficiencyLevels: {
      '1-2': 'Basic planning, task tracking, simple timelines',
      '3-4': 'Risk management, stakeholder communication, resource allocation',
      '5-6': 'Agile methodologies, team coordination, quality management',
      '7-8': 'Portfolio management, strategic alignment, process improvement',
      '9-10': 'Program management, organizational change, PMO leadership'
    }
  },
  {
    name: 'Problem Solving',
    category: 'Soft Skills',
    subcategory: 'Analytical',
    description: 'Systematic approach to identifying and solving complex problems',
    industryRelevance: 10,
    marketDemand: 10,
    salaryImpact: { entry: 5000, mid: 12000, senior: 20000 },
    relatedSkills: ['Critical Thinking', 'Analysis', 'Decision Making'],
    prerequisites: ['Analytical Thinking'],
    proficiencyLevels: {
      '1-2': 'Basic problem identification, simple troubleshooting',
      '3-4': 'Structured problem-solving, root cause analysis',
      '5-6': 'Complex problem decomposition, solution evaluation',
      '7-8': 'Strategic problem solving, system thinking, innovation',
      '9-10': 'Expert problem solver, methodology development, mentoring'
    }
  },
  {
    name: 'Teamwork',
    category: 'Soft Skills',
    subcategory: 'Interpersonal',
    description: 'Collaborative working in diverse team environments',
    industryRelevance: 10,
    marketDemand: 10,
    salaryImpact: { entry: 3000, mid: 8000, senior: 15000 },
    relatedSkills: ['Communication', 'Empathy', 'Conflict Resolution'],
    prerequisites: ['Communication'],
    proficiencyLevels: {
      '1-2': 'Basic collaboration, respect for others, task sharing',
      '3-4': 'Active participation, constructive feedback, support',
      '5-6': 'Cross-functional collaboration, team building, facilitation',
      '7-8': 'Team leadership, culture development, high-performance teams',
      '9-10': 'Team dynamics expertise, organizational collaboration, mentoring'
    }
  },

  // ===== Programming Languages =====
  {
    name: 'Machine Learning',
    category: 'Programming Languages',
    subcategory: 'AI/ML',
    description: 'Algorithms and models for predictive analytics and automation',
    industryRelevance: 9,
    marketDemand: 9,
    salaryImpact: { entry: 85000, mid: 115000, senior: 165000 },
    relatedSkills: ['Python', 'TensorFlow', 'scikit-learn', 'Data Science'],
    prerequisites: ['Python', 'Statistics', 'Mathematics'],
    proficiencyLevels: {
      '1-2': 'Basic concepts, simple models, data preprocessing',
      '3-4': 'Supervised learning, model evaluation, feature engineering',
      '5-6': 'Advanced algorithms, deep learning basics, deployment',
      '7-8': 'Complex models, optimization, production systems',
      '9-10': 'ML expertise, research, architectural decisions, leadership'
    }
  },
  {
    name: 'Data Science',
    category: 'Programming Languages',
    subcategory: 'Analytics',
    description: 'Extracting insights and knowledge from structured and unstructured data',
    industryRelevance: 9,
    marketDemand: 9,
    salaryImpact: { entry: 80000, mid: 110000, senior: 160000 },
    relatedSkills: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
    prerequisites: ['Python', 'Statistics', 'SQL'],
    proficiencyLevels: {
      '1-2': 'Basic analysis, data cleaning, simple visualizations',
      '3-4': 'Statistical analysis, hypothesis testing, advanced visualization',
      '5-6': 'Predictive modeling, machine learning, big data tools',
      '7-8': 'Advanced analytics, optimization, business strategy',
      '9-10': 'Data science leadership, research, strategic insights'
    }
  },
  {
    name: 'Blockchain',
    category: 'Programming Languages',
    subcategory: 'Distributed Systems',
    description: 'Decentralized ledger technology for secure transactions',
    industryRelevance: 6,
    marketDemand: 6,
    salaryImpact: { entry: 75000, mid: 100000, senior: 145000 },
    relatedSkills: ['Cryptography', 'Smart Contracts', 'Ethereum', 'Solidity'],
    prerequisites: ['Programming Basics', 'Cryptography Basics'],
    proficiencyLevels: {
      '1-2': 'Basic concepts, cryptocurrency understanding, wallet usage',
      '3-4': 'Smart contract basics, blockchain development, testing',
      '5-6': 'Advanced contracts, DeFi protocols, security best practices',
      '7-8': 'Architecture design, scalability solutions, optimization',
      '9-10': 'Blockchain expertise, protocol development, thought leadership'
    }
  }
];

// COMPREHENSIVE JOB POSTINGS (15+ diverse roles)
const jobsData = [
  // ===== SENIOR ROLES =====
  {
    title: 'Senior Frontend Developer',
    company: {
      name: 'TechFlow Solutions',
      industry: 'Technology',
      size: 'large'
    },
    location: {
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      hybrid: true
    },
    employmentType: 'full-time',
    experienceLevel: 'senior',
    skills: {
      required: [
        { name: 'JavaScript', level: 5, category: 'technical', weight: 1.0 },
        { name: 'React', level: 4, category: 'technical', weight: 0.9 },
        { name: 'TypeScript', level: 4, category: 'technical', weight: 0.8 },
        { name: 'Communication', level: 4, category: 'soft', weight: 0.8 }
      ],
      preferred: [
        { name: 'Next.js', level: 3, category: 'technical', weight: 0.6 },
        { name: 'Node.js', level: 3, category: 'technical', weight: 0.5 },
        { name: 'Leadership', level: 3, category: 'soft', weight: 0.7 }
      ]
    },
    salary: {
      min: 140000,
      max: 180000,
      currency: 'USD',
      period: 'annual',
      equity: { offered: true, range: '0.1% - 0.5%' }
    },
    benefits: {
      health: true,
      dental: true,
      vision: true,
      retirement: true,
      vacation: '25 days',
      professional_development: true,
      remote_work: true,
      flexible_hours: true,
      other: ['Gym membership', 'Catered meals', 'Conference budget']
    },
    description: 'Lead frontend architecture and mentor junior developers in building scalable React applications.',
    responsibilities: [
      'Lead frontend architecture decisions and code reviews',
      'Mentor junior and mid-level developers',
      'Build and maintain complex React applications',
      'Collaborate with design and backend teams',
      'Drive technical innovation and best practices'
    ],
    qualifications: [
      "Bachelor's degree in Computer Science or equivalent experience",
      '5+ years of professional JavaScript development',
      '4+ years of React experience',
      'Strong TypeScript skills',
      'Experience with modern build tools and CI/CD'
    ],
    application: {
      status: 'active',
      deadline: new Date('2025-11-20')
    },
    postedDate: new Date('2025-09-20'),
    tags: ['frontend', 'react', 'javascript', 'senior', 'leadership']
  },

  {
    title: 'Full Stack Engineer',
    company: {
      name: 'DataViz Pro',
      industry: 'Technology',
      size: 'medium'
    },
    location: {
      city: 'Austin',
      state: 'TX', 
      country: 'USA',
      remote: true
    },
    employmentType: 'full-time',
    experienceLevel: 'mid',
    skills: {
      required: [
        { name: 'JavaScript', level: 4, category: 'technical', weight: 1.0 },
        { name: 'Python', level: 4, category: 'technical', weight: 1.0 },
        { name: 'React', level: 4, category: 'technical', weight: 0.9 },
        { name: 'PostgreSQL', level: 3, category: 'technical', weight: 0.8 }
      ],
      preferred: [
        { name: 'Django', level: 3, category: 'technical', weight: 0.7 },
        { name: 'AWS', level: 3, category: 'technical', weight: 0.6 },
        { name: 'Docker', level: 3, category: 'technical', weight: 0.6 }
      ]
    },
    salary: {
      min: 100000,
      max: 135000,
      currency: 'USD',
      period: 'annual',
      equity: { offered: true, range: '0.3% - 1.0%' }
    },
    benefits: {
      health: true,
      dental: true,
      retirement: true,
      vacation: 'Unlimited PTO',
      professional_development: true,
      remote_work: true,
      flexible_hours: true,
      other: ['Learning budget', 'Home office stipend']
    },
    description: 'Build end-to-end data visualization applications with modern web technologies.',
    responsibilities: [
      'Develop full-stack web applications for data visualization',
      'Design and implement RESTful APIs',
      'Work with large datasets and optimize performance',
      'Collaborate with data scientists and designers'
    ],
    qualifications: [
      "Bachelor's degree or equivalent experience",
      '3+ years full-stack development experience',
      'Strong Python and JavaScript skills',
      'Experience with data visualization libraries'
    ],
    application: {
      status: 'active',
      deadline: new Date('2025-11-22')
    },
    postedDate: new Date('2025-09-22'),
    tags: ['fullstack', 'javascript', 'python', 'data', 'remote']
  },

  {
    title: 'Backend Engineer - Cloud Infrastructure',
    company: {
      name: 'CloudScale Systems',
      industry: 'Technology',
      size: 'large'
    },
    location: {
      city: 'Seattle',
      state: 'WA',
      country: 'USA',
      remote: false
    },
    employmentType: 'full-time',
    experienceLevel: 'mid',
    skills: {
      required: [
        { name: 'Go', level: 4, category: 'technical', weight: 1.0 },
        { name: 'AWS', level: 4, category: 'technical', weight: 0.9 },
        { name: 'Docker', level: 4, category: 'technical', weight: 0.8 },
        { name: 'Kubernetes', level: 3, category: 'technical', weight: 0.8 }
      ],
      preferred: [
        { name: 'PostgreSQL', level: 3, category: 'technical', weight: 0.6 },
        { name: 'Terraform', level: 3, category: 'technical', weight: 0.6 },
        { name: 'Problem Solving', level: 4, category: 'soft', weight: 0.7 }
      ]
    },
    salary: {
      min: 120000,
      max: 160000,
      currency: 'USD',
      period: 'annual',
      equity: { offered: true, range: '0.05% - 0.2%' }
    },
    benefits: {
      health: true,
      dental: true,
      vision: true,
      retirement: true,
      vacation: '22 days',
      professional_development: true,
      remote_work: false,
      flexible_hours: true,
      other: ['Transit pass', 'Fitness reimbursement']
    },
    description: 'Build and maintain scalable cloud infrastructure and backend services.',
    responsibilities: [
      'Design and implement scalable backend systems',
      'Manage cloud infrastructure on AWS',
      'Optimize system performance and reliability',
      'Implement monitoring and alerting systems'
    ],
    qualifications: [
      "Bachelor's degree in Computer Science or related field",
      '4+ years backend development experience',
      'Strong experience with Go and cloud platforms',
      'Experience with containerization and orchestration'
    ],
    application: {
      status: 'active',
      deadline: new Date('2025-12-15')
    },
    postedDate: new Date('2025-09-25'),
    tags: ['backend', 'go', 'aws', 'kubernetes', 'infrastructure']
  },

  {
    title: 'DevOps Engineer',
    company: {
      name: 'FinTech Innovations',
      industry: 'Financial Services',
      size: 'medium'
    },
    location: {
      city: 'New York',
      state: 'NY',
      country: 'USA',
      hybrid: true
    },
    employmentType: 'full-time',
    experienceLevel: 'mid',
    skills: {
      required: [
        { name: 'AWS', level: 4, category: 'technical', weight: 1.0 },
        { name: 'Docker', level: 4, category: 'technical', weight: 0.9 },
        { name: 'Kubernetes', level: 4, category: 'technical', weight: 0.9 },
        { name: 'Jenkins', level: 3, category: 'technical', weight: 0.8 }
      ],
      preferred: [
        { name: 'Python', level: 3, category: 'technical', weight: 0.6 },
        { name: 'Terraform', level: 3, category: 'technical', weight: 0.7 },
        { name: 'Git', level: 4, category: 'technical', weight: 0.8 }
      ]
    },
    salary: {
      min: 115000,
      max: 150000,
      currency: 'USD',
      period: 'annual',
      equity: { offered: false }
    },
    benefits: {
      health: true,
      dental: true,
      vision: true,
      retirement: true,
      vacation: '20 days',
      professional_development: true,
      remote_work: true,
      flexible_hours: true,
      other: ['Stock options', 'Financial planning assistance']
    },
    description: 'Streamline development workflows and maintain robust CI/CD pipelines in a regulated environment.',
    responsibilities: [
      'Design and maintain CI/CD pipelines',
      'Manage AWS cloud infrastructure',
      'Implement monitoring and logging solutions',
      'Ensure security and compliance requirements'
    ],
    qualifications: [
      "Bachelor's degree or equivalent experience",
      '3+ years DevOps or infrastructure experience',
      'Strong knowledge of AWS and containerization',
      'Experience with financial services compliance preferred'
    ],
    application: {
      status: 'active',
      deadline: new Date('2025-12-01')
    },
    postedDate: new Date('2025-09-24'),
    tags: ['devops', 'aws', 'kubernetes', 'fintech', 'ci-cd']
  },

  {
    title: 'Machine Learning Engineer',
    company: {
      name: 'AI Research Labs',
      industry: 'Technology',
      size: 'medium'
    },
    location: {
      city: 'Palo Alto',
      state: 'CA',
      country: 'USA',
      hybrid: true
    },
    employmentType: 'full-time',
    experienceLevel: 'mid',
    skills: {
      required: [
        { name: 'Python', level: 5, category: 'technical', weight: 1.0 },
        { name: 'Machine Learning', level: 4, category: 'technical', weight: 1.0 },
        { name: 'Data Science', level: 4, category: 'technical', weight: 0.9 }
      ],
      preferred: [
        { name: 'AWS', level: 3, category: 'technical', weight: 0.7 },
        { name: 'Docker', level: 3, category: 'technical', weight: 0.6 },
        { name: 'Problem Solving', level: 4, category: 'soft', weight: 0.8 }
      ]
    },
    salary: {
      min: 130000,
      max: 180000,
      currency: 'USD',
      period: 'annual',
      equity: { offered: true, range: '0.2% - 0.8%' }
    },
    benefits: {
      health: true,
      dental: true,
      vision: true,
      retirement: true,
      vacation: '25 days',
      professional_development: true,
      remote_work: true,
      flexible_hours: true,
      other: ['Research time', 'Conference attendance', 'Publication bonus']
    },
    description: 'Develop and deploy machine learning models for cutting-edge AI applications.',
    responsibilities: [
      'Design and implement ML models and algorithms',
      'Deploy models to production environments',
      'Collaborate with research and engineering teams',
      'Optimize model performance and scalability'
    ],
    qualifications: [
      "Master's degree in CS, ML, or related field",
      '3+ years ML engineering experience',
      'Strong Python and ML library experience',
      'Experience with model deployment and MLOps'
    ],
    application: {
      status: 'active',
      deadline: new Date('2025-12-10')
    },
    postedDate: new Date('2025-09-23'),
    tags: ['ml', 'python', 'ai', 'research', 'data-science']
  },

  // ===== MID-LEVEL ROLES =====
  {
    title: 'Frontend Developer',
    company: {
      name: 'Creative Agency Plus',
      industry: 'Marketing',
      size: 'small'
    },
    location: {
      city: 'Portland',
      state: 'OR',
      country: 'USA',
      remote: true
    },
    employmentType: 'full-time',
    experienceLevel: 'mid',
    skills: {
      required: [
        { name: 'JavaScript', level: 4, category: 'technical', weight: 1.0 },
        { name: 'React', level: 3, category: 'technical', weight: 0.9 },
        { name: 'CSS', level: 4, category: 'technical', weight: 0.8 }
      ],
      preferred: [
        { name: 'Vue.js', level: 3, category: 'technical', weight: 0.6 },
        { name: 'TypeScript', level: 3, category: 'technical', weight: 0.5 },
        { name: 'Communication', level: 4, category: 'soft', weight: 0.8 }
      ]
    },
    salary: {
      min: 80000,
      max: 110000,
      currency: 'USD',
      period: 'annual',
      equity: { offered: false }
    },
    benefits: {
      health: true,
      dental: true,
      retirement: false,
      vacation: '15 days',
      professional_development: true,
      remote_work: true,
      flexible_hours: true,
      other: ['Creative freedom', 'Team retreats']
    },
    description: 'Create engaging user interfaces for diverse client projects.',
    responsibilities: [
      'Build responsive web interfaces for client projects',
      'Collaborate closely with designers and account managers',
      'Maintain and update existing client websites',
      'Ensure cross-browser compatibility and performance'
    ],
    qualifications: [
      "Bachelor's degree or equivalent experience",
      '2-4 years frontend development experience',
      'Strong portfolio of web projects',
      'Experience working with design teams'
    ],
    application: {
      status: 'active',
      deadline: new Date('2025-11-30')
    },
    postedDate: new Date('2025-09-21'),
    tags: ['frontend', 'react', 'creative', 'remote', 'agency']
  },

  {
    title: 'Backend Python Developer',
    company: {
      name: 'HealthTech Solutions',
      industry: 'Healthcare',
      size: 'medium'
    },
    location: {
      city: 'Boston',
      state: 'MA',
      country: 'USA',
      hybrid: true
    },
    employmentType: 'full-time',
    experienceLevel: 'mid',
    skills: {
      required: [
        { name: 'Python', level: 4, category: 'technical', weight: 1.0 },
        { name: 'Django', level: 4, category: 'technical', weight: 0.9 },
        { name: 'PostgreSQL', level: 3, category: 'technical', weight: 0.8 }
      ],
      preferred: [
        { name: 'Redis', level: 3, category: 'technical', weight: 0.6 },
        { name: 'Docker', level: 3, category: 'technical', weight: 0.6 },
        { name: 'AWS', level: 3, category: 'technical', weight: 0.5 }
      ]
    },
    salary: {
      min: 95000,
      max: 125000,
      currency: 'USD',
      period: 'annual',
      equity: { offered: true, range: '0.1% - 0.3%' }
    },
    benefits: {
      health: true,
      dental: true,
      vision: true,
      retirement: true,
      vacation: '20 days',
      professional_development: true,
      remote_work: true,
      flexible_hours: true,
      other: ['Health and wellness budget', 'Continuing education']
    },
    description: 'Develop secure backend systems for healthcare applications with strict compliance requirements.',
    responsibilities: [
      'Build and maintain Django-based backend systems',
      'Ensure HIPAA compliance and data security',
      'Design and optimize database schemas',
      'Integrate with third-party healthcare APIs'
    ],
    qualifications: [
      "Bachelor's degree in Computer Science",
      '3+ years Python and Django experience',
      'Understanding of healthcare data standards',
      'Experience with secure coding practices'
    ],
    application: {
      status: 'active',
      deadline: new Date('2025-12-05')
    },
    postedDate: new Date('2025-09-26'),
    tags: ['backend', 'python', 'django', 'healthcare', 'security']
  },

  // ===== JUNIOR/ENTRY ROLES =====
  {
    title: 'Junior Full Stack Developer',
    company: {
      name: 'StartupHub',
      industry: 'Technology',
      size: 'small'
    },
    location: {
      city: 'Denver',
      state: 'CO',
      country: 'USA',
      hybrid: true
    },
    employmentType: 'full-time',
    experienceLevel: 'junior',
    skills: {
      required: [
        { name: 'JavaScript', level: 3, category: 'technical', weight: 1.0 },
        { name: 'React', level: 2, category: 'technical', weight: 0.9 },
        { name: 'Node.js', level: 2, category: 'technical', weight: 0.8 }
      ],
      preferred: [
        { name: 'MongoDB', level: 2, category: 'technical', weight: 0.6 },
        { name: 'Git', level: 3, category: 'technical', weight: 0.7 },
        { name: 'Teamwork', level: 4, category: 'soft', weight: 0.8 }
      ]
    },
    salary: {
      min: 65000,
      max: 85000,
      currency: 'USD',
      period: 'annual',
      equity: { offered: true, range: '0.5% - 1.5%' }
    },
    benefits: {
      health: true,
      dental: true,
      retirement: false,
      vacation: '15 days',
      professional_development: true,
      remote_work: true,
      flexible_hours: true,
      other: ['Mentorship program', 'Learning budget']
    },
    description: 'Join our growing team and learn full-stack development in a supportive startup environment.',
    responsibilities: [
      'Contribute to both frontend and backend development',
      'Learn from senior developers through code reviews',
      'Fix bugs and implement small features',
      'Participate in agile development processes'
    ],
    qualifications: [
      "Bachelor's degree in Computer Science or bootcamp graduate",
      '1-2 years development experience or strong portfolio',
      'Basic knowledge of React and Node.js',
      'Eagerness to learn and grow'
    ],
    application: {
      status: 'active',
      deadline: new Date('2025-11-25')
    },
    postedDate: new Date('2025-09-20'),
    tags: ['junior', 'fullstack', 'startup', 'mentorship', 'growth']
  },

  {
    title: 'Frontend React Developer',
    company: {
      name: 'E-commerce Plus',
      industry: 'Retail',
      size: 'medium'
    },
    location: {
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      remote: false
    },
    employmentType: 'full-time',
    experienceLevel: 'junior',
    skills: {
      required: [
        { name: 'JavaScript', level: 3, category: 'technical', weight: 1.0 },
        { name: 'React', level: 3, category: 'technical', weight: 0.9 },
        { name: 'CSS', level: 3, category: 'technical', weight: 0.8 }
      ],
      preferred: [
        { name: 'TypeScript', level: 2, category: 'technical', weight: 0.5 },
        { name: 'Redux', level: 2, category: 'technical', weight: 0.6 },
        { name: 'Communication', level: 3, category: 'soft', weight: 0.7 }
      ]
    },
    salary: {
      min: 70000,
      max: 90000,
      currency: 'USD',
      period: 'annual',
      equity: { offered: false }
    },
    benefits: {
      health: true,
      dental: true,
      vision: true,
      retirement: true,
      vacation: '18 days',
      professional_development: true,
      remote_work: false,
      flexible_hours: false,
      other: ['Employee discounts', 'Team events']
    },
    description: 'Build and enhance e-commerce user interfaces with focus on conversion optimization.',
    responsibilities: [
      'Develop and maintain React-based e-commerce interfaces',
      'Implement responsive designs from mockups',
      'Optimize user experience and conversion rates',
      'Collaborate with UX designers and backend developers'
    ],
    qualifications: [
      "Bachelor's degree or equivalent experience",
      '2+ years React development experience',
      'Strong CSS and responsive design skills',
      'Understanding of e-commerce user flows'
    ],
    application: {
      status: 'active',
      deadline: new Date('2025-11-28')
    },
    postedDate: new Date('2025-09-22'),
    tags: ['frontend', 'react', 'ecommerce', 'css', 'junior']
  },

  // ===== SPECIALIZED ROLES =====
  {
    title: 'Data Engineer',
    company: {
      name: 'Analytics Pro',
      industry: 'Data & Analytics',
      size: 'large'
    },
    location: {
      city: 'San Jose',
      state: 'CA',
      country: 'USA',
      hybrid: true
    },
    employmentType: 'full-time',
    experienceLevel: 'mid',
    skills: {
      required: [
        { name: 'Python', level: 4, category: 'technical', weight: 1.0 },
        { name: 'SQL', level: 5, category: 'technical', weight: 1.0 },
        { name: 'AWS', level: 4, category: 'technical', weight: 0.9 }
      ],
      preferred: [
        { name: 'PostgreSQL', level: 4, category: 'technical', weight: 0.7 },
        { name: 'Docker', level: 3, category: 'technical', weight: 0.6 },
        { name: 'Data Science', level: 3, category: 'technical', weight: 0.5 }
      ]
    },
    salary: {
      min: 110000,
      max: 145000,
      currency: 'USD',
      period: 'annual',
      equity: { offered: true, range: '0.1% - 0.4%' }
    },
    benefits: {
      health: true,
      dental: true,
      vision: true,
      retirement: true,
      vacation: '22 days',
      professional_development: true,
      remote_work: true,
      flexible_hours: true,
      other: ['Data conference attendance', 'Research time']
    },
    description: 'Build robust data pipelines and infrastructure to support analytics and ML workflows.',
    responsibilities: [
      'Design and implement scalable data pipelines',
      'Optimize data warehouse performance',
      'Collaborate with data scientists and analysts',
      'Ensure data quality and governance'
    ],
    qualifications: [
      "Bachelor's degree in Computer Science or related field",
      '3+ years data engineering experience',
      'Strong SQL and Python skills',
      'Experience with cloud data platforms'
    ],
    application: {
      status: 'active',
      deadline: new Date('2025-12-20')
    },
    postedDate: new Date('2025-09-27'),
    tags: ['data-engineering', 'python', 'sql', 'aws', 'analytics']
  },

  {
    title: 'Blockchain Developer',
    company: {
      name: 'CryptoTech Ventures',
      industry: 'Blockchain',
      size: 'small'
    },
    location: {
      city: 'Miami',
      state: 'FL',
      country: 'USA',
      remote: true
    },
    employmentType: 'full-time',
    experienceLevel: 'mid',
    skills: {
      required: [
        { name: 'Blockchain', level: 4, category: 'technical', weight: 1.0 },
        { name: 'JavaScript', level: 4, category: 'technical', weight: 0.9 }
      ],
      preferred: [
        { name: 'Python', level: 3, category: 'technical', weight: 0.6 },
        { name: 'Node.js', level: 3, category: 'technical', weight: 0.7 },
        { name: 'Problem Solving', level: 4, category: 'soft', weight: 0.8 }
      ]
    },
    salary: {
      min: 120000,
      max: 160000,
      currency: 'USD',
      period: 'annual',
      equity: { offered: true, range: '1.0% - 3.0%' }
    },
    benefits: {
      health: true,
      dental: true,
      retirement: false,
      vacation: 'Unlimited PTO',
      professional_development: true,
      remote_work: true,
      flexible_hours: true,
      other: ['Crypto bonuses', 'Blockchain conference attendance']
    },
    description: 'Develop innovative blockchain solutions and smart contracts for DeFi applications.',
    responsibilities: [
      'Design and implement smart contracts',
      'Build decentralized applications (dApps)',
      'Integrate with various blockchain networks',
      'Conduct security audits and testing'
    ],
    qualifications: [
      "Bachelor's degree in Computer Science or equivalent",
      '2+ years blockchain development experience',
      'Strong understanding of cryptography',
      'Experience with Ethereum and other blockchain platforms'
    ],
    application: {
      status: 'active',
      deadline: new Date('2025-12-15')
    },
    postedDate: new Date('2025-09-25'),
    tags: ['blockchain', 'smart-contracts', 'defi', 'crypto', 'remote']
  },

  // ===== LEADERSHIP ROLES =====
  {
    title: 'Engineering Team Lead',
    company: {
      name: 'ScaleTech Corporation',
      industry: 'Technology',
      size: 'large'
    },
    location: {
      city: 'Atlanta',
      state: 'GA',
      country: 'USA',
      hybrid: true
    },
    employmentType: 'full-time',
    experienceLevel: 'senior',
    skills: {
      required: [
        { name: 'Leadership', level: 5, category: 'soft', weight: 1.0 },
        { name: 'JavaScript', level: 4, category: 'technical', weight: 0.8 },
        { name: 'Project Management', level: 4, category: 'soft', weight: 0.9 },
        { name: 'Communication', level: 5, category: 'soft', weight: 0.9 }
      ],
      preferred: [
        { name: 'Python', level: 4, category: 'technical', weight: 0.6 },
        { name: 'AWS', level: 3, category: 'technical', weight: 0.5 },
        { name: 'Problem Solving', level: 5, category: 'soft', weight: 0.8 }
      ]
    },
    salary: {
      min: 160000,
      max: 200000,
      currency: 'USD',
      period: 'annual',
      equity: { offered: true, range: '0.5% - 1.0%' }
    },
    benefits: {
      health: true,
      dental: true,
      vision: true,
      retirement: true,
      vacation: '25 days',
      professional_development: true,
      remote_work: true,
      flexible_hours: true,
      other: ['Leadership training', 'Stock options', 'Executive coaching']
    },
    description: 'Lead a high-performing engineering team and drive technical strategy.',
    responsibilities: [
      'Lead and mentor a team of 8-12 engineers',
      'Drive technical roadmap and architecture decisions',
      'Collaborate with product and design teams',
      'Foster team culture and professional development'
    ],
    qualifications: [
      "Bachelor's or Master's degree in Computer Science",
      '7+ years engineering experience with 2+ years leadership',
      'Strong technical background in web technologies',
      'Proven track record of team management'
    ],
    application: {
      status: 'active',
      deadline: new Date('2025-12-31')
    },
    postedDate: new Date('2025-09-18'),
    tags: ['leadership', 'team-lead', 'management', 'senior', 'strategy']
  },

  {
    title: 'Senior Product Manager - Developer Tools',
    company: {
      name: 'DevTools Inc',
      industry: 'Technology',
      size: 'medium'
    },
    location: {
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      hybrid: true
    },
    employmentType: 'full-time',
    experienceLevel: 'senior',
    skills: {
      required: [
        { name: 'Project Management', level: 5, category: 'soft', weight: 1.0 },
        { name: 'Communication', level: 5, category: 'soft', weight: 0.9 },
        { name: 'Leadership', level: 4, category: 'soft', weight: 0.8 },
        { name: 'JavaScript', level: 3, category: 'technical', weight: 0.7 }
      ],
      preferred: [
        { name: 'Python', level: 3, category: 'technical', weight: 0.5 },
        { name: 'Git', level: 4, category: 'technical', weight: 0.6 },
        { name: 'Problem Solving', level: 5, category: 'soft', weight: 0.8 }
      ]
    },
    salary: {
      min: 150000,
      max: 190000,
      currency: 'USD',
      period: 'annual',
      equity: { offered: true, range: '0.3% - 0.8%' }
    },
    benefits: {
      health: true,
      dental: true,
      vision: true,
      retirement: true,
      vacation: '28 days',
      professional_development: true,
      remote_work: true,
      flexible_hours: true,
      other: ['Product conference attendance', 'Customer research budget']
    },
    description: 'Drive product strategy for developer-focused tools and platforms.',
    responsibilities: [
      'Define product roadmap and strategy',
      'Work closely with engineering and design teams',
      'Conduct user research and gather feedback',
      'Drive go-to-market strategy and launches'
    ],
    qualifications: [
      "Bachelor's degree in relevant field",
      '5+ years product management experience',
      'Strong technical background and understanding of developer workflows',
      'Experience with developer tools or B2B software'
    ],
    application: {
      status: 'active',
      deadline: new Date('2025-12-10')
    },
    postedDate: new Date('2025-09-19'),
    tags: ['product-management', 'developer-tools', 'strategy', 'senior', 'b2b']
  }
];

// COMPREHENSIVE USER DATA WITH RICH INTERACTIONS (8 users)
const usersData = [
  // ===== PRIMARY USERS =====
  {
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    password: 'SecurePass123!',
    role: 'Developer',
    industry: 'Technology',
    experience: 4,
    location: 'San Francisco, CA',
    careerGoals: 'Senior Frontend Developer, Technical Lead',
    bio: 'Passionate frontend developer with strong React and JavaScript skills. Currently working on transitioning to more senior technical leadership roles.',
    skills: [
      {
        skillName: 'JavaScript',
        selfRating: 7,
        evidence: '4 years of production JavaScript development, built 8+ web applications, mentored 2 junior developers',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Mike Rodriguez', rating: 7, comment: 'Sarah has excellent JavaScript fundamentals and writes very clean, maintainable code. Her ES6+ knowledge is particularly strong.', date: new Date('2025-09-15'), helpfulVotes: 5 },
          { reviewerName: 'Alex Kumar', rating: 8, comment: 'Worked with Sarah on the e-commerce platform. Her async programming skills are impressive, and she handled complex API integrations beautifully.', date: new Date('2025-09-18'), helpfulVotes: 3 },
          { reviewerName: 'Jessica Wong', rating: 6, comment: 'Good JS skills overall. Could benefit from more experience with advanced design patterns and performance optimization.', date: new Date('2025-09-20'), helpfulVotes: 2 }
        ]
      },
      {
        skillName: 'React',
        selfRating: 7,
        evidence: '3 years React experience, built component libraries, SPAs, and led React migration for legacy codebase',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Mike Rodriguez', rating: 7, comment: 'Sarah is excellent with React. Her component design is thoughtful and reusable. She really understands the React lifecycle and hooks.', date: new Date('2025-09-15'), helpfulVotes: 4 },
          { reviewerName: 'David Park', rating: 8, comment: 'One of the best React developers I\'ve worked with. Her component architecture is clean and scalable. Great at performance optimization too.', date: new Date('2025-09-17'), helpfulVotes: 6 }
        ]
      },
      {
        skillName: 'TypeScript',
        selfRating: 5,
        evidence: '18 months TypeScript experience in current project, learning advanced type patterns',
        confidenceLevel: 'medium',
        peerRatings: [
          { reviewerName: 'Alex Kumar', rating: 6, comment: 'Sarah is getting stronger with TypeScript. Her basic type usage is solid, but she could explore more advanced patterns.', date: new Date('2025-09-16'), helpfulVotes: 2 }
        ]
      },
      {
        skillName: 'Node.js',
        selfRating: 4,
        evidence: '1 year Node.js for personal projects, building APIs and microservices',
        confidenceLevel: 'low',
        peerRatings: []
      },
      {
        skillName: 'Communication',
        selfRating: 8,
        evidence: 'Led cross-team meetings, presented to stakeholders, mentored junior developers, conducted technical interviews',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Emma Thompson', rating: 9, comment: 'Sarah is an outstanding communicator. She makes complex technical concepts accessible to non-technical stakeholders and is very patient when mentoring.', date: new Date('2025-09-20'), helpfulVotes: 7 },
          { reviewerName: 'Mike Rodriguez', rating: 8, comment: 'Great at explaining technical concepts and very collaborative. Always professional and constructive in code reviews.', date: new Date('2025-09-19'), helpfulVotes: 4 }
        ]
      },
      {
        skillName: 'Leadership',
        selfRating: 6,
        evidence: 'Tech lead on 2 projects, mentored 3 junior developers, led technical decision-making sessions',
        confidenceLevel: 'medium',
        peerRatings: [
          { reviewerName: 'David Park', rating: 7, comment: 'Sarah shows natural leadership qualities. She\'s decisive but collaborative, and the team responds well to her guidance.', date: new Date('2025-09-21'), helpfulVotes: 3 }
        ]
      }
    ]
  },

  {
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@example.com',
    password: 'SecurePass123!',
    role: 'Developer',
    industry: 'Technology', 
    experience: 6,
    location: 'Austin, TX',
    careerGoals: 'Full Stack Lead, Engineering Manager',
    bio: 'Full-stack developer with deep Python expertise and growing leadership experience. Passionate about mentoring and building scalable systems.',
    skills: [
      {
        skillName: 'Python',
        selfRating: 8,
        evidence: '6 years Python development, Django and Flask expert, built microservices architecture, contributed to open source',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Sarah Chen', rating: 9, comment: 'Mike is a Python expert. His code is elegant and performant. He really understands pythonic principles and advanced features.', date: new Date('2025-09-16'), helpfulVotes: 5 },
          { reviewerName: 'Lisa Wang', rating: 8, comment: 'Excellent Python developer with great understanding of both Django and Flask. His API designs are well-thought-out.', date: new Date('2025-09-14'), helpfulVotes: 4 },
          { reviewerName: 'James Wilson', rating: 8, comment: 'Mike\'s Python skills are impressive. He writes clean, maintainable code and is great at debugging complex issues.', date: new Date('2025-09-18'), helpfulVotes: 3 }
        ]
      },
      {
        skillName: 'Django',
        selfRating: 8,
        evidence: '5 years Django development, built enterprise applications, expertise in ORM optimization and security',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Lisa Wang', rating: 8, comment: 'Mike knows Django inside and out. His model design is excellent and he understands advanced ORM concepts well.', date: new Date('2025-09-15'), helpfulVotes: 6 }
        ]
      },
      {
        skillName: 'JavaScript',
        selfRating: 6,
        evidence: '4 years frontend JavaScript experience, comfortable with ES6+, some React experience',
        confidenceLevel: 'medium',
        peerRatings: [
          { reviewerName: 'Sarah Chen', rating: 6, comment: 'Mike has solid JavaScript fundamentals. His backend perspective brings good insights to frontend challenges.', date: new Date('2025-09-17'), helpfulVotes: 2 }
        ]
      },
      {
        skillName: 'PostgreSQL',
        selfRating: 7,
        evidence: '5 years database design and optimization, complex query writing, performance tuning expertise',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'James Wilson', rating: 8, comment: 'Mike is excellent with PostgreSQL. His query optimization skills saved us significant performance issues on our main application.', date: new Date('2025-09-17'), helpfulVotes: 4 },
          { reviewerName: 'David Park', rating: 7, comment: 'Strong database skills. Mike understands both the development and DBA sides of PostgreSQL well.', date: new Date('2025-09-19'), helpfulVotes: 3 }
        ]
      },
      {
        skillName: 'AWS',
        selfRating: 5,
        evidence: '2 years AWS experience, deployed applications using EC2, RDS, S3, learning containerization',
        confidenceLevel: 'medium',
        peerRatings: [
          { reviewerName: 'Alex Kumar', rating: 6, comment: 'Mike has good AWS fundamentals. He successfully migrated our Django app to AWS and set up proper CI/CD.', date: new Date('2025-09-20'), helpfulVotes: 2 }
        ]
      },
      {
        skillName: 'Leadership',
        selfRating: 6,
        evidence: 'Team lead on 3 projects, mentored 5 junior developers, conducted tech talks, involved in hiring decisions',
        confidenceLevel: 'medium',
        peerRatings: [
          { reviewerName: 'Sarah Chen', rating: 7, comment: 'Mike is a natural leader and excellent mentor. He\'s patient, supportive, and helps team members grow their skills.', date: new Date('2025-09-19'), helpfulVotes: 5 },
          { reviewerName: 'Lisa Wang', rating: 6, comment: 'Good leadership potential. Mike is collaborative and makes sound technical decisions, though could work on delegation.', date: new Date('2025-09-21'), helpfulVotes: 3 }
        ]
      },
      {
        skillName: 'Communication',
        selfRating: 7,
        evidence: 'Regular tech talks, cross-team collaboration, stakeholder meetings, technical documentation',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Emma Thompson', rating: 7, comment: 'Mike communicates technical concepts well and is great in team settings. His documentation is always thorough.', date: new Date('2025-09-22'), helpfulVotes: 4 }
        ]
      }
    ]
  },

  {
    name: 'Alex Kumar',
    email: 'alex.kumar@example.com',
    password: 'SecurePass123!',
    role: 'Developer',
    industry: 'Technology',
    experience: 5,
    location: 'Seattle, WA',
    careerGoals: 'Senior Backend Engineer, Cloud Architect',
    bio: 'Backend engineer specializing in distributed systems and cloud architecture. Passionate about scalable solutions and Programming Languages.',
    skills: [
      {
        skillName: 'Go',
        selfRating: 7,
        evidence: '3 years Go development, built microservices, contributed to open source projects, expertise in concurrency',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'James Wilson', rating: 8, comment: 'Alex writes excellent Go code. His understanding of goroutines and channels is impressive, and his microservices are well-designed.', date: new Date('2025-09-14'), helpfulVotes: 6 },
          { reviewerName: 'David Park', rating: 7, comment: 'Solid Go developer with good grasp of the language idioms. His code is clean and performant.', date: new Date('2025-09-16'), helpfulVotes: 3 }
        ]
      },
      {
        skillName: 'AWS',
        selfRating: 8,
        evidence: '4 years AWS experience, certified solutions architect, designed multi-region deployments, cost optimization expert',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Mike Rodriguez', rating: 8, comment: 'Alex is our go-to person for AWS architecture. His cloud solutions are robust and cost-effective.', date: new Date('2025-09-18'), helpfulVotes: 7 },
          { reviewerName: 'Lisa Wang', rating: 9, comment: 'Outstanding AWS knowledge. Alex designed our entire cloud infrastructure and it\'s been rock-solid.', date: new Date('2025-09-15'), helpfulVotes: 5 }
        ]
      },
      {
        skillName: 'Docker',
        selfRating: 7,
        evidence: '3 years containerization experience, Docker optimization, multi-stage builds, production deployments',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'James Wilson', rating: 7, comment: 'Alex knows Docker very well. His container setups are always optimized and secure.', date: new Date('2025-09-17'), helpfulVotes: 4 }
        ]
      },
      {
        skillName: 'Kubernetes',
        selfRating: 6,
        evidence: '2 years Kubernetes experience, cluster management, helm charts, monitoring and scaling',
        confidenceLevel: 'medium',
        peerRatings: [
          { reviewerName: 'David Park', rating: 7, comment: 'Alex has strong Kubernetes skills and successfully migrated our services to K8s. His monitoring setup is excellent.', date: new Date('2025-09-19'), helpfulVotes: 3 }
        ]
      },
      {
        skillName: 'JavaScript',
        selfRating: 5,
        evidence: '2 years JavaScript for tooling and occasional frontend work, familiar with Node.js',
        confidenceLevel: 'medium',
        peerRatings: [
          { reviewerName: 'Sarah Chen', rating: 5, comment: 'Alex has decent JavaScript skills for a backend developer. Good enough for tooling and simple frontend tasks.', date: new Date('2025-09-20'), helpfulVotes: 2 }
        ]
      },
      {
        skillName: 'Problem Solving',
        selfRating: 8,
        evidence: 'Led troubleshooting for major outages, designed solutions for complex distributed systems challenges',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Mike Rodriguez', rating: 8, comment: 'Alex is an exceptional problem solver. He approaches issues systematically and finds elegant solutions.', date: new Date('2025-09-21'), helpfulVotes: 5 }
        ]
      }
    ]
  },

  {
    name: 'Emma Thompson',
    email: 'emma.thompson@example.com',
    password: 'SecurePass123!',
    role: 'Designer',
    industry: 'Technology',
    experience: 4,
    location: 'Remote',
    careerGoals: 'Senior UX Designer, Design Manager',
    bio: 'UX/UI designer with strong technical understanding. Passionate about user-centered design and cross-functional collaboration.',
    skills: [
      {
        skillName: 'Communication',
        selfRating: 9,
        evidence: 'Daily client presentations, workshop facilitation, design critiques, cross-functional collaboration, user research',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Sarah Chen', rating: 9, comment: 'Emma is an exceptional communicator. She makes design decisions transparent and helps everyone understand the user perspective.', date: new Date('2025-09-21'), helpfulVotes: 6 },
          { reviewerName: 'Mike Rodriguez', rating: 9, comment: 'Outstanding communication skills. Emma bridges the gap between design and development perfectly.', date: new Date('2025-09-20'), helpfulVotes: 5 },
          { reviewerName: 'David Park', rating: 8, comment: 'Great at facilitating discussions and getting alignment between teams. Very clear and articulate.', date: new Date('2025-09-22'), helpfulVotes: 4 }
        ]
      },
      {
        skillName: 'Project Management',
        selfRating: 8,
        evidence: 'Managed 8+ design projects simultaneously, client coordination, timeline management, cross-team collaboration',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Lisa Wang', rating: 8, comment: 'Emma keeps projects organized and on track. She\'s great at balancing multiple stakeholder needs.', date: new Date('2025-09-19'), helpfulVotes: 4 },
          { reviewerName: 'Sarah Chen', rating: 7, comment: 'Excellent project management skills. Emma always knows what\'s happening and keeps everyone informed.', date: new Date('2025-09-22'), helpfulVotes: 3 }
        ]
      },
      {
        skillName: 'JavaScript',
        selfRating: 4,
        evidence: '18 months JavaScript learning for design systems and prototyping, building interactive prototypes',
        confidenceLevel: 'low',
        peerRatings: [
          { reviewerName: 'Sarah Chen', rating: 4, comment: 'Emma is learning JavaScript well for a designer. Her prototypes are getting more sophisticated.', date: new Date('2025-09-23'), helpfulVotes: 2 }
        ]
      },
      {
        skillName: 'React',
        selfRating: 3,
        evidence: '6 months React learning for design system implementation, building component documentation',
        confidenceLevel: 'low',
        peerRatings: []
      },
      {
        skillName: 'Leadership',
        selfRating: 7,
        evidence: 'Led design team initiatives, mentored junior designers, facilitated design thinking workshops',
        confidenceLevel: 'medium',
        peerRatings: [
          { reviewerName: 'Jessica Wong', rating: 7, comment: 'Emma is a natural leader in design. She brings out the best in team members and drives innovation.', date: new Date('2025-09-24'), helpfulVotes: 3 }
        ]
      }
    ]
  },

  {
    name: 'David Park',
    email: 'david.park@example.com',
    password: 'SecurePass123!',
    role: 'Developer',
    industry: 'Technology',
    experience: 7,
    location: 'Los Angeles, CA',
    careerGoals: 'Principal Engineer, CTO',
    bio: 'Senior full-stack developer with leadership experience. Passionate about architecture, mentoring, and building high-performing teams.',
    skills: [
      {
        skillName: 'JavaScript',
        selfRating: 8,
        evidence: '7 years JavaScript development, framework expertise, performance optimization, team mentoring',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Sarah Chen', rating: 8, comment: 'David has deep JavaScript knowledge and great architectural thinking. His code reviews always provide valuable insights.', date: new Date('2025-09-13'), helpfulVotes: 5 },
          { reviewerName: 'Alex Kumar', rating: 8, comment: 'Excellent JavaScript developer with strong understanding of both frontend and backend JS ecosystems.', date: new Date('2025-09-15'), helpfulVotes: 4 }
        ]
      },
      {
        skillName: 'React',
        selfRating: 8,
        evidence: '5 years React development, architectural decisions, performance optimization, team training',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Sarah Chen', rating: 9, comment: 'David is one of the best React developers I\'ve worked with. His architectural decisions are always sound.', date: new Date('2025-09-14'), helpfulVotes: 6 }
        ]
      },
      {
        skillName: 'Node.js',
        selfRating: 7,
        evidence: '5 years Node.js backend development, microservices architecture, API design, performance tuning',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Mike Rodriguez', rating: 7, comment: 'David builds robust Node.js applications with clean architecture. His API designs are always well thought out.', date: new Date('2025-09-16'), helpfulVotes: 4 }
        ]
      },
      {
        skillName: 'Leadership',
        selfRating: 8,
        evidence: 'Tech lead for 4+ years, managed teams of 6-8 developers, drove technical strategy, hiring and mentoring',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Sarah Chen', rating: 8, comment: 'David is an excellent technical leader. He balances technical excellence with team development beautifully.', date: new Date('2025-09-17'), helpfulVotes: 7 },
          { reviewerName: 'Mike Rodriguez', rating: 8, comment: 'Great leader who empowers the team while maintaining high technical standards. Very supportive of career growth.', date: new Date('2025-09-18'), helpfulVotes: 5 }
        ]
      },
      {
        skillName: 'Communication',
        selfRating: 8,
        evidence: 'Stakeholder management, technical presentations, cross-team collaboration, public speaking',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Emma Thompson', rating: 8, comment: 'David communicates technical concepts clearly to all audiences. Great at building consensus.', date: new Date('2025-09-19'), helpfulVotes: 4 }
        ]
      },
      {
        skillName: 'AWS',
        selfRating: 6,
        evidence: '3 years AWS experience, application deployment, basic infrastructure management',
        confidenceLevel: 'medium',
        peerRatings: [
          { reviewerName: 'Alex Kumar', rating: 6, comment: 'David has solid AWS skills for application deployment. Could benefit from more infrastructure architecture experience.', date: new Date('2025-09-20'), helpfulVotes: 2 }
        ]
      }
    ]
  },

  {
    name: 'Lisa Wang',
    email: 'lisa.wang@example.com',
    password: 'SecurePass123!',
    role: 'Developer',
    industry: 'Technology',
    experience: 5,
    location: 'Boston, MA',
    careerGoals: 'Senior Full Stack Engineer, Product Engineering Lead',
    bio: 'Full-stack developer with strong backend expertise and growing product sense. Enjoys solving complex business problems through technology.',
    skills: [
      {
        skillName: 'Python',
        selfRating: 8,
        evidence: '5 years Python development, Django expertise, API development, data processing, testing best practices',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Mike Rodriguez', rating: 8, comment: 'Lisa is an excellent Python developer with great attention to code quality and testing. Her Django knowledge is very strong.', date: new Date('2025-09-12'), helpfulVotes: 5 },
          { reviewerName: 'James Wilson', rating: 7, comment: 'Strong Python skills with good understanding of both web development and data processing aspects.', date: new Date('2025-09-14'), helpfulVotes: 3 }
        ]
      },
      {
        skillName: 'Django',
        selfRating: 8,
        evidence: '4 years Django development, REST API design, complex data modeling, performance optimization',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Mike Rodriguez', rating: 8, comment: 'Lisa knows Django very well. Her API designs are clean and her model relationships are always well thought out.', date: new Date('2025-09-13'), helpfulVotes: 6 }
        ]
      },
      {
        skillName: 'JavaScript',
        selfRating: 6,
        evidence: '3 years JavaScript for frontend integration, API consumption, basic React components',
        confidenceLevel: 'medium',
        peerRatings: [
          { reviewerName: 'Sarah Chen', rating: 6, comment: 'Lisa has solid JavaScript skills for backend integration. Her understanding of async programming is good.', date: new Date('2025-09-15'), helpfulVotes: 2 }
        ]
      },
      {
        skillName: 'PostgreSQL',
        selfRating: 7,
        evidence: '4 years PostgreSQL experience, complex queries, optimization, database design, data analysis',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Mike Rodriguez', rating: 7, comment: 'Lisa has strong database skills. Her query optimization work significantly improved our application performance.', date: new Date('2025-09-16'), helpfulVotes: 4 }
        ]
      },
      {
        skillName: 'Data Science',
        selfRating: 5,
        evidence: '18 months data analysis experience, pandas, basic machine learning, business intelligence',
        confidenceLevel: 'medium',
        peerRatings: [
          { reviewerName: 'Alex Kumar', rating: 5, comment: 'Lisa is picking up data science skills well. Her analysis helped inform several important product decisions.', date: new Date('2025-09-17'), helpfulVotes: 3 }
        ]
      },
      {
        skillName: 'Problem Solving',
        selfRating: 8,
        evidence: 'Led investigation of complex bugs, designed solutions for business requirements, system optimization',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'David Park', rating: 8, comment: 'Lisa is an excellent problem solver who thinks through edge cases and considers long-term implications.', date: new Date('2025-09-18'), helpfulVotes: 4 }
        ]
      }
    ]
  },

  {
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    password: 'SecurePass123!',
    role: 'Developer',
    industry: 'Technology',
    experience: 6,
    location: 'Chicago, IL',
    careerGoals: 'DevOps Engineer, Infrastructure Architect',
    bio: 'Backend developer transitioning to DevOps with strong infrastructure and automation skills. Passionate about scalable systems and reliability.',
    skills: [
      {
        skillName: 'Docker',
        selfRating: 8,
        evidence: '4 years containerization, Docker optimization, production deployments, container orchestration',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Alex Kumar', rating: 8, comment: 'James has excellent Docker skills. His container setups are always secure and optimized.', date: new Date('2025-09-11'), helpfulVotes: 6 },
          { reviewerName: 'David Park', rating: 7, comment: 'Strong containerization knowledge. James helped us optimize our Docker builds significantly.', date: new Date('2025-09-13'), helpfulVotes: 4 }
        ]
      },
      {
        skillName: 'Kubernetes',
        selfRating: 7,
        evidence: '3 years Kubernetes experience, cluster management, monitoring, CI/CD integration',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Alex Kumar', rating: 7, comment: 'James has solid Kubernetes knowledge and successfully managed our cluster migration.', date: new Date('2025-09-12'), helpfulVotes: 5 }
        ]
      },
      {
        skillName: 'AWS',
        selfRating: 7,
        evidence: '4 years AWS experience, infrastructure as code, monitoring, security best practices',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Alex Kumar', rating: 7, comment: 'James has good AWS skills with strong focus on security and best practices.', date: new Date('2025-09-14'), helpfulVotes: 3 }
        ]
      },
      {
        skillName: 'Python',
        selfRating: 6,
        evidence: '3 years Python for automation scripts, infrastructure tooling, basic web development',
        confidenceLevel: 'medium',
        peerRatings: [
          { reviewerName: 'Lisa Wang', rating: 6, comment: 'James writes good Python automation scripts. His tooling has been very helpful for the team.', date: new Date('2025-09-15'), helpfulVotes: 2 }
        ]
      },
      {
        skillName: 'Jenkins',
        selfRating: 7,
        evidence: '3 years CI/CD pipeline management, Jenkins administration, deployment automation',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Mike Rodriguez', rating: 7, comment: 'James set up our entire CI/CD pipeline. His Jenkins knowledge is comprehensive.', date: new Date('2025-09-16'), helpfulVotes: 4 }
        ]
      },
      {
        skillName: 'Git',
        selfRating: 8,
        evidence: '6 years Git experience, advanced workflows, branching strategies, team training',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Sarah Chen', rating: 8, comment: 'James knows Git inside and out. He helped establish our branching strategy and trained the team.', date: new Date('2025-09-17'), helpfulVotes: 3 }
        ]
      }
    ]
  },

  {
    name: 'Jessica Wong',
    email: 'jessica.wong@example.com',
    password: 'SecurePass123!',
    role: 'Manager',
    industry: 'Technology',
    experience: 8,
    location: 'Portland, OR',
    careerGoals: 'Engineering Director, VP of Engineering',
    bio: 'Engineering manager with strong technical background. Focused on building high-performing teams and scaling engineering organizations.',
    skills: [
      {
        skillName: 'Leadership',
        selfRating: 9,
        evidence: '4 years engineering management, managed teams of 12-15 engineers, hiring and team development, organizational scaling',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'David Park', rating: 9, comment: 'Jessica is an exceptional leader who truly cares about her team\'s growth. Under her leadership, our team performance improved dramatically.', date: new Date('2025-09-10'), helpfulVotes: 8 },
          { reviewerName: 'Sarah Chen', rating: 9, comment: 'The best manager I\'ve worked with. Jessica creates an environment where everyone can do their best work.', date: new Date('2025-09-12'), helpfulVotes: 7 },
          { reviewerName: 'Mike Rodriguez', rating: 8, comment: 'Jessica balances business needs with team development perfectly. She\'s strategic but still very hands-on when needed.', date: new Date('2025-09-14'), helpfulVotes: 6 }
        ]
      },
      {
        skillName: 'Communication',
        selfRating: 9,
        evidence: 'Executive presentations, cross-department collaboration, team meetings, public speaking, stakeholder management',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Emma Thompson', rating: 9, comment: 'Jessica is an outstanding communicator who can adapt her message to any audience. Her team meetings are always productive.', date: new Date('2025-09-11'), helpfulVotes: 5 },
          { reviewerName: 'David Park', rating: 8, comment: 'Excellent communication skills. Jessica keeps everyone informed and aligned on goals.', date: new Date('2025-09-13'), helpfulVotes: 4 }
        ]
      },
      {
        skillName: 'Project Management',
        selfRating: 9,
        evidence: 'Led multiple large-scale projects, cross-team coordination, agile methodologies, resource planning',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'Emma Thompson', rating: 9, comment: 'Jessica is exceptional at project management. She keeps complex projects organized and delivers consistently.', date: new Date('2025-09-15'), helpfulVotes: 4 }
        ]
      },
      {
        skillName: 'JavaScript',
        selfRating: 6,
        evidence: '5 years development experience (before management), stays current with technology trends',
        confidenceLevel: 'medium',
        peerRatings: [
          { reviewerName: 'Sarah Chen', rating: 6, comment: 'Jessica maintains good technical knowledge despite being in management. She can still contribute to technical discussions meaningfully.', date: new Date('2025-09-16'), helpfulVotes: 2 }
        ]
      },
      {
        skillName: 'Problem Solving',
        selfRating: 9,
        evidence: 'Strategic problem solving, organizational challenges, complex technical and people issues',
        confidenceLevel: 'high',
        peerRatings: [
          { reviewerName: 'David Park', rating: 9, comment: 'Jessica approaches problems systematically and finds creative solutions that work for everyone.', date: new Date('2025-09-17'), helpfulVotes: 5 }
        ]
      }
    ]
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting comprehensive database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skillforge');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Skill.deleteMany({}),
      Job.deleteMany({}),
      Assessment.deleteMany({}),
      PeerReview.deleteMany({})
    ]);
    console.log('🗑️ Cleared existing data');

    // Seed Skills
    const skills = await Skill.insertMany(skillsData);
    console.log(`✅ Seeded ${skills.length} skills`);

    // Seed Jobs
    const jobs = await Job.insertMany(jobsData);
    console.log(`✅ Seeded ${jobs.length} job postings`);

    // Seed Users with Skills
    for (let userData of usersData) {
      // Hash password and fix field name
      userData.passwordHash = await bcrypt.hash(userData.password, 10);
      delete userData.password;
      
      // Map skill names to skillIds and calculate averageRating
      for (let userSkill of userData.skills) {
        const skillDoc = skills.find(s => s.name === userSkill.skillName);
        if (skillDoc) {
          userSkill.skillId = skillDoc._id;
          userSkill.name = userSkill.skillName; // Add name field required by schema
          
          // Calculate average rating (30% self, 70% peer average)
          if (userSkill.peerRatings && userSkill.peerRatings.length > 0) {
            const peerAverage = userSkill.peerRatings.reduce((sum, rating) => sum + rating.rating, 0) / userSkill.peerRatings.length;
            userSkill.averageRating = Math.round((userSkill.selfRating * 0.3 + peerAverage * 0.7) * 10) / 10;
          } else {
            userSkill.averageRating = userSkill.selfRating;
          }
          
          userSkill.lastUpdated = new Date();
          // Clean up the temporary field
          delete userSkill.skillName;
        }
      }
      
      const user = await User.create(userData);
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    }

    // Create comprehensive assessment data
    const users = await User.find({});
    const assessmentData = [];

    // Sarah's assessments
    const sarah = users.find(u => u.email === 'sarah.chen@example.com');
    assessmentData.push(
      {
        user: sarah._id,
        skill: skills.find(s => s.name === 'JavaScript')._id,
        selfRating: 7,
        confidence: 8,
        evidence: 'Recently led JavaScript migration project, mentored 2 junior developers on advanced ES6+ concepts',
        assessmentDate: new Date('2025-09-20T10:30:00Z')
      },
      {
        user: sarah._id,
        skill: skills.find(s => s.name === 'React')._id,
        selfRating: 7,
        confidence: 8,
        evidence: 'Built component library used across 3 different applications, expertise in hooks and context',
        assessmentDate: new Date('2025-09-18T14:15:00Z')
      },
      {
        user: sarah._id,
        skill: skills.find(s => s.name === 'TypeScript')._id,
        selfRating: 5,
        confidence: 6,
        evidence: '18 months experience in current project, comfortable with basic types but learning advanced patterns',
        assessmentDate: new Date('2025-09-22T09:45:00Z')
      }
    );

    // Mike's assessments
    const mike = users.find(u => u.email === 'mike.rodriguez@example.com');
    assessmentData.push(
      {
        user: mike._id,
        skill: skills.find(s => s.name === 'Python')._id,
        selfRating: 8,
        confidence: 9,
        evidence: '6 years professional Python development, contributed to Django open source, built scalable microservices',
        assessmentDate: new Date('2025-09-19T16:20:00Z')
      },
      {
        user: mike._id,
        skill: skills.find(s => s.name === 'Django')._id,
        selfRating: 8,
        confidence: 9,
        evidence: 'Built enterprise applications serving 100k+ users, expertise in ORM optimization and security',
        assessmentDate: new Date('2025-09-21T11:30:00Z')
      }
    );

    // Alex's assessments
    const alex = users.find(u => u.email === 'alex.kumar@example.com');
    assessmentData.push(
      {
        user: alex._id,
        skill: skills.find(s => s.name === 'AWS')._id,
        selfRating: 8,
        confidence: 9,
        evidence: 'AWS Certified Solutions Architect, designed multi-region infrastructure for high-availability applications',
        assessmentDate: new Date('2025-09-17T13:45:00Z')
      },
      {
        user: alex._id,
        skill: skills.find(s => s.name === 'Go')._id,
        selfRating: 7,
        confidence: 8,
        evidence: 'Built high-performance microservices handling 1M+ requests/day, contributed to open source Go projects',
        assessmentDate: new Date('2025-09-23T10:15:00Z')
      }
    );

    const assessments = await Assessment.insertMany(assessmentData);
    console.log(`✅ Seeded ${assessments.length} assessments`);

    // Create extensive peer review data
    const peerReviewData = [
      // Sarah requesting reviews
      {
        reviewee: sarah._id,
        reviewer: mike._id,
        requestedSkills: ['JavaScript', 'React'],
        status: 'completed',
        requestMessage: 'Hi Mike! Could you review my frontend skills? We worked together on the e-commerce platform and I value your technical perspective.',
        requestDate: new Date('2025-09-14T09:00:00Z'),
        deadline: new Date('2025-09-21T23:59:59Z'),
        reviews: [
          {
            skillName: 'JavaScript',
            rating: 7,
            comment: 'Sarah has excellent JavaScript fundamentals and writes very clean, maintainable code. Her ES6+ knowledge is particularly strong, and she handled async programming challenges elegantly in our project.',
            evidence: 'Worked together on API integration and complex state management',
            categories: { technical: 7, problemSolving: 8, codeQuality: 8 }
          },
          {
            skillName: 'React',
            rating: 7,
            comment: 'Sarah is excellent with React. Her component design is thoughtful and reusable. She really understands the React lifecycle and hooks, and her performance optimization work was impressive.',
            evidence: 'Collaborated on component architecture and performance improvements',
            categories: { technical: 7, problemSolving: 7, codeQuality: 8 }
          }
        ],
        completedDate: new Date('2025-09-16T15:30:00Z'),
        anonymous: false
      },
      
      // Mike requesting reviews
      {
        reviewee: mike._id,
        reviewer: sarah._id,
        requestedSkills: ['Leadership', 'Communication'],
        status: 'completed',
        requestMessage: 'Hey Sarah, I\'m working on developing my leadership skills. Could you provide feedback based on our project collaboration?',
        requestDate: new Date('2025-09-18T14:00:00Z'),
        deadline: new Date('2025-09-25T23:59:59Z'),
        reviews: [
          {
            skillName: 'Leadership',
            rating: 7,
            comment: 'Mike shows natural leadership qualities. He\'s decisive but collaborative, and the team responds well to his guidance. He\'s particularly good at technical mentoring.',
            evidence: 'Observed leadership during sprint planning and technical discussions',
            categories: { leadership: 7, mentoring: 8, decisionMaking: 7 }
          },
          {
            skillName: 'Communication',
            rating: 7,
            comment: 'Great at explaining technical concepts and very collaborative. Always professional and constructive in code reviews. Could work on executive-level communication.',
            evidence: 'Regular team meetings and cross-functional collaboration',
            categories: { clarity: 7, collaboration: 8, presentation: 6 }
          }
        ],
        completedDate: new Date('2025-09-20T11:45:00Z'),
        anonymous: false
      },

      // Alex requesting reviews
      {
        reviewee: alex._id,
        reviewer: mike._id,
        requestedSkills: ['Problem Solving', 'AWS'],
        status: 'completed',
        requestMessage: 'Mike, you\'ve seen me work through some complex infrastructure challenges. Could you provide feedback on my problem-solving approach?',
        requestDate: new Date('2025-09-19T16:30:00Z'),
        deadline: new Date('2025-09-26T23:59:59Z'),
        reviews: [
          {
            skillName: 'AWS',
            rating: 8,
            comment: 'Alex is our go-to person for AWS architecture. His cloud solutions are robust, cost-effective, and well-documented. The infrastructure he designed has been rock-solid.',
            evidence: 'Collaborated on cloud migration and cost optimization',
            categories: { technical: 8, architecture: 9, optimization: 8 }
          },
          {
            skillName: 'Problem Solving',
            rating: 8,
            comment: 'Alex is an exceptional problem solver. He approaches issues systematically, considers multiple solutions, and finds elegant approaches to complex challenges.',
            evidence: 'Worked together on distributed systems debugging',
            categories: { analysis: 8, creativity: 8, systematic: 9 }
          }
        ],
        completedDate: new Date('2025-09-22T13:20:00Z'),
        anonymous: false
      },

      // Emma requesting reviews
      {
        reviewee: users.find(u => u.email === 'emma.thompson@example.com')._id,
        reviewer: sarah._id,
        requestedSkills: ['Communication', 'Project Management'],
        status: 'completed',
        requestMessage: 'Sarah, we\'ve collaborated on several projects. I\'d love your perspective on my communication and project management skills.',
        requestDate: new Date('2025-09-20T10:15:00Z'),
        deadline: new Date('2025-09-27T23:59:59Z'),
        reviews: [
          {
            skillName: 'Communication',
            rating: 9,
            comment: 'Emma is an exceptional communicator. She makes design decisions transparent, helps everyone understand the user perspective, and facilitates great discussions.',
            evidence: 'Weekly design reviews and cross-functional project meetings',
            categories: { clarity: 9, facilitation: 9, empathy: 9 }
          },
          {
            skillName: 'Project Management',
            rating: 7,
            comment: 'Excellent project management skills. Emma always knows project status, keeps everyone informed, and manages stakeholder expectations well.',
            evidence: 'Managed design system project with multiple stakeholders',
            categories: { organization: 8, communication: 8, delivery: 7 }
          }
        ],
        completedDate: new Date('2025-09-23T14:10:00Z'),
        anonymous: false
      },

      // More peer reviews for richer data...
      {
        reviewee: users.find(u => u.email === 'david.park@example.com')._id,
        reviewer: users.find(u => u.email === 'jessica.wong@example.com')._id,
        requestedSkills: ['Leadership', 'JavaScript'],
        status: 'completed',
        requestMessage: 'Jessica, as my manager, I\'d appreciate your feedback on my technical leadership and continued JavaScript skills.',
        requestDate: new Date('2025-09-21T09:30:00Z'),
        deadline: new Date('2025-09-28T23:59:59Z'),
        reviews: [
          {
            skillName: 'Leadership',
            rating: 8,
            comment: 'David is an excellent technical leader who empowers his team while maintaining high standards. He\'s strategic, supportive of career growth, and great at building consensus.',
            evidence: 'Direct management observation over 18 months',
            categories: { teamBuilding: 8, strategy: 8, mentoring: 9 }
          },
          {
            skillName: 'JavaScript',
            rating: 8,
            comment: 'David maintains strong JavaScript skills and architectural thinking. His code reviews provide valuable insights and he stays current with ecosystem developments.',
            evidence: 'Technical discussions and architecture reviews',
            categories: { technical: 8, architecture: 8, currentKnowledge: 7 }
          }
        ],
        completedDate: new Date('2025-09-24T16:45:00Z'),
        anonymous: false
      }
    ];

    const peerReviews = await PeerReview.insertMany(peerReviewData);
    console.log(`✅ Seeded ${peerReviews.length} peer reviews`);

    console.log('🎉 Comprehensive database seeding completed successfully!');
    console.log('\n📊 Final Summary:');
    console.log(`- Skills: ${skills.length} (comprehensive skill taxonomy)`);
    console.log(`- Jobs: ${jobs.length} (diverse roles across experience levels)`);
    console.log(`- Users: ${users.length} (realistic professional profiles)`);
    console.log(`- Assessments: ${assessments.length} (detailed skill evaluations)`);
    console.log(`- Peer Reviews: ${peerReviews.length} (extensive peer validation data)`);

    console.log('\n🔐 Demo Login Credentials:');
    console.log('🎯 Primary Users:');
    console.log('  • sarah.chen@example.com | SecurePass123! (Frontend Developer)');
    console.log('  • mike.rodriguez@example.com | SecurePass123! (Full Stack Developer)');
    console.log('  • alex.kumar@example.com | SecurePass123! (Backend/Cloud Engineer)');
    console.log('  • emma.thompson@example.com | SecurePass123! (UX Designer)');
    console.log('\n🎯 Additional Users:');
    console.log('  • david.park@example.com | SecurePass123! (Senior Developer/Tech Lead)');
    console.log('  • lisa.wang@example.com | SecurePass123! (Python Developer)');
    console.log('  • james.wilson@example.com | SecurePass123! (DevOps Engineer)');
    console.log('  • jessica.wong@example.com | SecurePass123! (Engineering Manager)');

    console.log('\n🌟 Rich Demo Environment Created:');
    console.log('  • Comprehensive skill assessments with peer validation');
    console.log('  • Diverse job opportunities across all experience levels');
    console.log('  • Extensive peer review network with detailed feedback');
    console.log('  • Realistic skill gaps and learning recommendations');
    console.log('  • Cross-functional team collaboration examples');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run the seeding script
seedDatabase();

export { seedDatabase };
