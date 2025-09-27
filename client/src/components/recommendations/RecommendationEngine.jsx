import React, { useState, useEffect, useContext } from 'react'
import { SkillContext } from '../../contexts/SkillContext'
import { useAuthContext } from '../../contexts/AuthContext'
import analyticsAPI from '../../services/analyticsAPI'

// Smart Recommendation Engine - Updated with correct imports

const RecommendationEngine = () => {
  const { skills } = useContext(SkillContext)
  const { user } = useAuthContext()
  const [recommendations, setRecommendations] = useState({})
  const [selectedCategory, setSelectedCategory] = useState('courses')
  const [personalityType, setPersonalityType] = useState('visual')
  const [learningGoals, setLearningGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookmarkedItems, setBookmarkedItems] = useState([])

  const categories = {
    courses: { title: 'Online Courses', icon: '📚', description: 'Structured learning paths' },
    projects: { title: 'Practice Projects', icon: '🛠️', description: 'Hands-on experience' },
    articles: { title: 'Articles & Blogs', icon: '📖', description: 'Latest insights' },
    videos: { title: 'Video Tutorials', icon: '🎥', description: 'Visual learning' },
    books: { title: 'Recommended Books', icon: '📕', description: 'Deep knowledge' },
    tools: { title: 'Tools & Resources', icon: '⚙️', description: 'Productivity boosters' },
    communities: { title: 'Communities', icon: '👥', description: 'Connect & learn' },
    certificates: { title: 'Certifications', icon: '🏆', description: 'Validate your skills' }
  }

  useEffect(() => {
    loadRecommendations()
  }, [personalityType, learningGoals])

  const loadRecommendations = async () => {
    setLoading(true)
    try {
      // Simulate AI-powered recommendation generation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const generatedRecommendations = generatePersonalizedRecommendations()
      setRecommendations(generatedRecommendations)
    } catch (error) {
      console.error('Failed to load recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const generatePersonalizedRecommendations = () => {
    const userSkillNames = skills.map(s => s.name)
    const weakSkills = skills.filter(s => (s.selfRating || 0) < 6)
    const strongSkills = skills.filter(s => (s.selfRating || 0) >= 8)

    return {
      courses: generateCourses(weakSkills, strongSkills),
      projects: generateProjects(userSkillNames),
      articles: generateArticles(weakSkills),
      videos: generateVideos(personalityType),
      books: generateBooks(strongSkills),
      tools: generateTools(userSkillNames),
      communities: generateCommunities(userSkillNames),
      certificates: generateCertificates(strongSkills)
    }
  }

  const generateCourses = (weakSkills, strongSkills) => [
    {
      id: 1,
      title: 'Advanced JavaScript Mastery',
      provider: 'TechEdu Pro',
      rating: 4.8,
      students: 125000,
      duration: '12 weeks',
      level: 'Advanced',
      price: '$89',
      match: 95,
      skills: ['JavaScript', 'ES6+', 'Async Programming'],
      thumbnail: '🚀',
      description: 'Master advanced JavaScript concepts with real-world projects'
    },
    {
      id: 2,
      title: 'React Hooks Deep Dive',
      provider: 'CodeMaster',
      rating: 4.9,
      students: 89000,
      duration: '8 weeks',
      level: 'Intermediate',
      price: '$69',
      match: 88,
      skills: ['React', 'Hooks', 'State Management'],
      thumbnail: '⚛️',
      description: 'Comprehensive guide to React Hooks and modern patterns'
    },
    {
      id: 3,
      title: 'Full Stack Development Bootcamp',
      provider: 'DevAcademy',
      rating: 4.7,
      students: 200000,
      duration: '16 weeks',
      level: 'Beginner to Advanced',
      price: '$199',
      match: 92,
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      thumbnail: '💻',
      description: 'Complete web development from frontend to backend'
    }
  ]

  const generateProjects = (userSkills) => [
    {
      id: 1,
      title: 'Build a Real-time Chat Application',
      difficulty: 'Intermediate',
      timeEstimate: '2-3 weeks',
      skills: ['React', 'Socket.io', 'Node.js'],
      match: 90,
      description: 'Create a full-featured chat app with real-time messaging',
      features: ['User authentication', 'Message encryption', 'File sharing', 'Emoji support'],
      thumbnail: '💬',
      githubUrl: '#',
      demoUrl: '#'
    },
    {
      id: 2,
      title: 'E-commerce Dashboard with Analytics',
      difficulty: 'Advanced',
      timeEstimate: '4-5 weeks',
      skills: ['React', 'Chart.js', 'REST APIs'],
      match: 85,
      description: 'Build a comprehensive dashboard for e-commerce management',
      features: ['Sales analytics', 'Inventory tracking', 'User management', 'Reports'],
      thumbnail: '📊',
      githubUrl: '#',
      demoUrl: '#'
    },
    {
      id: 3,
      title: 'AI-Powered Task Manager',
      difficulty: 'Advanced',
      timeEstimate: '3-4 weeks',
      skills: ['JavaScript', 'Machine Learning', 'APIs'],
      match: 78,
      description: 'Smart task management with AI-powered prioritization',
      features: ['Smart scheduling', 'Priority prediction', 'Natural language input'],
      thumbnail: '🤖',
      githubUrl: '#',
      demoUrl: '#'
    }
  ]

  const generateArticles = (weakSkills) => [
    {
      id: 1,
      title: 'Modern JavaScript Best Practices in 2025',
      author: 'Sarah Chen',
      publication: 'Dev Weekly',
      readTime: '8 min',
      relevance: 95,
      tags: ['JavaScript', 'Best Practices', 'ES2025'],
      thumbnail: '📝',
      url: '#'
    },
    {
      id: 2,
      title: 'React Performance Optimization Techniques',
      author: 'Mike Johnson',
      publication: 'Frontend Focus',
      readTime: '12 min',
      relevance: 88,
      tags: ['React', 'Performance', 'Optimization'],
      thumbnail: '⚡',
      url: '#'
    },
    {
      id: 3,
      title: 'The Future of Web Development: Trends to Watch',
      author: 'Alex Rivera',
      publication: 'Tech Insights',
      readTime: '15 min',
      relevance: 82,
      tags: ['Web Development', 'Trends', 'Future Tech'],
      thumbnail: '🔮',
      url: '#'
    }
  ]

  const generateVideos = (learningType) => [
    {
      id: 1,
      title: 'JavaScript Algorithms and Data Structures',
      creator: 'CodeWithMosh',
      duration: '3:45:22',
      views: '2.3M',
      match: 92,
      skills: ['JavaScript', 'Algorithms', 'Data Structures'],
      thumbnail: '🧮',
      url: '#'
    },
    {
      id: 2,
      title: 'React Hooks Tutorial - Complete Guide',
      creator: 'Traversy Media',
      duration: '2:15:30',
      views: '1.8M',
      match: 89,
      skills: ['React', 'Hooks', 'State Management'],
      thumbnail: '🎣',
      url: '#'
    },
    {
      id: 3,
      title: 'Building Production-Ready Node.js Apps',
      creator: 'Academind',
      duration: '4:20:15',
      views: '956K',
      match: 85,
      skills: ['Node.js', 'Express', 'MongoDB'],
      thumbnail: '🏗️',
      url: '#'
    }
  ]

  const generateBooks = (strongSkills) => [
    {
      id: 1,
      title: 'You Don\'t Know JS Yet: Advanced Topics',
      author: 'Kyle Simpson',
      rating: 4.7,
      pages: 385,
      match: 94,
      skills: ['JavaScript', 'Advanced Concepts'],
      thumbnail: '📚',
      description: 'Deep dive into JavaScript\'s most complex features'
    },
    {
      id: 2,
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      rating: 4.8,
      pages: 464,
      match: 88,
      skills: ['Programming Principles', 'Best Practices'],
      thumbnail: '🧹',
      description: 'Essential principles for writing maintainable code'
    },
    {
      id: 3,
      title: 'React Design Patterns and Best Practices',
      author: 'Carlos Santana Roldán',
      rating: 4.6,
      pages: 318,
      match: 91,
      skills: ['React', 'Design Patterns'],
      thumbnail: '🎨',
      description: 'Advanced patterns for scalable React applications'
    }
  ]

  const generateTools = (userSkills) => [
    {
      id: 1,
      name: 'VS Code Extensions Pack',
      category: 'Development Environment',
      match: 96,
      description: 'Essential extensions for modern web development',
      features: ['IntelliSense', 'Debugging', 'Git Integration'],
      thumbnail: '🔧',
      url: '#'
    },
    {
      id: 2,
      name: 'Figma for Developers',
      category: 'Design Tools',
      match: 78,
      description: 'Design tool integration for better developer workflow',
      features: ['Design handoff', 'Component library', 'Prototyping'],
      thumbnail: '🎨',
      url: '#'
    },
    {
      id: 3,
      name: 'Postman API Testing Suite',
      category: 'API Development',
      match: 85,
      description: 'Complete API development and testing platform',
      features: ['API testing', 'Documentation', 'Collaboration'],
      thumbnail: '📡',
      url: '#'
    }
  ]

  const generateCommunities = (userSkills) => [
    {
      id: 1,
      name: 'JavaScript Developers Community',
      platform: 'Discord',
      members: '125K',
      activity: 'Very Active',
      match: 95,
      description: 'Connect with JavaScript developers worldwide',
      thumbnail: '💬',
      url: '#'
    },
    {
      id: 2,
      name: 'React Developers',
      platform: 'Reddit',
      members: '890K',
      activity: 'High',
      match: 88,
      description: 'Share React tips, tricks, and projects',
      thumbnail: '🤝',
      url: '#'
    },
    {
      id: 3,
      name: 'Full Stack Developers',
      platform: 'LinkedIn',
      members: '2.1M',
      activity: 'Moderate',
      match: 82,
      description: 'Professional networking for full-stack developers',
      thumbnail: '👔',
      url: '#'
    }
  ]

  const generateCertificates = (strongSkills) => [
    {
      id: 1,
      title: 'AWS Certified Developer Associate',
      provider: 'Amazon Web Services',
      difficulty: 'Intermediate',
      duration: '3 months prep',
      cost: '$150',
      match: 89,
      skills: ['AWS', 'Cloud Computing', 'Serverless'],
      thumbnail: '☁️',
      description: 'Validate your AWS development skills',
      url: '#'
    },
    {
      id: 2,
      title: 'Meta Frontend Developer Professional Certificate',
      provider: 'Meta (Facebook)',
      difficulty: 'Beginner to Intermediate',
      duration: '6 months',
      cost: '$49/month',
      match: 92,
      skills: ['React', 'JavaScript', 'Frontend Development'],
      thumbnail: '📱',
      description: 'Comprehensive frontend development certification',
      url: '#'
    },
    {
      id: 3,
      title: 'Google Cloud Professional Developer',
      provider: 'Google Cloud',
      difficulty: 'Advanced',
      duration: '4-6 months prep',
      cost: '$200',
      match: 75,
      skills: ['Google Cloud', 'Microservices', 'Kubernetes'],
      thumbnail: '🏗️',
      description: 'Advanced cloud development certification',
      url: '#'
    }
  ]

  const toggleBookmark = (item, category) => {
    const itemWithCategory = { ...item, category }
    const bookmarkKey = `${category}-${item.id}`
    
    setBookmarkedItems(prev => {
      const isBookmarked = prev.some(b => `${b.category}-${b.id}` === bookmarkKey)
      if (isBookmarked) {
        return prev.filter(b => `${b.category}-${b.id}` !== bookmarkKey)
      } else {
        return [...prev, itemWithCategory]
      }
    })
  }

  const isBookmarked = (item, category) => {
    return bookmarkedItems.some(b => b.category === category && b.id === item.id)
  }

  const RecommendationCard = ({ item, category, showMatch = true }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{item.thumbnail}</span>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {item.title || item.name}
            </h3>
            {item.author && (
              <p className="text-sm text-gray-600">by {item.author}</p>
            )}
            {item.provider && (
              <p className="text-sm text-gray-600">{item.provider}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {showMatch && item.match && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              {item.match}% match
            </span>
          )}
          <button
            onClick={() => toggleBookmark(item, category)}
            className={`p-2 rounded-full transition-colors ${
              isBookmarked(item, category)
                ? 'text-yellow-500 bg-yellow-50'
                : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
            }`}
          >
            {isBookmarked(item, category) ? '★' : '☆'}
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">{item.description}</p>
      
      {item.skills && (
        <div className="flex flex-wrap gap-2 mb-4">
          {item.skills.map((skill, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              {skill}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          {item.rating && (
            <span className="flex items-center space-x-1">
              <span>⭐</span>
              <span>{item.rating}</span>
            </span>
          )}
          {item.duration && <span>⏱️ {item.duration}</span>}
          {item.difficulty && <span>📊 {item.difficulty}</span>}
          {item.price && <span>💰 {item.price}</span>}
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
          Learn More
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎯 Personalized Learning Recommendations
        </h1>
        <p className="text-gray-600 text-lg">
          Discover resources tailored to your skills, goals, and learning style
        </p>
      </div>

      {/* Learning Preferences */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">🧠 Personalization Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Learning Style Preference
            </label>
            <select
              value={personalityType}
              onChange={(e) => setPersonalityType(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="visual">👁️ Visual Learner (Charts, Diagrams)</option>
              <option value="hands-on">✋ Hands-on (Projects, Practice)</option>
              <option value="reading">📚 Reading (Articles, Documentation)</option>
              <option value="video">🎥 Video-based Learning</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Focus Areas
            </label>
            <div className="flex flex-wrap gap-2">
              {['Frontend', 'Backend', 'DevOps', 'Mobile', 'AI/ML'].map(area => (
                <button
                  key={area}
                  onClick={() => {
                    setLearningGoals(prev =>
                      prev.includes(area)
                        ? prev.filter(g => g !== area)
                        : [...prev, area]
                    )
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    learningGoals.includes(area)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8 overflow-x-auto">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 transition-colors ${
                  selectedCategory === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {categories[selectedCategory].title}
          </h3>
          <p className="text-gray-600">{categories[selectedCategory].description}</p>
        </div>

        {/* Recommendations Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations[selectedCategory]?.map((item) => (
              <RecommendationCard
                key={item.id}
                item={item}
                category={selectedCategory}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bookmarked Items */}
      {bookmarkedItems.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">⭐ Your Bookmarked Resources</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {bookmarkedItems.slice(0, 4).map((item, index) => (
              <RecommendationCard
                key={index}
                item={item}
                category={item.category}
                showMatch={false}
              />
            ))}
          </div>
          {bookmarkedItems.length > 4 && (
            <div className="text-center mt-4">
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                View All Bookmarks ({bookmarkedItems.length})
              </button>
            </div>
          )}
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">🤖 AI Learning Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">📈 Next Skill to Focus</h4>
            <p className="text-sm text-purple-700">
              Based on your progress, TypeScript would complement your JavaScript skills perfectly.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">⏰ Optimal Learning Time</h4>
            <p className="text-sm text-purple-700">
              You're most productive during evening sessions. Schedule complex topics for 7-9 PM.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">🎯 Career Path Recommendation</h4>
            <p className="text-sm text-purple-700">
              Your skills align well with Full Stack Developer roles. Focus on backend technologies.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecommendationEngine