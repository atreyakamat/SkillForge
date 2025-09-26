import SelfAssessment from '../components/assessment/SelfAssessment.jsx'
import AssessmentHistory from '../components/assessment/AssessmentHistory.jsx'

export default function Assessment() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Skill Assessment</h1>
      <SelfAssessment />
      <AssessmentHistory />
    </div>
  )
}

