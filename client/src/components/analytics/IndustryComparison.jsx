import SkillChart from './SkillChart.jsx'

export default function IndustryComparison() {
  const barData = {
    labels: ['JS','React','Node','UX','Data'],
    datasets: [
      { label: 'You', data: [70,60,50,30,40], backgroundColor: '#3b82f6' },
      { label: 'Industry Avg', data: [65,55,45,35,50], backgroundColor: '#10b981' }
    ]
  }
  const donutData = {
    labels: ['Frontend','Backend','Design','Data'],
    datasets: [{ data: [40,30,15,15], backgroundColor: ['#3b82f6','#10b981','#a855f7','#f59e0b'] }]
  }
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <SkillChart type="bar" data={barData} options={{ plugins: { legend: { position: 'bottom' } } }} />
      <SkillChart type="donut" data={donutData} options={{ plugins: { legend: { position: 'bottom' } } }} />
    </div>
  )
}


