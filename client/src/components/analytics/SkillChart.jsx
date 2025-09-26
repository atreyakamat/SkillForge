import { Chart as ChartJS, RadialLinearScale, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from 'chart.js'
import { Radar, Bar, Line, Doughnut } from 'react-chartjs-2'
import { useRef } from 'react'

ChartJS.register(RadialLinearScale, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend)

export default function SkillChart({ type = 'radar', data, options, className = '' }) {
  const ref = useRef(null)

  function exportImage() {
    const chart = ref.current
    if (!chart) return
    const url = chart.toBase64Image()
    const a = document.createElement('a')
    a.href = url
    a.download = `skill-chart-${type}.png`
    a.click()
  }

  const common = { data, options, ref }

  return (
    <div className={`bg-white border rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold capitalize">{type} chart</div>
        <button className="text-sm px-2 py-1 rounded border" onClick={exportImage}>Export</button>
      </div>
      {type === 'radar' && <Radar {...common} />}
      {type === 'bar' && <Bar {...common} />}
      {type === 'line' && <Line {...common} />}
      {type === 'donut' && <Doughnut {...common} />}
    </div>
  )
}


