import React, { useState } from 'react'

const tabs = [
  { id: 'personal', label: 'Personal Information' },
  { id: 'skills', label: 'Skills Portfolio' },
  { id: 'network', label: 'Peer Network' },
  { id: 'privacy', label: 'Privacy & Notifications' },
  { id: 'learning', label: 'Learning Preferences' }
]

export default function Profile() {
  const [activeTab, setActiveTab] = useState('personal')

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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alex Johnson</h1>
              <span className="text-gray-600 dark:text-gray-300">Senior Frontend Engineer</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-300">
              <span className="inline-flex items-center gap-1"><span className="material-symbols-outlined text-base">location_on</span> San Francisco, CA</span>
              <span className="inline-flex items-center gap-1"><span className="material-symbols-outlined text-base">schedule</span> 7+ years experience</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200">Edit Profile</button>
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
                  <Input label="Full name" placeholder="Alex Johnson" />
                  <Input label="Email" type="email" placeholder="alex@example.com" />
                  <Input label="Phone" placeholder="(555) 123-4567" />
                </div>
              </Card>
              <Card title="Professional Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Role" placeholder="Senior Frontend Engineer" />
                  <Input label="Company" placeholder="Acme Corp" />
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'JavaScript', rating: 5 },
                    { name: 'React', rating: 5 },
                    { name: 'TypeScript', rating: 4 },
                    { name: 'Node.js', rating: 4 },
                    { name: 'UI/UX', rating: 3 },
                  ].map(s => (
                    <div key={s.name} className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-between">
                      <span className="text-gray-900 dark:text-white">{s.name}</span>
                      <Stars value={s.rating} />
                    </div>
                  ))}
                </div>
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
                <div className="text-sm text-gray-700 dark:text-gray-300">View your <a className="text-primary-600 hover:underline" href="/peer/history">peer review history</a>.</div>
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
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Account Settings</h3>
            <div className="space-y-2 text-sm">
              {[
                'Change password',
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


