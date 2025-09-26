import User from '../models/User.js'

export async function me(req, res) {
  const user = await User.findById(req.user.id)
  if (!user) return res.status(404).json({ success: false, message: 'User not found' })
  res.json({ success: true, user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    industry: user.industry,
    experience: user.experience,
    skills: user.skills,
    careerGoals: user.careerGoals || [],
    preferences: user.preferences,
    createdAt: user.createdAt
  }})
}

export async function updateProfile(req, res) {
  const updates = {
    name: req.body.name,
    role: req.body.role,
    industry: req.body.industry,
    experience: req.body.experience,
    careerGoals: req.body.careerGoals,
    preferences: req.body.preferences
  }
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true })
  res.json({ success: true, message: 'Profile updated successfully', user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    experience: user.experience,
    careerGoals: user.careerGoals,
    preferences: user.preferences,
    updatedAt: user.updatedAt
  }})
}

export async function addSkills(req, res) {
  const { skills } = req.body
  const user = await User.findById(req.user.id)
  user.skills = skills || []
  await user.save()
  res.status(201).json({ success: true, message: 'Skills added successfully', user: { id: user._id, skills: user.skills } })
}

