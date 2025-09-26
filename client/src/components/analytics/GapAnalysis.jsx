import SkillChart from './SkillChart.jsx'

function HeatCell({ value = 0 }) {
  const c = value >= 70 ? 'bg-green-500' : value >= 40 ? 'bg-yellow-400' : 'bg-red-500'
  return <div className={`h-6 w-6 ${c} rounded-sm`} title={`${value}%`} />
}

export default function GapAnalysis() {
  const radarData = {
    labels: ['JS','React','Node','UX','Data'],
    datasets: [
      { label: 'You', data: [70,60,50,30,40], backgroundColor: 'rgba(59,130,246,0.2)', borderColor: '#3b82f6' },
      { label: 'Job', data: [80,70,60,40,50], backgroundColor: 'rgba(16,185,129,0.2)', borderColor: '#10b981' },
    ]
  }

  const heat = [
    { skill: 'JS', gap: 10 },
    { skill: 'React', gap: 10 },
    { skill: 'Node', gap: 10 },
    { skill: 'UX', gap: 10 },
    { skill: 'Data', gap: 10 }
  ]

  const topPriority = ['React', 'Node']
  const recos = [
    { title: 'React Performance', provider: 'Coursera' },
    { title: 'Node API Design', provider: 'Udemy' }
  ]

  return (
    <div className="space-y-4">
      <SkillChart type="radar" data={radarData} options={{ plugins: { legend: { position: 'bottom' } } }} />
      <div className="bg-white border rounded-xl p-4">
        <div className="font-semibold mb-2">Skill Development Heatmap</div>
        <div className="grid grid-cols-10 gap-2">
          {heat.map((h)=> <HeatCell key={h.skill} value={100 - h.gap} />)}
        </div>
      </div>
      <div className="bg-white border rounded-xl p-4">
        <div className="font-semibold mb-2">Priority Skills</div>
        <ul className="list-disc pl-5 text-sm text-gray-700">
          {topPriority.map(p => <li key={p}>{p}</li>)}
        </ul>
      </div>
      <div className="bg-white border rounded-xl p-4">
        <div className="font-semibold mb-2">Learning Path Recommendations</div>
        <ul className="list-disc pl-5 text-sm text-gray-700">
          {recos.map((r, i) => <li key={i}>{r.title} — {r.provider}</li>)}
        </ul>
        <button className="mt-3 px-3 py-1 rounded border text-sm">Export Report</button>
      </div>
    </div>
  )
}


