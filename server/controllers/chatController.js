import { OpenRouter } from 'openrouter-client'
import { User } from '../models/User.js'
import { Assessment } from '../models/Assessment.js'
import { Skill } from '../models/Skill.js'

const openrouter = new OpenRouter({ apiKey: process.env.OPENROUTER_API_KEY })

// Helper function to get user skills
async function getUserSkills(userId) {
  try {
    const user = await User.findById(userId).populate('skills.skill')
    if (!user) return []
    
    return user.skills.map(userSkill => ({
      name: userSkill.skill?.name || 'Unknown Skill',
      averageRating: userSkill.selfRating || 0,
      category: userSkill.skill?.category || 'General'
    }))
  } catch (error) {
    console.error('Error fetching user skills:', error)
    return []
  }
}

// Helper function to get skill gaps
async function getSkillGaps(userId) {
  try {
    const assessments = await Assessment.find({ user: userId })
      .populate('skill')
      .sort({ createdAt: -1 })
      .limit(10)
    
    const gaps = []
    assessments.forEach(assessment => {
      if (assessment.skill) {
        gaps.push({
          skill: assessment.skill.name,
          gap: Math.max(0, (assessment.targetLevel || 5) - (assessment.selfRating || 0)),
          current: assessment.selfRating || 0,
          target: assessment.targetLevel || 5
        })
      }
    })
    
    return gaps
  } catch (error) {
    console.error('Error fetching skill gaps:', error)
    return []
  }
}

// Main chat endpoint
export const chatWithCoach = async (req, res) => {
  try {
    const { message, history = [] } = req.body
    const userId = req.user.id

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      })
    }

    // Fetch user data
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const skills = await getUserSkills(userId)
    const gaps = await getSkillGaps(userId)

    // Build the prompt
    const prompt = `You are SkillForge's AI career coach. You help users develop their skills and advance their careers.

User Profile:
- Name: ${user.name || 'User'}
- Email: ${user.email}
- Role: ${user.role || 'Member'}
- Industry: ${user.industry || 'General'}

Current Skills: ${skills.map(s => `${s.name}(${s.averageRating}/10)`).join(', ') || 'None assessed yet'}

Skill Gaps: ${gaps.map(g => `${g.skill}(gap: ${g.gap}, current: ${g.current}/10, target: ${g.target}/10)`).join(', ') || 'No gaps identified yet'}

Conversation History: ${history.length > 0 ? history.map(h => `${h.role}: ${h.content}`).join('\n') : 'This is the start of our conversation.'}

Current User Message: "${message}"

Instructions:
- Provide personalized, actionable career advice
- Focus on skill development and career growth
- Be encouraging and supportive
- Suggest specific learning resources when appropriate
- Keep responses concise but helpful (2-3 paragraphs max)
- Ask follow-up questions to better understand their goals
- Use their skill data to give relevant recommendations

Respond as a friendly, professional career coach:`

    // Get response from OpenRouter
    const response = await openrouter.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    })

    const reply = response.choices[0].message.content

    res.json({
      success: true,
      reply: reply,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chat error:', error)
    
    // Handle OpenRouter API errors
    if (error.status === 401) {
      return res.status(500).json({
        success: false,
        message: 'AI service authentication failed. Please contact support.'
      })
    }
    
    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'AI service is temporarily unavailable. Please try again later.'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to process your message. Please try again.'
    })
  }
}

// Get chat history for a user
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id
    
    // For now, return empty history since we're not persisting chat history
    // In a production app, you'd store chat history in a database
    res.json({
      success: true,
      history: [],
      message: 'Chat history retrieved successfully'
    })
  } catch (error) {
    console.error('Get chat history error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chat history'
    })
  }
}

// Save chat message (for future persistence)
export const saveChatMessage = async (req, res) => {
  try {
    const { message, reply } = req.body
    const userId = req.user.id
    
    // For now, just acknowledge the save
    // In production, you'd save to a ChatMessage model
    res.json({
      success: true,
      message: 'Chat message saved successfully'
    })
  } catch (error) {
    console.error('Save chat message error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to save chat message'
    })
  }
}
