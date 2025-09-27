import { Link } from 'react-router-dom'
import GapAnalysis from '../components/analytics/GapAnalysis.jsx'
import JobMatches from '../components/analytics/JobMatches.jsx'
import Recommendations from '../components/analytics/Recommendations.jsx'
import IndustryComparison from '../components/analytics/IndustryComparison.jsx'

export default function GapAndJobs() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 -mx-4 px-4 sm:px-6 lg:px-8 py-6 rounded">
      {/* Header */}
      <header className="sticky top-14 z-10 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-700 -mx-4 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold">
              <span className="material-symbols-outlined text-primary-600 text-3xl">analytics</span>
              SkillMapper
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400" to="/dashboard">Dashboard</Link>
              <Link className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400" to="/assessment">Assessment</Link>
              <Link className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400" to="/skills">My Skills</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">search</span>
              <input className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-600 focus:border-transparent transition w-40 sm:w-64" placeholder="Search..." type="text" />
            </div>
            <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCRkHSbTElTukh7IHSfyukVlHW0Cu1xX9518uqsa5QIygu5_2RA065X7yLZYKZhq0eVgIrkQIT19OHofwYRRh_buM5ExIAv2Cdb0d-RhhA-SsU3v-kw6CJGbY9I4YPy3Xse3M29G3DxZxweFtwvy2noa53FSx7_dqDBd4ILeobthB0tGSLsnZ7OwzzmEiJMWCQNEHOc6i_683hbyblXBsHVfSDPKUkrdtNfi4-yvvUw0Kn4Zdle3SJuItQ8u25BitLSHn_2wmc_fuE')" }} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 space-y-10">
        {/* Title + actions */}
        <section className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Skill Gap Analysis</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Analyze your current skills against career goals and market demands.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"><span className="material-symbols-outlined">date_range</span></button>
            <button className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"><span className="material-symbols-outlined">refresh</span></button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700">
              <span className="material-symbols-outlined">download</span>
              Export Report
            </button>
          </div>
        </section>

        {/* Overview KPIs */}
        <section>
          <h2 className="text-xl font-bold mb-4">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{label:'Overall Skill Score', value:'78/100'}, {label:'Priority Gaps', value:'3'}, {label:'Market Alignment', value:'85%'}, {label:'Learning Time Estimate', value:'45 hours'}].map((k)=> (
              <div key={k.label} className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{k.label}</p>
                <p className="text-3xl font-bold mt-1">{k.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Visualization (radar + legend) */}
        <section>
          <h2 className="text-xl font-bold mb-4">Skill Gap Visualization</h2>
          <GapAnalysis />
        </section>

        {/* Detailed table substitute with IndustryComparison + Recommendations */}
        <section>
          <h2 className="text-xl font-bold mb-4">Detailed Gap Analysis</h2>
          <IndustryComparison />
        </section>

        {/* Jobs */}
        <section>
          <h2 className="text-xl font-bold mb-4">Jobs Matching Your Skills</h2>
          <JobMatches />
        </section>

        {/* Learning Path */}
        <section>
          <h2 className="text-xl font-bold mb-4">Recommended Learning Path</h2>
          <Recommendations />
        </section>

      </main>
    </div>
  )
}


