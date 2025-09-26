import React from 'react'

export default function PeerReviewCompletion() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen">
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4 text-gray-900 dark:text-white">
              <span className="material-symbols-outlined text-primary text-3xl">assessment</span>
              <h2 className="text-lg font-bold">SkillForge</h2>
            </div>
            <nav className="hidden md:flex flex-1 justify-center gap-8">
              <a href="#" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">Home</a>
              <a href="#" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">My Skills</a>
              <a href="#" className="text-sm font-medium text-primary dark:text-primary">Reviews</a>
              <a href="#" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">Team</a>
            </nav>
            <div className="flex items-center gap-4">
              <button className="flex items-center justify-center rounded-full h-10 w-10 bg-gray-200/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <div className="h-10 w-10 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBx8uneHFpktFvsUTgU0vKEWciKBp_T_0GLbfXpeSmS9NbtgoFctHv2QibMa7tygEF8Xbr0agzKgu8bP_RFEdk51CiEUzlFUyDlpVGsLHv-hJfk7bNBjzZvGG-g9ss6VVM6pIFZ2wlpHHtMGEe5fYZktjn33TxMbwclecXrP8F2qTRfqWJgTWvlUVIr4oeSrulRcN2hNbX5fukrT63vWIDHuExqp0LzYR4JbAJM99ikA1lmDDVZHMEZRxKInbnb0Wu2ZHHja9V8_68")' }} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="mx-auto max-w-4xl py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Review Alex's Skills</h1>
          </div>

          <div className="space-y-12">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700/60 bg-white/50 dark:bg-gray-800/20 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Review Instructions</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Provide fair and constructive feedback. Rate each skill on a scale of 1-10, considering Alex's self-rating as a reference. Your feedback is confidential and will only be shared with Alex.
              </p>
            </div>

            <div className="space-y-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Skill Review Interface</h2>

              {[{ title: 'Verbal Communication', category: 'Communication', self: 7, id: 1, value: 8 }, { title: 'Team Collaboration', category: 'Leadership', self: 9, id: 2, value: 7 }, { title: 'Coding Proficiency', category: 'Technical', self: 6, id: 3, value: 6 }].map((s) => (
                <div key={s.id} className="rounded-xl border border-gray-200 dark:border-gray-700/60 bg-white/50 dark:bg-gray-800/20">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{s.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{s.category}</p>
                      </div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700/50 rounded-full px-3 py-1">Self-rating: <span className="font-bold">{s.self}</span></div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor={`rating-${s.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your rating (1-10)</label>
                        <div className="flex items-center gap-4">
                          <input id={`rating-${s.id}`} name={`rating-${s.id}`} type="range" min="1" max="10" defaultValue={s.value} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:bg-primary" />
                          <span className="font-bold text-gray-900 dark:text-white w-4 text-center">{s.value}</span>
                        </div>
                      </div>
                      <div>
                        <label htmlFor={`comment-${s.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Provide specific feedback</label>
                        <textarea id={`comment-${s.id}`} name={`comment-${s.id}`} rows={3} placeholder="Provide specific feedback" className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confidence in your assessment</label>
                        <div className="flex gap-2">
                          <label className="flex-1 text-center cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 p-2 text-sm font-medium text-gray-700 dark:text-gray-300 has-[:checked]:bg-primary/10 has-[:checked]:border-primary has-[:checked]:text-primary dark:has-[:checked]:bg-primary/20">
                            Low <input className="sr-only" name={`confidence-${s.id}`} type="radio" value="low" />
                          </label>
                          <label className="flex-1 text-center cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 p-2 text-sm font-medium text-gray-700 dark:text-gray-300 has-[:checked]:bg-primary/10 has-[:checked]:border-primary has-[:checked]:text-primary dark:has-[:checked]:bg-primary/20">
                            Medium <input defaultChecked className="sr-only" name={`confidence-${s.id}`} type="radio" value="medium" />
                          </label>
                          <label className="flex-1 text-center cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 p-2 text-sm font-medium text-gray-700 dark:text-gray-300 has-[:checked]:bg-primary/10 has-[:checked]:border-primary has-[:checked]:text-primary dark:has-[:checked]:bg-primary/20">
                            High <input className="sr-only" name={`confidence-${s.id}`} type="radio" value="high" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700/60 bg-white/50 dark:bg-gray-800/20 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Review Progress</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300">
                    <span>Skills Completed: 2 of 3</span>
                    <span>66%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '66%' }} />
                  </div>
                </div>
                <div className="mt-6">
                  <button className="w-full sm:w-auto rounded-lg px-4 py-2 text-sm font-semibold bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600">Save Progress</button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700/60 bg-white/50 dark:bg-gray-800/20 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Submission Options</h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark text-primary focus:ring-primary/50" />
                    <span className="text-gray-700 dark:text-gray-300">Make review anonymous</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark text-primary focus:ring-primary/50" />
                    <span className="text-gray-700 dark:text-gray-300">Send encouraging message</span>
                  </label>
                  <div>
                    <textarea id="encouraging-message" name="encouraging-message" rows={3} placeholder="Optional: Add a personal note" className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">How confident are you in the quality of your review?</label>
                    <div className="flex gap-2">
                      <label className="flex-1 text-center cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 p-2 text-sm font-medium text-gray-700 dark:text-gray-300 has-[:checked]:bg-primary/10 has-[:checked]:border-primary has-[:checked]:text-primary dark:has-[:checked]:bg-primary/20">
                        Low <input className="sr-only" name="quality-confidence" type="radio" value="low" />
                      </label>
                      <label className="flex-1 text-center cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 p-2 text-sm font-medium text-gray-700 dark:text-gray-300 has-[:checked]:bg-primary/10 has-[:checked]:border-primary has-[:checked]:text-primary dark:has-[:checked]:bg-primary/20">
                        Medium <input className="sr-only" name="quality-confidence" type="radio" value="medium" />
                      </label>
                      <label className="flex-1 text-center cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 p-2 text-sm font-medium text-gray-700 dark:text-gray-300 has-[:checked]:bg-primary/10 has-[:checked]:border-primary has-[:checked]:text-primary dark:has-[:checked]:bg-primary/20">
                        High <input className="sr-only" name="quality-confidence" type="radio" value="high" />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="w-full rounded-lg bg-primary-600 px-5 py-3 text-base font-bold text-white shadow-sm hover:bg-primary-700">Submit Review</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


