import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export default function AssessmentHistory({ data = [], range = '90d' }) {
  if (data.length === 0) {
    data = [
      { date: '2025-06', skill: 'JavaScript', score: 60 },
      { date: '2025-07', skill: 'JavaScript', score: 70 },
      { date: '2025-08', skill: 'JavaScript', score: 75 },
      { date: '2025-09', skill: 'JavaScript', score: 82 },
    ]
  }

  const labels = data.map(d => d.date)
  const chartData = {
    labels,
    datasets: [
      {
        label: 'JavaScript',
        data: data.map(d => d.score),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.2)'
      }
    ]
  }

  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">Assessment History</div>
        <select className="border rounded px-2 py-1 text-sm" defaultValue={range}>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>
      <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      <div className="mt-3 text-sm text-gray-600">Export your data as CSV soon.</div>
    </div>
  )
}


