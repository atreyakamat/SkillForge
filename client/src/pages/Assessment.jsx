import React from 'react'
import SelfAssessment from '../components/assessment/SelfAssessment.jsx'
import AssessmentHistory from '../components/assessment/AssessmentHistory.jsx'

export default function Assessment() {
  return (
    <div className="font-sans bg-gray-50 dark:bg-gray-900 text-black dark:text-white -mx-4 px-4 sm:px-6 lg:px-8 py-6 rounded">
      {/* Header */}
      <header className="sticky top-14 z-10 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur border-b border-primary-600/20 dark:border-primary-600/30 -mx-4 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-600 text-3xl">analytics</span>
            <h1 className="text-xl font-bold">SkillForge Assessment</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="hidden sm:block px-4 py-2 text-sm font-medium rounded-lg text-black dark:text-white bg-primary-600/10 dark:bg-primary-600/20 hover:bg-primary-600/20 transition">
              Save as Draft
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:bg-primary-600/50 disabled:cursor-not-allowed">
              Submit for Review
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-6 space-y-8">
        {/* Title and progress */}
        <section className="space-y-2">
          <h2 className="text-3xl font-bold">Skill Assessment</h2>
          <p className="text-primary-700 dark:text-primary-400/80">Step 3 of 5</p>
          <div className="mt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-medium text-primary-700">60%</span>
            </div>
            <div className="w-full bg-primary-600/15 dark:bg-primary-600/25 rounded-full h-2.5">
              <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '60%' }} />
            </div>
          </div>
        </section>

        {/* Self assessment */}
        <section className="space-y-6">
          <SelfAssessment />
        </section>

        {/* Suggestions */}
        <section>
          <h3 className="text-2xl font-bold mb-4">Skill Suggestions</h3>
          <div className="relative mb-4">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-black/50 dark:text-white/50">search</span>
            <input type="text" placeholder="Search for skills to add" className="w-full pl-10 pr-4 py-3 rounded-lg bg-primary-600/10 dark:bg-primary-600/20 border-2 border-transparent focus:border-primary-600 focus:ring-0 placeholder:text-black/50 dark:placeholder:text-white/50" />
          </div>
          <div className="space-y-3">
            {[
              { title: 'Cloud Computing', note: 'Recommended for your role' },
              { title: 'Cybersecurity', note: 'Recommended for your role' }
            ].map((s) => (
              <div key={s.title} className="flex items-center justify-between p-4 rounded-lg bg-primary-600/10 dark:bg-primary-600/20">
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="text-sm text-black/60 dark:text-white/60">{s.note}</p>
                </div>
                <button className="px-4 py-1.5 text-sm font-medium text-primary-700 bg-primary-600/15 dark:text-primary-300 dark:bg-primary-900/30 rounded-full hover:bg-primary-600/25 dark:hover:bg-primary-900/40">Add</button>
              </div>
            ))}
          </div>
        </section>

        {/* Peer review CTA */}
        <section className="bg-primary-600/10 dark:bg-primary-600/20 p-6 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Peer Review</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="h-5 w-5 rounded-md border-primary-600/40 text-primary-600 bg-gray-50 dark:bg-gray-900 focus:ring-primary-600/40" />
              <span>Request peer validation for these skills</span>
            </label>
            <select className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-primary-600/30 focus:ring-primary-600 focus:border-primary-600">
              <option>Select a colleague to review...</option>
              <option>Alice Johnson</option>
              <option>Bob Williams</option>
            </select>
            <textarea rows={3} placeholder="Add an optional message..." className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-primary-600/30 focus:ring-primary-600 focus:border-primary-600" />
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
              <button className="px-5 py-2.5 text-sm font-medium text-primary-700 bg-primary-600/15 dark:text-primary-300 dark:bg-primary-900/30 rounded-lg hover:bg-primary-600/25 dark:hover:bg-primary-900/40">Skip & Complete</button>
              <button className="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">Submit for Peer Review</button>
            </div>
          </div>
        </section>

        {/* History */}
        <section>
          <AssessmentHistory />
        </section>
      </main>
    </div>
  )
}

