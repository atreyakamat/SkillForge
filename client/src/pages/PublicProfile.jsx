import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'

export default function PublicProfile() {
  const { userId } = useParams()
  const { isAuthenticated } = useAuthContext()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile/public/${userId}`)
        
        if (!response.ok) {
          throw new Error('Profile not found')
        }
        
        const data = await response.json()
        
        if (data.success && data.profile) {
          // Transform API data to component format
          const transformedProfile = {
            id: data.profile.id,
            name: data.profile.name,
            role: data.profile.role,
            industry: data.profile.industry,
            experienceLevel: data.profile.experienceLevel,
            location: 'San Francisco, CA', // Default for now
            experience: data.profile.experienceLevel || 'Professional',
            bio: `Professional ${data.profile.role} with expertise in ${data.profile.skills.slice(0, 3).map(s => s.name).join(', ')} and more.`,
            skills: data.profile.skills.map(skill => ({
              name: skill.name,
              rating: skill.averageRating || skill.selfRating,
              category: skill.category,
              validated: skill.validated
            })),
            achievements: data.profile.achievements,
            peerEndorsements: data.profile.stats.peerEndorsements,
            averageRating: data.profile.stats.averageRating,
            profileViews: data.profile.stats.profileViews,
            joinedDate: data.profile.joinedDate
          }
          setProfile(transformedProfile)
        } else {
          throw new Error('Invalid profile data')
        }
      } catch (err) {
        console.error('Error fetching public profile:', err)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchPublicProfile()
    }
  }, [userId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">The profile you're looking for doesn't exist or is not public.</p>
          <Link
            to="/"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
            SkillForge
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Join SkillForge
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <img
              className="h-32 w-32 rounded-full object-cover"
              src="https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=300&auto=format&fit=crop"
              alt={`${profile.name}'s profile`}
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
              <p className="text-xl text-gray-600 mb-3">{profile.role}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  {profile.location}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  {profile.experience}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">calendar_month</span>
                  Member since {new Date(profile.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4">
                <div className="text-2xl font-bold text-primary-700">{profile.averageRating}/5</div>
                <div className="text-sm text-primary-600">Peer Rating</div>
              </div>
              <div className="text-sm text-gray-600">
                {profile.peerEndorsements} peer endorsements
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skills Portfolio */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills Portfolio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.skills.map((skill, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                      <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {skill.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(skill.rating / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{skill.rating}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-100 rounded-lg">
                    <div className="bg-primary-600 text-white p-2 rounded-full">
                      <span className="material-symbols-outlined text-[20px]">emoji_events</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Profile Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Skills Assessed</span>
                  <span className="font-semibold">{profile.skills.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Peer Endorsements</span>
                  <span className="font-semibold">{profile.peerEndorsements}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="font-semibold">{profile.averageRating}/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Profile Views</span>
                  <span className="font-semibold">{profile.profileViews?.toLocaleString() || '0'}</span>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-br from-primary-600 to-purple-600 text-white rounded-xl p-6">
              <h3 className="font-semibold mb-2">Start Your Journey</h3>
              <p className="text-primary-100 text-sm mb-4">
                Create your own professional skills portfolio and connect with peers.
              </p>
              <Link
                to="/register"
                className="w-full bg-white text-primary-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors block text-center"
              >
                Join SkillForge
              </Link>
            </div>

            {/* Share Profile */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Share This Profile</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    const url = window.location.href
                    const text = `Check out ${profile.name}'s professional skills portfolio on SkillForge!`
                    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`
                    window.open(linkedInUrl, '_blank')
                  }}
                  className="flex items-center justify-center p-3 bg-[#0077B5] text-white rounded-lg hover:bg-[#005885] transition-colors"
                  title="Share on LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    const url = window.location.href
                    const text = `Check out ${profile.name}'s skills on @SkillForge! 🚀`
                    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
                    window.open(twitterUrl, '_blank')
                  }}
                  className="flex items-center justify-center p-3 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#0d8bd9] transition-colors"
                  title="Share on Twitter"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    // You could add a toast notification here
                  }}
                  className="flex items-center justify-center p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  title="Copy Link"
                >
                  <span className="material-symbols-outlined text-[16px]">link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}