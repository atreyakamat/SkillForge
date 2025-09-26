export default function MySkills() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Skills</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">A comprehensive view of your skills and proficiency levels.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-10 items-center justify-center gap-2 rounded-lg border border-primary-600 bg-primary-50 px-4 text-sm font-bold text-primary-700 dark:bg-primary-950/30 dark:text-primary-300">
            <span className="material-symbols-outlined">search</span>
            <span>New Category</span>
          </button>
          <button className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 text-sm font-bold text-white hover:bg-primary-700">
            <span className="material-symbols-outlined">add</span>
            <span>Add New Skill</span>
          </button>
        </div>
      </div>

      {/* Programming Languages */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800 bg-white dark:bg-gray-800/60">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Programming Languages</h2>
          <button className="flex h-8 items-center justify-center gap-1 rounded-md bg-gray-100 px-3 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            <span className="material-symbols-outlined">expand_more</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Skill</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Proficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-gray-50 dark:divide-gray-800 dark:bg-gray-900/30">
              {[{ name: 'Python', pct: 85, status: 'Strong', color: 'green' }, { name: 'JavaScript', pct: 70, status: 'Strong', color: 'green' }].map(r => (
                <tr key={r.name}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{r.name}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"><div className="h-2 rounded-full bg-primary-600" style={{ width: `${r.pct}%` }}></div></div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{r.pct}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${r.color==='green'?'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300':'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>{r.status}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <a className="text-primary-600 hover:underline" href="#">Edit</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Soft Skills */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800 bg-white dark:bg-gray-800/60">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Soft Skills</h2>
          <button className="flex h-8 items-center justify-center gap-1 rounded-md bg-gray-100 px-3 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            <span className="material-symbols-outlined">expand_more</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Skill</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Proficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-gray-50 dark:divide-gray-800 dark:bg-gray-900/30">
              {[{ name: 'Communication', pct: 90, status: 'Strong', color: 'green' }, { name: 'Teamwork', pct: 80, status: 'Strong', color: 'green' }].map(r => (
                <tr key={r.name}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{r.name}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"><div className="h-2 rounded-full bg-primary-600" style={{ width: `${r.pct}%` }}></div></div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{r.pct}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${r.color==='green'?'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300':'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>{r.status}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <a className="text-primary-600 hover:underline" href="#">Edit</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tools */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800 bg-white dark:bg-gray-800/60">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tools</h2>
          <button className="flex h-8 items-center justify-center gap-1 rounded-md bg-gray-100 px-3 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            <span className="material-symbols-outlined">expand_more</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Skill</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Proficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-gray-50 dark:divide-gray-800 dark:bg-gray-900/30">
              {[{ name: 'Figma', pct: 75, status: 'Developing', color: 'yellow' }].map(r => (
                <tr key={r.name}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{r.name}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"><div className="h-2 rounded-full bg-primary-600" style={{ width: `${r.pct}%` }}></div></div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{r.pct}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${r.color==='green'?'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300':'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>{r.status}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <a className="text-primary-600 hover:underline" href="#">Edit</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


