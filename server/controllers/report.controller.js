import User from '../models/User.js'
import Assessment from '../models/Assessment.js'
import { analyzeSkills } from '../services/skillAnalysis.js'
import { generateLearningPath } from '../services/recommendations.js'
import { formatApiResponse, calculateAverageRating, calculateSkillGrowth, generateSkillMatrix } from '../utils/helpers.js'
import PDFDocument from 'pdfkit'

export async function generateSkillReport(req, res) {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) return res.status(404).json(formatApiResponse(false, 'User not found'))
    
    const assessments = await Assessment.find({ user: req.params.userId }).populate('skill')
    const skills = assessments.map(a => ({
      name: a.skill?.name || 'Unknown Skill',
      selfRating: a.selfRating || 0,
      averageRating: a.averageRating || a.selfRating || 0,
      lastAssessed: a.assessmentDate || a.createdAt
    }))

    // Check if PDF format is requested
    if (req.query.format === 'pdf') {
      const doc = new PDFDocument()
      
      // Set response headers for PDF
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename="skill-report-${user.name}.pdf"`)
      
      // Pipe PDF to response
      doc.pipe(res)
      
      // Generate PDF content
      doc.fontSize(20).text('Skill Assessment Report', 50, 50)
      doc.fontSize(14).text(`User: ${user.name}`, 50, 80)
      doc.text(`Email: ${user.email}`, 50, 100)
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 50, 120)
      
      doc.text('Skills Overview:', 50, 160)
      
      let yPosition = 180
      skills.forEach((skill, index) => {
        doc.text(`${index + 1}. ${skill.name}`, 70, yPosition)
        doc.text(`   Self Rating: ${skill.selfRating}/10`, 90, yPosition + 15)
        doc.text(`   Average Rating: ${skill.averageRating}/10`, 90, yPosition + 30)
        doc.text(`   Last Assessed: ${skill.lastAssessed ? new Date(skill.lastAssessed).toLocaleDateString() : 'Never'}`, 90, yPosition + 45)
        yPosition += 80
        
        // Add new page if needed
        if (yPosition > 700) {
          doc.addPage()
          yPosition = 50
        }
      })
      
      doc.end()
      return
    }
    
    // Return JSON response
    res.json(formatApiResponse(true, 'Skill report generated', { 
      user: { id: user._id, name: user.name, email: user.email },
      skills,
      totalSkills: skills.length,
      averageRating: skills.length ? (skills.reduce((sum, s) => sum + s.averageRating, 0) / skills.length).toFixed(2) : 0
    }))
  } catch (error) {
    console.error('Error generating skill report:', error)
    res.status(500).json(formatApiResponse(false, 'Failed to generate skill report'))
  }
}

export async function exportSkillData(req, res) {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) return res.status(404).json(formatApiResponse(false, 'User not found'))
    
    const assessments = await Assessment.find({ user: req.params.userId }).populate('skill')
    const data = assessments.map(a => ({
      skill: a.skill?.name || 'Unknown',
      category: a.skill?.category || 'Uncategorized',
      selfRating: a.selfRating || 0,
      averageRating: a.averageRating || a.selfRating || 0,
      confidence: a.confidence || 'Not specified',
      lastAssessed: a.assessmentDate || a.createdAt,
      peerRatings: (a.peerRatings || []).length
    }))
    
    const format = (req.query.format || 'json').toLowerCase()
    
    if (format === 'csv') {
      const headers = ['skill', 'category', 'selfRating', 'averageRating', 'confidence', 'lastAssessed', 'peerRatings']
      const csvRows = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
          let value = row[header]
          if (header === 'lastAssessed' && value) {
            value = new Date(value).toISOString().split('T')[0]
          }
          return `"${value}"`
        }).join(','))
      ]
      
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', `attachment; filename="skills-export-${user.name}.csv"`)
      res.send(csvRows.join('\n'))
      return
    }
    
    // JSON export
    res.json(formatApiResponse(true, 'Skill data exported', { 
      user: { id: user._id, name: user.name },
      exportDate: new Date().toISOString(),
      data 
    }))
  } catch (error) {
    console.error('Error exporting skill data:', error)
    res.status(500).json(formatApiResponse(false, 'Failed to export skill data'))
  }
}

export async function getProgressReport(req, res) {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) return res.status(404).json(formatApiResponse(false, 'User not found'))
    
    const assessments = await Assessment.find({ user: req.params.userId }).populate('skill').sort({ createdAt: 1 })
    
    // Group assessments by skill and track progress over time
    const skillProgress = {}
    assessments.forEach(assessment => {
      const skillName = assessment.skill?.name || 'Unknown'
      if (!skillProgress[skillName]) {
        skillProgress[skillName] = []
      }
      skillProgress[skillName].push({
        date: assessment.assessmentDate || assessment.createdAt,
        level: assessment.selfRating || 0,
        averageRating: assessment.averageRating || assessment.selfRating || 0
      })
    })
    
    // Calculate progress for each skill
    const progress = Object.entries(skillProgress).map(([skillName, history]) => {
      const growth = calculateSkillGrowth(history)
      return {
        skill: skillName,
        currentLevel: history[history.length - 1]?.level || 0,
        startLevel: history[0]?.level || 0,
        growth: growth,
        assessmentCount: history.length,
        lastAssessment: history[history.length - 1]?.date,
        timeline: history.sort((a, b) => new Date(a.date) - new Date(b.date))
      }
    })
    
    // Overall progress metrics
    const overallMetrics = {
      totalSkills: progress.length,
      averageGrowth: progress.length ? (progress.reduce((sum, p) => sum + p.growth.delta, 0) / progress.length).toFixed(2) : 0,
      improvingSkills: progress.filter(p => p.growth.delta > 0).length,
      stagnantSkills: progress.filter(p => p.growth.delta === 0).length,
      decliningSkills: progress.filter(p => p.growth.delta < 0).length
    }
    
    res.json(formatApiResponse(true, 'Progress report generated', { 
      user: { id: user._id, name: user.name },
      reportDate: new Date().toISOString(),
      progress: progress.sort((a, b) => b.growth.delta - a.growth.delta), // Sort by improvement
      metrics: overallMetrics
    }))
  } catch (error) {
    console.error('Error generating progress report:', error)
    res.status(500).json(formatApiResponse(false, 'Failed to generate progress report'))
  }
}

export async function generateGapAnalysis(req, res) {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) return res.status(404).json(formatApiResponse(false, 'User not found'))
    
    const assessments = await Assessment.find({ user: req.params.userId }).populate('skill')
    const userLevels = Object.fromEntries(assessments.map(a => [a.skill?.name || 'Unknown', a.averageRating || a.selfRating || 0]))
    
    // Get industry standard requirements or use provided requirements
    const targetRole = req.query.role || 'Senior Developer'
    const targetSkills = req.body.requiredSkills || [
      { name: 'JavaScript', level: 8, importance: 'critical' },
      { name: 'React', level: 7, importance: 'critical' },
      { name: 'Node.js', level: 6, importance: 'preferred' },
      { name: 'TypeScript', level: 7, importance: 'preferred' },
      { name: 'AWS', level: 5, importance: 'preferred' }
    ]
    
    const gaps = targetSkills.map(target => {
      const currentLevel = userLevels[target.name] || 0
      const gap = Math.max(0, target.level - currentLevel)
      const priority = target.importance === 'critical' && gap > 2 ? 'high' : 
                     target.importance === 'critical' && gap > 0 ? 'medium' : 'low'
      
      let recommendation = ''
      if (gap === 0) {
        recommendation = `You meet the ${target.name} requirements for ${targetRole}`
      } else if (gap <= 2) {
        recommendation = `Focus on advanced ${target.name} concepts and practical applications`
      } else if (gap <= 4) {
        recommendation = `Invest significant time in ${target.name} fundamentals and intermediate topics`
      } else {
        recommendation = `Start with ${target.name} basics - consider structured learning path`
      }
      
      return {
        skill: target.name,
        currentLevel: currentLevel,
        targetLevel: target.level,
        gap: gap,
        importance: target.importance,
        priority: priority,
        recommendation: recommendation,
        estimatedLearningTime: gap > 0 ? `${Math.ceil(gap * 2)} weeks` : 'No additional time needed'
      }
    })
    
    const learningPath = generateLearningPath(gaps.filter(g => g.gap > 0))
    
    // Analysis summary
    const summary = {
      totalGaps: gaps.filter(g => g.gap > 0).length,
      criticalGaps: gaps.filter(g => g.importance === 'critical' && g.gap > 0).length,
      highPriorityGaps: gaps.filter(g => g.priority === 'high').length,
      averageGap: gaps.length ? (gaps.reduce((sum, g) => sum + g.gap, 0) / gaps.length).toFixed(1) : 0,
      readinessScore: Math.max(0, 100 - (gaps.reduce((sum, g) => sum + (g.gap * (g.importance === 'critical' ? 2 : 1)), 0) * 2))
    }
    
    res.json(formatApiResponse(true, 'Gap analysis generated', { 
      user: { id: user._id, name: user.name },
      targetRole,
      analysisDate: new Date().toISOString(),
      gaps: gaps.sort((a, b) => (b.importance === 'critical' ? 1 : 0) - (a.importance === 'critical' ? 1 : 0) || b.gap - a.gap),
      summary,
      learningPath
    }))
  } catch (error) {
    console.error('Error generating gap analysis:', error)
    res.status(500).json(formatApiResponse(false, 'Failed to generate gap analysis'))
  }
}

export async function createTeamReport(req, res) {
  try {
    const managerId = req.params.managerId
    const manager = await User.findById(managerId)
    if (!manager) return res.status(404).json(formatApiResponse(false, 'Manager not found'))
    
    // Get team members (for demo: pass userIds in query (?ids=a,b,c))
    const teamIds = (req.query.ids || '').split(',').filter(Boolean)
    if (teamIds.length === 0) {
      return res.status(400).json(formatApiResponse(false, 'No team member IDs provided. Use ?ids=userId1,userId2,userId3'))
    }
    
    const teamMembers = await User.find({ _id: { $in: teamIds } })
    const assessments = await Assessment.find({ user: { $in: teamIds } }).populate('skill')
    
    // Build team report
    const teamReport = []
    for (const member of teamMembers) {
      const memberAssessments = assessments.filter(a => String(a.user) === String(member._id))
      const skills = memberAssessments.map(a => ({
        name: a.skill?.name || 'Unknown',
        rating: a.averageRating || a.selfRating || 0
      }))
      
      const avgRating = skills.length ? (skills.reduce((sum, s) => sum + s.rating, 0) / skills.length) : 0
      const gapCount = skills.filter(s => s.rating < 7).length // Assuming 7+ is proficient
      
      teamReport.push({
        userId: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
        skillCount: skills.length,
        avgRating: Number(avgRating.toFixed(2)),
        gapCount,
        skills: skills.sort((a, b) => b.rating - a.rating)
      })
    }
    
    // Generate skill matrix for the team
    const matrix = generateSkillMatrix(teamMembers)
    
    // Team analytics
    const analytics = {
      teamSize: teamReport.length,
      teamAvgRating: teamReport.length ? (teamReport.reduce((sum, m) => sum + m.avgRating, 0) / teamReport.length).toFixed(2) : 0,
      totalSkillGaps: teamReport.reduce((sum, m) => sum + m.gapCount, 0),
      topPerformers: teamReport.filter(m => m.avgRating >= 8).length,
      needsImprovement: teamReport.filter(m => m.avgRating < 6).length,
      commonSkills: matrix.skills.filter(skill => 
        matrix.rows.filter(row => row.levels[skill] > 0).length >= Math.ceil(teamReport.length * 0.7)
      ),
      skillGaps: matrix.skills.filter(skill => 
        matrix.rows.filter(row => row.levels[skill] < 6).length >= Math.ceil(teamReport.length * 0.5)
      )
    }
    
    res.json(formatApiResponse(true, 'Team report generated', {
      manager: { id: manager._id, name: manager.name },
      reportDate: new Date().toISOString(),
      teamReport: teamReport.sort((a, b) => b.avgRating - a.avgRating), // Sort by performance
      matrix,
      analytics
    }))
  } catch (error) {
    console.error('Error creating team report:', error)
    res.status(500).json(formatApiResponse(false, 'Failed to create team report'))
  }
}

