import React, { useState } from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import { useSkillContext } from '../contexts/SkillContext'
import { Link } from 'react-router-dom'

const tabs = [
  { id: 'personal', label: 'Personal Information' },
  { id: 'skills', label: 'Skills Portfolio' },
  { id: 'network', label: 'Peer Network' },
  { id: 'privacy', label: 'Privacy & Notifications' },
  { id: 'learning', label: 'Learning Preferences' }
]

export default function Profile() {
  const [activeTab, setActiveTab] = useState('personal')
  const [showShareModal, setShowShareModal] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const { user } = useAuthContext()
  const { userSkills } = useSkillContext()

  // Get user data with fallbacks
  const userName = user?.name || user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email || 'user@example.com'
  const userRole = user?.role || 'Member'

  // Get user skills with fallbacks
  const skills = userSkills && userSkills.length > 0 ? userSkills : [
    { skillName: 'JavaScript', selfRating: 4 },
    { skillName: 'React', selfRating: 3 },
    { skillName: 'Node.js', selfRating: 2 }
  ]

  // Generate public profile URL
  const generateProfileUrl = () => {
    const baseUrl = window.location.origin
    const profileSlug = user?.id || 'user'
    return `${baseUrl}/profile/public/${profileSlug}`
  }

  // Share functionality
  const shareToLinkedIn = () => {
    const profileUrl = generateProfileUrl()
    const title = `Check out my professional skills portfolio on SkillForge`
    const description = `I've been developing my skills in ${skills.slice(0, 3).map(s => s.skillName).join(', ')} and more. See my detailed skill assessments and professional growth journey.`
    
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`
    window.open(linkedInUrl, '_blank')
  }

  const shareToTwitter = () => {
    const profileUrl = generateProfileUrl()
    const text = `Check out my professional skills portfolio on @SkillForge! Currently excelling in ${skills.slice(0, 2).map(s => s.skillName).join(' & ')} 💪 #SkillDevelopment #CareerGrowth`
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`
    window.open(twitterUrl, '_blank')
  }

  const copyProfileLink = () => {
    const profileUrl = generateProfileUrl()
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    })
  }

  const shareViaEmail = () => {
    const profileUrl = generateProfileUrl()
    const subject = `${userName}'s Professional Skills Portfolio`
    const body = `Hi!\n\nI wanted to share my professional skills portfolio with you. You can view my detailed skill assessments, peer reviews, and career development journey here:\n\n${profileUrl}\n\nBest regards,\n${userName}`
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
          <div className="relative">
            <img className="h-28 w-28 rounded-full object-cover" src="https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=300&auto=format&fit=crop" alt="Profile" />
            <label className="absolute -bottom-1 -right-1 cursor-pointer h-9 w-9 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center shadow">
              <input type="file" className="hidden" />
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            </label>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{userName}</h1>
              <span className="text-gray-600 dark:text-gray-300">{userRole}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-300">
              <span className="inline-flex items-center gap-1"><span className="material-symbols-outlined text-base">location_on</span> San Francisco, CA</span>
              <span className="inline-flex items-center gap-1"><span className="material-symbols-outlined text-base">schedule</span> 7+ years experience</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              Share Profile
            </button>
            <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Edit Profile</button>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Professional Summary</h2>
          <p className="text-gray-700 dark:text-gray-300">Frontend engineer focused on building performant, accessible interfaces. Passionate about design systems, mentoring, and delivering delightful user experiences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main content */}
        <div className="lg:col-span-9">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto">
            <nav className="flex gap-6">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`-mb-px whitespace-nowrap px-1 py-3 text-sm font-medium border-b-2 ${activeTab===t.id ? 'border-primary-600 text-primary-700 dark:text-primary-400' : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'}`}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Panels */}
          {activeTab === 'personal' && (
            <section className="space-y-8">
              <Card title="Basic Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full name" placeholder={userName} defaultValue={userName} />
                  <Input label="Email" type="email" placeholder={userEmail} defaultValue={userEmail} />
                  <Input label="Phone" placeholder="(555) 123-4567" />
                </div>
              </Card>
              <Card title="Professional Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Role" placeholder={userRole} defaultValue={userRole} />
                  <Input label="Company" placeholder="Your Company" />
                  <Input label="Industry" placeholder="Technology" />
                  <Input label="LinkedIn" placeholder="https://linkedin.com/in/username" />
                </div>
              </Card>
              <Card title="Career Goals & Objectives">
                <Textarea label="Your goals" placeholder="Describe your career goals..." rows={4} />
              </Card>
              <div className="flex justify-end">
                <PrimaryButton>Save Changes</PrimaryButton>
              </div>
            </section>
          )}

          {activeTab === 'skills' && (
            <section className="space-y-8">
              <Card title="Skills Overview">
                {skills.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skills.map(skill => (
                      <div key={skill.skillName || skill.name} className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-between">
                        <span className="text-gray-900 dark:text-white">{skill.skillName || skill.name}</span>
                        <Stars value={skill.selfRating || skill.rating || 0} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No skills assessed yet.</p>
                    <p className="text-sm mt-2">
                      <Link to="/assessment" className="text-primary-600 hover:underline">
                        Start assessing your skills
                      </Link>
                    </p>
                  </div>
                )}
              </Card>
              <Card title="Assessment History">
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <li>Aug 2025 — React assessment completed (score 92)</li>
                  <li>Jul 2025 — JS assessment completed (score 88)</li>
                  <li>Jun 2025 — UX heuristics workshop</li>
                </ul>
              </Card>
              <Card title="Peer Validation Summary">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Stat label="Peer Endorsements" value="32" />
                  <Stat label="Avg. Peer Rating" value="4.6/5" />
                  <Stat label="Certifications" value="3" />
                </div>
              </Card>
              <Card title="Skills Certification Uploads">
                <div className="space-y-3">
                  <FileInput label="Upload certification" />
                  <div className="text-xs text-gray-500">Accepted: PDF, PNG, JPG (max 5MB)</div>
                </div>
              </Card>
            </section>
          )}

          {activeTab === 'network' && (
            <section className="space-y-8">
              <Card title="Connected Colleagues">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center gap-3">
                      <img className="h-10 w-10 rounded-full" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="colleague" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Colleague {i}</div>
                        <div className="text-xs text-gray-500">Frontend Engineer</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card title="Pending Review Requests">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[{ who:'You → Dana', type:'Sent' }, { who:'Leo → You', type:'Received' }].map((r) => (
                    <div key={r.who} className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-900 dark:text-white">{r.who}</div>
                        <div className="text-xs text-gray-500">{r.type}</div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 text-xs rounded-lg border border-gray-300 dark:border-gray-700">View</button>
                        <button className="px-3 py-1 text-xs rounded-lg bg-primary-600 text-white">Action</button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card title="Review History & Ratings">
                <div className="text-sm text-gray-700 dark:text-gray-300">View your <Link className="text-primary-600 hover:underline" to="/peer/history">peer review history</Link>.</div>
              </Card>
              <Card title="Network Recommendations">
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>Connect with design systems guild</li>
                  <li>Ask Mia for a React performance review</li>
                </ul>
              </Card>
              <Card title="Collaboration Statistics">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Stat label="Projects" value="24" />
                  <Stat label="Teams" value="5" />
                  <Stat label="PRs Reviewed" value="310" />
                  <Stat label="Mentorships" value="8" />
                </div>
              </Card>
            </section>
          )}

          {activeTab === 'privacy' && (
            <section className="space-y-8">
              <Card title="Profile Visibility">
                <Toggle label="Public profile" />
                <Toggle label="Show email to connections" />
              </Card>
              <Card title="Notification Preferences">
                <Checkbox label="Email notifications" />
                <Checkbox label="In-app notifications" />
              </Card>
              <Card title="Data Sharing Permissions">
                <Checkbox label="Allow anonymized analytics" />
              </Card>
              <Card title="Account Security">
                <Toggle label="Two-factor authentication" />
              </Card>
              <div className="flex justify-end"><PrimaryButton>Save Preferences</PrimaryButton></div>
            </section>
          )}

          {activeTab === 'learning' && (
            <section className="space-y-8">
              <Card title="Learning Style Assessment">
                <RadioGroup name="style" options={[ 'Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing' ]} />
              </Card>
              <Card title="Preferred Formats">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Video','Articles','Interactive','Cohort','1:1 Coaching','Podcasts'].map(o => (
                    <Checkbox key={o} label={o} />
                  ))}
                </div>
              </Card>
              <Card title="Availability & Budget">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input label="Hours/week" type="number" placeholder="5" />
                  <Input label="Monthly budget ($)" type="number" placeholder="200" />
                  <Input label="Priority skills" placeholder="React, Systems Design" />
                </div>
              </Card>
              <div className="flex justify-end"><PrimaryButton>Save Preferences</PrimaryButton></div>
            </section>
          )}
        </div>

        {/* Account Settings Sidebar */}
        <aside className="lg:col-span-3 space-y-4">
          {/* Profile Sharing Card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Share Your Profile</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Show off your skills and professional growth to potential employers and colleagues.
            </p>
            <button
              onClick={() => setShowShareModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              Share Profile
            </button>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                onClick={shareToLinkedIn}
                className="flex items-center justify-center p-2 bg-[#0077B5] text-white rounded hover:bg-[#005885] transition-colors"
                title="Share on LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={shareToTwitter}
                className="flex items-center justify-center p-2 bg-[#1DA1F2] text-white rounded hover:bg-[#0d8bd9] transition-colors"
                title="Share on Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>
              <button
                onClick={copyProfileLink}
                className="flex items-center justify-center p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                title="Copy Link"
              >
                <span className="material-symbols-outlined text-[16px]">link</span>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Account Settings</h3>
            <div className="space-y-2 text-sm">
              <Link to="/reset-password" className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 block">
                Change password
              </Link>
              {[
                'Email preferences',
                'Data export / download',
                'Account deletion',
                'Help & support',
                'Terms & privacy policy'
              ].map(item => (
                <button key={item} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">{item}</button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Share Profile Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Share Your Profile</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Profile URL Display */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Public Profile URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={generateProfileUrl()}
                    readOnly
                    className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm"
                  />
                  <button
                    onClick={copyProfileLink}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      copySuccess 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {copySuccess ? (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">check</span>
                        Copied!
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">content_copy</span>
                        Copy
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Social Sharing Options */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Share on Social Media</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={shareToLinkedIn}
                    className="flex items-center gap-3 p-3 bg-[#0077B5] text-white rounded-lg hover:bg-[#005885] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                    </svg>
                    LinkedIn
                  </button>

                  <button
                    onClick={shareToTwitter}
                    className="flex items-center gap-3 p-3 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#0d8bd9] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                    Twitter
                  </button>
                </div>
              </div>

              {/* Email Sharing */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Other Options</h4>
                <button
                  onClick={shareViaEmail}
                  className="w-full flex items-center justify-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="material-symbols-outlined">email</span>
                  Share via Email
                </button>
              </div>

              {/* Privacy Notice */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px] mt-0.5">info</span>
                  <div>
                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">Privacy Notice</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Your public profile will show your skills, assessments, and peer reviews. You can control what's visible in Privacy Settings.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              <Link
                to="/profile/settings"
                className="flex-1 px-4 py-2 text-center bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Privacy Settings
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
      {title && <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>}
      {children}
    </div>
  )
}

function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</span>
      <input className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 focus:ring-primary-500 focus:border-primary-500" {...props} />
    </label>
  )
}

function Textarea({ label, rows = 3, ...props }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</span>
      <textarea rows={rows} className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 focus:ring-primary-500 focus:border-primary-500" {...props} />
    </label>
  )
}

function PrimaryButton({ children }) {
  return <button className="px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700">{children}</button>
}

function Stars({ value = 0 }) {
  return (
    <div className="flex text-primary-500">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`material-symbols-outlined ${i <= value ? '' : 'text-gray-300 dark:text-gray-600'}`}>grade</span>
      ))}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
      <div className="text-xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  )
}

function Checkbox({ label }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-primary-600 focus:ring-primary-500" />
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
    </label>
  )
}

function Toggle({ label }) {
  return (
    <div className="flex items-center justify-between border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <input type="checkbox" className="h-5 w-10 rounded-lg accent-primary-600" />
    </div>
  )
}

function RadioGroup({ name, options }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {options.map(opt => (
        <label key={opt} className="cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700 p-2 text-sm has-[:checked]:bg-primary/10 has-[:checked]:border-primary has-[:checked]:text-primary dark:has-[:checked]:bg-primary/20">
          {opt}
          <input type="radio" name={name} className="sr-only" />
        </label>
      ))}
    </div>
  )
}

function FileInput({ label }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</span>
      <input type="file" className="block w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-600 file:px-4 file:py-2 file:text-white hover:file:bg-primary-700" />
    </label>
  )
}


