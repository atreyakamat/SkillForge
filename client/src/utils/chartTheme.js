import { Chart as ChartJS } from 'chart.js'

export function getColors(isDark = false) {
  const brand = '#3b82f6'
  const brandDark = '#1e40af'
  const success = '#10b981'
  const warning = '#f59e0b'
  const error = '#ef4444'
  const gray500 = '#6b7280'
  const grid = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,24,39,0.08)'
  const text = isDark ? '#e5e7eb' : '#374151'
  const bg = isDark ? '#111827' : '#ffffff'
  return { brand, brandDark, success, warning, error, gray500, grid, text, bg }
}

export function applyChartDefaults(isDark = false) {
  const c = getColors(isDark)
  ChartJS.defaults.font.family = 'Inter, ui-sans-serif, system-ui, sans-serif'
  ChartJS.defaults.color = c.text
  ChartJS.defaults.plugins.legend.position = 'bottom'
  ChartJS.defaults.plugins.legend.labels.boxWidth = 12
  ChartJS.defaults.plugins.tooltip.backgroundColor = isDark ? '#111827' : '#111827'
  ChartJS.defaults.plugins.tooltip.titleColor = '#ffffff'
  ChartJS.defaults.plugins.tooltip.bodyColor = '#ffffff'
  ChartJS.defaults.layout.padding = 8
  // Grid styling
  ChartJS.defaults.scale.grid.color = c.grid
  ChartJS.defaults.scale.ticks.color = c.gray500
}

export function gradientFill(ctx, area, from, to) {
  const g = ctx.createLinearGradient(0, area.top, 0, area.bottom)
  g.addColorStop(0, from)
  g.addColorStop(1, to)
  return g
}
