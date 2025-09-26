import React from 'react'

export default function PeerReviewHistory() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen">
      <div className="flex min-h-screen w-full">
        <aside className="w-64 flex-col bg-background-light dark:bg-background-dark p-4 hidden md:flex border-r border-gray-200 dark:border-gray-800">
          <div className="flex flex-col gap-4">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Acme Co</h1>
            <nav className="flex flex-col gap-2">
              <a href="#" className="flex items-center gap-3 rounded px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                <span className="material-symbols-outlined">home</span>
                <span className="text-sm font-medium">Home</span>
              </a>
              <a href="#" className="flex items-center gap-3 rounded px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                <span className="material-symbols-outlined">work</span>
                <span className="text-sm font-medium">My Skills</span>
              </a>
              <a href="#" className="flex items-center gap-3 rounded px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                <span className="material-symbols-outlined">search</span>
                <span className="text-sm font-medium">Skill Gap Analyzer</span>
              </a>
              <a href="#" className="flex items-center gap-3 rounded-lg bg-primary/10 dark:bg-primary/20 px-3 py-2 text-primary">
                <span className="material-symbols-outlined">group</span>
                <span className="text-sm font-medium">Peer Review</span>
              </a>
              <a href="#" className="flex items-center gap-3 rounded px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                <span className="material-symbols-outlined">book_2</span>
                <span className="text-sm font-medium">Resources</span>
              </a>
            </nav>
          </div>
        </aside>

        <main className="flex-1">
          <div className="px-4 py-6 md:px-8 md:py-10">
            <header className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Peer Review History</h1>
            </header>

            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <a href="#" className="whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300">Given Reviews</a>
                <a href="#" aria-current="page" className="whitespace-nowrap border-b-2 border-primary px-1 py-4 text-sm font-medium text-primary">Received Reviews</a>
              </nav>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Reviews of your skills</h2>
              <div className="space-y-8">
                {[1,2].map((card) => (
                  <div key={card} className="rounded-lg border border-gray-200 dark:border-gray-800 bg-background-light dark:bg-background-dark shadow-sm">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{card === 1 ? 'Feedback on Communication Skills' : 'Feedback on Problem-Solving Skills'}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Reviewer: {card === 1 ? 'Anonymous' : 'Alex Chen'}</p>
                          <div className="mt-4 flex flex-col md:flex-row gap-6 md:gap-8">
                            <div className="flex flex-col items-center">
                              <p className="text-5xl font-bold text-gray-900 dark:text-white">{card === 1 ? '4.5' : '3.8'}</p>
                              <div className="flex text-primary mt-1">
                                <span className="material-symbols-outlined">grade</span>
                                <span className="material-symbols-outlined">grade</span>
                                <span className="material-symbols-outlined">grade</span>
                                <span className="material-symbols-outlined">grade</span>
                                <span className="material-symbols-outlined text-gray-300 dark:text-gray-600">grade</span>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{card === 1 ? '2 reviews' : '1 review'}</p>
                            </div>
                            <div className="flex-1 space-y-2">
                              {[5,4,3,2,1].map((star, i) => (
                                <div key={star} className="grid grid-cols-[20px_1fr_40px] items-center gap-x-3">
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{star}</p>
                                  <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div className="h-2 rounded-full bg-primary" style={{ width: card === 1 ? ([50,30,10,5,5][i] + '%') : ([20,30,25,15,10][i] + '%') }} />
                                  </div>
                                  <p className="text-right text-sm text-gray-500 dark:text-gray-400">{card === 1 ? [50,30,10,5,5][i] : [20,30,25,15,10][i]}%</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 px-6 pb-6">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-semibold text-gray-900 dark:text-white">Reviewer's Comments:</span>
                        {card === 1
                          ? ' "Sarah is an excellent communicator, always clear and concise in her explanations. She actively listens to others and responds thoughtfully. Her presentations are engaging and well-structured, making complex topics easy to understand."'
                          : ' "Alex is a good problem-solver, but sometimes struggles with breaking down complex issues into smaller, manageable parts. He could benefit from practicing more structured approaches to problem-solving."'}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end">
                      <button className="rounded-lg bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 px-4 py-2 text-sm font-semibold text-primary transition-colors">Thank Reviewer</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


