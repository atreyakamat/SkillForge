export default function KpiRing({ percent = 85, label = 'Skill Match Score' }) {
  const dash = `${percent}, 100`
  return (
    <div className="bg-white dark:bg-gray-800/60 p-6 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path className="text-gray-200 dark:text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
          <path className="text-primary-600" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3" strokeDasharray={dash} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-900 dark:text-white">{percent}%</span>
        </div>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mt-2">{label}</p>
    </div>
  )
}


