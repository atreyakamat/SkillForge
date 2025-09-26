import Job from '../models/Job.js'

export async function seedJobs(req, res) {
  const mockJobs = [
    {
      title: "Senior React Developer",
      company: "TechCorp Inc",
      location: "San Francisco, CA",
      type: "remote",
      requiredSkills: [
        { name: "JavaScript", level: 9, importance: "critical" },
        { name: "React", level: 8, importance: "critical" },
        { name: "TypeScript", level: 7, importance: "preferred" },
        { name: "Node.js", level: 6, importance: "preferred" }
      ],
      salaryMin: 120000,
      salaryMax: 180000,
      experience: "5+ years",
      source: "manual",
      expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      industry: "Technology",
      department: "Engineering",
      careerLevel: "senior"
    },
    {
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "Austin, TX",
      type: "hybrid",
      requiredSkills: [
        { name: "JavaScript", level: 8, importance: "critical" },
        { name: "React", level: 7, importance: "critical" },
        { name: "Node.js", level: 8, importance: "critical" },
        { name: "Python", level: 6, importance: "preferred" },
        { name: "AWS", level: 5, importance: "preferred" }
      ],
      salaryMin: 90000,
      salaryMax: 140000,
      experience: "3+ years",
      source: "manual",
      expiry: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      industry: "Technology",
      department: "Engineering",
      careerLevel: "mid"
    },
    {
      title: "Frontend Developer",
      company: "Design Agency",
      location: "New York, NY",
      type: "onsite",
      requiredSkills: [
        { name: "JavaScript", level: 7, importance: "critical" },
        { name: "React", level: 8, importance: "critical" },
        { name: "CSS", level: 8, importance: "critical" },
        { name: "HTML", level: 8, importance: "critical" },
        { name: "Figma", level: 6, importance: "preferred" }
      ],
      salaryMin: 75000,
      salaryMax: 110000,
      experience: "2+ years",
      source: "manual",
      expiry: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
      industry: "Technology",
      department: "Design",
      careerLevel: "mid"
    },
    {
      title: "Junior JavaScript Developer",
      company: "Learning Corp",
      location: "Remote",
      type: "remote",
      requiredSkills: [
        { name: "JavaScript", level: 5, importance: "critical" },
        { name: "HTML", level: 6, importance: "critical" },
        { name: "CSS", level: 6, importance: "critical" },
        { name: "Git", level: 4, importance: "preferred" }
      ],
      salaryMin: 50000,
      salaryMax: 70000,
      experience: "0-2 years",
      source: "manual",
      expiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      industry: "Technology",
      department: "Engineering",
      careerLevel: "junior"
    },
    {
      title: "DevOps Engineer",
      company: "CloudTech Solutions",
      location: "Seattle, WA",
      type: "remote",
      requiredSkills: [
        { name: "AWS", level: 8, importance: "critical" },
        { name: "Docker", level: 7, importance: "critical" },
        { name: "Kubernetes", level: 6, importance: "critical" },
        { name: "Python", level: 6, importance: "preferred" },
        { name: "Linux", level: 7, importance: "preferred" }
      ],
      salaryMin: 110000,
      salaryMax: 160000,
      experience: "4+ years",
      source: "manual",
      expiry: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days from now
      industry: "Technology",
      department: "Infrastructure",
      careerLevel: "senior"
    },
    // Expired job for testing
    {
      title: "Expired Backend Developer",
      company: "OldTech Inc",
      location: "Chicago, IL",
      type: "onsite",
      requiredSkills: [
        { name: "Node.js", level: 7, importance: "critical" },
        { name: "MongoDB", level: 6, importance: "critical" }
      ],
      salaryMin: 80000,
      salaryMax: 120000,
      experience: "3+ years",
      source: "manual",
      expiry: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (expired)
      industry: "Technology",
      department: "Engineering",
      careerLevel: "mid"
    }
  ]

  try {
    await Job.deleteMany({}) // Clear existing jobs
    const jobs = await Job.insertMany(mockJobs)
    res.status(201).json({
      success: true,
      message: `${jobs.length} jobs seeded successfully`,
      jobs: jobs.map(job => ({
        id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        requiredSkills: job.requiredSkills,
        salary: { min: job.salaryMin, max: job.salaryMax },
        source: job.source,
        postDate: job.postDate,
        expiry: job.expiry,
        industry: job.industry,
        department: job.department,
        careerLevel: job.careerLevel
      }))
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to seed jobs',
      error: error.message
    })
  }
}

export async function getAllJobs(req, res) {
  try {
    const jobs = await Job.find({})
    res.json({
      success: true,
      jobs: jobs,
      count: jobs.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve jobs',
      error: error.message
    })
  }
}