export default function SkillTable({ rows = [] }) {
  if (rows.length === 0) {
    rows = [
      { name: 'Project Management', level: 'Strong', color: 'green' },
      { name: 'Agile Methodologies', level: 'Developing', color: 'yellow' },
      { name: 'Data Analysis', level: 'Needs Work', color: 'red' },
      { name: 'Communication', level: 'Strong', color: 'green' },
      { name: 'Leadership', level: 'Developing', color: 'yellow' },
      { name: 'Problem Solving', level: 'Strong', color: 'green' },
    ]
  }
  const colorClass = (c) => c==='green' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : c==='yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
  return (
    <div className="bg-white dark:bg-gray-800/60 p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Skill Overview</h3>
        <a className="text-primary-600 font-semibold text-sm hover:underline" href="#">View all skills</a>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="py-3 px-4 font-semibold text-gray-500 dark:text-gray-400">Skill</th>
            <th className="py-3 px-4 font-semibold text-gray-500 dark:text-gray-400 text-center">Proficiency</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-t border-gray-200 dark:border-gray-700">
              <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">{r.name}</td>
              <td className="py-3 px-4 text-center">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${colorClass(r.color)}`}>{r.level}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


