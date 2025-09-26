import React from 'react'

export default function PeerReviewRequest() {
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Request Peer Review</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Colleague Selection</h2>
              <div className="relative mb-4">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">search</span>
                <input type="text" placeholder="Search colleagues by name or email" className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-primary-500 focus:border-primary-500" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-primary-50/50 dark:hover:bg-primary-900/20">
                  <div className="flex items-center gap-4">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2y0fpAf5NDgk7z_7SoBAAKEyvRBVoKkgYyvAaLUKVjo2tCjt7GG3AQe4VByC-6Mq5DmXCSYRPlw3el-gUgMlhYzxcKJ_RwnR_kc3D5mC34yO9464qCxHczrlQygw0Y3phw4hdTQtBiAjLa7X9zQUSX0Ik2zJz8ifCZMtDEJKhzADtV1qHDKAooL0yaOqVJJwu8vdEelhM9yeT8kDX0KxVhH38c7hWT1uZqjMcgmhUvnG8ylEhgQIyG-hi-NARf7bhdfGlx0RKa8Q" alt="Ethan Carter" className="size-12 rounded-full" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Ethan Carter</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Software Engineer</p>
                    </div>
                  </div>
                  <input type="checkbox" className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-primary-50/50 dark:hover:bg-primary-900/20">
                  <div className="flex items-center gap-4">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdJoJjpeFT4-hg9_uEZDMRZtOqdsg8Y1rikl45yBJxiHg5lPZcyEqLOs7EfoLOVkqjBGMbbd2f7DUqmPvqQ-QVal4ZdKoVgQGcWJTwZvtXPBglUbKzWZ4_UI5GvSah3gHUJXZMMMMHrbIFj0SWW5UPXBrcaBVl9gbnyOxcc12gqXwHWomoyKACLyLEWggsqdLFz1AkXxjs-jjxwdvEfT-vHBd2UhJ5sPKSq7r9f8lojY1_qEf9lKeGQfcMMhQ6uSCmoRgzruTTjZY" alt="Olivia Bennett" className="size-12 rounded-full" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Olivia Bennett</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Product Manager</p>
                    </div>
                    <span className="text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200 px-2 py-1 rounded-full">Collaborated</span>
                  </div>
                  <input type="checkbox" className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-primary-50/50 dark:hover:bg-primary-900/20">
                  <div className="flex items-center gap-4">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp-4rK56wZmIdy8NejHSPLwryYQvknDyYKF65qqFvHdi-rYr2MIV68RezGAGbpwwU9vIwlwuzfVeltgcIMsAm64GUW24vIdH7ZRsoNkdRBYVj0M9qRpiNr8G0R_q4inoJkeAMOQJbC4YleWxqEml7peRr6I4yyRAbDmQVRx6NmkHgvvbPIlcoRrj8swN3Daz5NN-4wqH6HsAQsA9Por7T7VXKYNY4bEtzYgmYHdcTPhjC5xtwEe75bkxfcZi21khoSJvFR3nD1CNc" alt="Liam Harper" className="size-12 rounded-full" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Liam Harper</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Data Scientist</p>
                    </div>
                  </div>
                  <input type="checkbox" className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">add</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Invite by email</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Invite external contact</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-bold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-200 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50">Invite</button>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Skill Selection</h2>
              <div className="space-y-4">
                <div>
                  <details className="group" open>
                    <summary className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-primary-50/50 dark:hover:bg-primary-900/20">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined transform transition-transform group-open:rotate-180">expand_more</span>
                        <p className="font-medium text-gray-900 dark:text-white">Technical Skills</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-500 dark:text-gray-400" htmlFor="tech-all">Select all</label>
                        <input id="tech-all" type="checkbox" className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500" />
                      </div>
                    </summary>
                    <div className="pl-9 mt-2 space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-green-500">check_circle</span>
                          <div>
                            <p className="text-gray-900 dark:text-white">Python Programming</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Already reviewed</p>
                          </div>
                        </div>
                        <input type="checkbox" className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500" />
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-gray-300 dark:text-gray-600">radio_button_unchecked</span>
                          <p className="text-gray-900 dark:text-white">Data Analysis</p>
                        </div>
                        <input type="checkbox" className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500" />
                      </div>
                    </div>
                  </details>
                </div>

                <div>
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-primary-50/50 dark:hover:bg-primary-900/20">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined transform transition-transform group-open:rotate-180">expand_more</span>
                        <p className="font-medium text-gray-900 dark:text-white">Communication Skills</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-500 dark:text-gray-400" htmlFor="comm-all">Select all</label>
                        <input id="comm-all" type="checkbox" className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500" />
                      </div>
                    </summary>
                    <div className="pl-9 mt-2 space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-gray-300 dark:text-gray-600">radio_button_unchecked</span>
                          <p className="text-gray-900 dark:text-white">Presentation Skills</p>
                        </div>
                        <input type="checkbox" className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500" />
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Review Request Customization</h2>
              <div className="space-y-4">
                <textarea rows={4} placeholder="Add a personal message to your reviewers..." className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-primary-500 focus:border-primary-500" />
                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
                  <select id="deadline" className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-primary-500 focus:border-primary-500">
                    <option>1 week</option>
                    <option>2 weeks</option>
                    <option>1 month</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <label htmlFor="anonymous" className="font-medium text-gray-900 dark:text-white">Anonymous Review</label>
                  <input id="anonymous" type="checkbox" className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500" />
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1 space-y-6 sticky top-8 h-fit">
            <div className="p-6 rounded-xl bg-gray-100 dark:bg-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Selected Reviewers</h3>
              <div className="flex -space-x-2 overflow-hidden mb-4">
                <img alt="Reviewer 1" className="inline-block size-10 rounded-full ring-2 ring-white dark:ring-gray-900" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMV1IVaWWBO_eQD7tBWMMcAFnjNBcncQm6ABkYcz7wpu0_PfHM6cHYVWVNez8IqYPHGRH9UN0yI-1fVVZGCijtydrKHqs68uzTG7aIWiQ0NFrqZcpTncupQFt0q4gPx7f2h5ZebiY2-Ary_ULXPxSynhp-14ICdKjmtBWEVvKmDrs49jjbfs_YZm4hHfDCp4-eakSvvcneX3STu1P4AdoviapHm9n1fbMwEpIRsisZjTOvbomZ3aebIXXVFiCRjv4EXdmkaSN7CJw" />
                <img alt="Reviewer 2" className="inline-block size-10 rounded-full ring-2 ring-white dark:ring-gray-900" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2mk4xQ3JnXQvke73hpI6fHojgwO_7gqJ2u2NiULiHigoVgmNgyqVj-rZpCFX42ImRh-ns3OytyXKP26CjzxWTjVlp2nTpEo5w_mLaTGaP2ykBGG5y5owYkFqEXYBq6CpuA_oi-HsgU0LGRtzeqffv_QXerOLETz375X1VTaQvFBxSHRKcyfeUVGYkvvAJ59zxBw8Nr_8a2sW9UtkbeC4L1XaUvtD987k_6qkxGKy9h0cugI4_qPF-zVCPTUoKvSRT2Nd6E4LGlBw" />
                <img alt="Reviewer 3" className="inline-block size-10 rounded-full ring-2 ring-white dark:ring-gray-900" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeE5fkRoTEMEGiFIL9lLM8k2fatJsjA7vDQwH3HtjbAyhJu33nuGuoEL2mEh9vDeqEiEpCHq2OPK2Cfzl-Xyd45gpWKqBqWenFYuZmu_09lpNjWP5Cm08QWA8m83MQin6myaCuLfd6SoHmGwXfcksEFMO1FwEyjJzBQaBSOH0tLqMftK5GD4vSWbjFGQQc8w8wUSe9nVN2WtvQGUUlAHobKz6GxvMpH7QdIrJmCXN35I6OtRSrhRAbJhKraFsrdBQ4-sgvKi3PBtQ" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Review Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Skills to be reviewed:</span>
                  <span className="font-medium text-gray-900 dark:text-white">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Reviewers selected:</span>
                  <span className="font-medium text-gray-900 dark:text-white">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Estimated completion:</span>
                  <span className="font-medium text-gray-900 dark:text-white">7 days</span>
                </div>
              </div>
            </div>
            <button className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors">Send Requests</button>
          </aside>
        </div>
      </div>
    </div>
  )
}


