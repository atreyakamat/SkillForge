import Layout from '../components/layout/Layout.jsx'
import QuickStats from '../components/dashboard/QuickStats.jsx'
import SkillOverview from '../components/dashboard/SkillOverview.jsx'
import ActivityFeed from '../components/dashboard/ActivityFeed.jsx'
import PeerReview from '../components/peer/PeerReview.jsx'
import ReviewRequest from '../components/peer/ReviewRequest.jsx'
import ReviewHistory from '../components/peer/ReviewHistory.jsx'
import PeerMatch from '../components/peer/PeerMatch.jsx'
import GapAnalysis from '../components/analytics/GapAnalysis.jsx'
import JobMatches from '../components/analytics/JobMatches.jsx'
import Recommendations from '../components/analytics/Recommendations.jsx'
import IndustryComparison from '../components/analytics/IndustryComparison.jsx'
import SearchHeader from '../components/dashboard/SearchHeader.jsx'
import KpiRing from '../components/dashboard/KpiRing.jsx'
import SkillTable from '../components/dashboard/SkillTable.jsx'
import { useSkillContext } from '../contexts/SkillContext.jsx'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { skills = [] } = useSkillContext()

  const sampleSkills = skills.length ? skills : [
    { id: '1', name: 'JavaScript', category: 'Frontend', self: 4.5, peer: 4 },
    { id: '2', name: 'React', category: 'Frontend', self: 4, peer: 3.5 },
    { id: '3', name: 'Node.js', category: 'Backend', self: 3, peer: 2.5 },
    { id: '4', name: 'UX Design', category: 'Design', self: 2, peer: 1.5 },
  ]

  return (
    <Layout>
      <div className="space-y-6">
          <SearchHeader />
          <QuickStats />
          <div className="flex flex-wrap gap-3">
            <Link to="/assessment" className="bg-primary-600 text-white rounded-lg px-4 py-2 hover:bg-primary-700">Assess Skills</Link>
            <button className="bg-secondary-600 text-white rounded-lg px-4 py-2 hover:bg-secondary-700">Request Peer Review</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800/60 p-6 rounded-xl shadow-sm">
              <p className="text-gray-500 dark:text-gray-400">Total Skills</p>
              <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">50</p>
            </div>
            <div className="bg-white dark:bg-gray-800/60 p-6 rounded-xl shadow-sm">
              <p className="text-gray-500 dark:text-gray-400">Peer Reviews Received</p>
              <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">12</p>
            </div>
            <KpiRing percent={85} label="Skill Match Score" />
            <div className="bg-white dark:bg-gray-800/60 p-6 rounded-xl shadow-sm">
              <p className="text-gray-500 dark:text-gray-400">Learning Progress</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-4">
                <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-right text-gray-500 dark:text-gray-400 mt-2">60%</p>
            </div>
          </div>
          <SkillOverview skills={sampleSkills} />
          <ActivityFeed />
          <SkillTable />
          <GapAnalysis />
          <JobMatches />
          <Recommendations />
          <IndustryComparison />
          <PeerMatch />
          <ReviewRequest />
          <PeerReview />
          <ReviewHistory />
      </div>
    </Layout>
  )
}

