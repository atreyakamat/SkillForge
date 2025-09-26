import { Chart as ChartJS, RadialLinearScale, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from 'chart.js'
import { Radar, Bar, Line, Doughnut } from 'react-chartjs-2'
import { useEffect, useRef } from 'react'
import { applyChartDefaults, getColors, gradientFill } from '../../utils/chartTheme.js'

ChartJS.register(RadialLinearScale, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend)

export default function SkillChart({ type = 'radar', data, options = {}, className = '', dark = false }) {
  const ref = useRef(null)

  useEffect(() => {
    applyChartDefaults(dark)
  }, [dark])

  function exportImage() {
    const chart = ref.current
    if (!chart) return
    const url = chart.toBase64Image()
    const a = document.createElement('a')
    a.href = url
    a.download = `skill-chart-${type}.png`
    a.click()
  }

  const themed = (() => {
    const c = getColors(dark)
    if (type === 'bar') {
      return {
        ...data,
        datasets: data.datasets.map((ds, i) => ({
          ...ds,
          borderRadius: 8,
          borderSkipped: false,
          backgroundColor: (ctx) => gradientFill(ctx.chart.ctx, ctx.chart.chartArea, `${c.brand}66`, `${c.brand}11`),
        }))
      }
    }
    if (type === 'line') {
      return {
        ...data,
        datasets: data.datasets.map((ds, i) => ({
          ...ds,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          fill: false
        }))
      }
    }
    if (type === 'radar') {
      return {
        ...data,
        datasets: data.datasets.map((ds, i) => ({
          ...ds,
          borderWidth: 2,
          pointRadius: 2,
          pointHoverRadius: 4,
        }))
      }
    }
    if (type === 'donut') {
      return {
        ...data,
        cutout: '60%'
      }
    }
    return data
  })()

  const common = { data: themed, options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { intersect: false, mode: 'nearest' }
    },
    scales: type === 'radar' || type === 'donut' ? undefined : {
      x: { grid: { display: false } },
      y: { beginAtZero: true }
    },
    ...options
  }, ref, height: 320 }

  return (
    <div className={`bg-white border rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold capitalize">{type} chart</div>
        <button className="text-sm px-2 py-1 rounded border" onClick={exportImage}>Export</button>
      </div>
      <div style={{ height: 320 }}>
        {type === 'radar' && <Radar {...common} />}
        {type === 'bar' && <Bar {...common} />}
        {type === 'line' && <Line {...common} />}
        {type === 'donut' && <Doughnut {...common} />}
      </div>
    </div>
  )
}


