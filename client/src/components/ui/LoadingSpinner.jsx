export default function LoadingSpinner({ variant = 'spinner', size = 'md', color = 'primary' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }
  const colors = {
    primary: 'border-primary-600',
    secondary: 'border-secondary-600',
    gray: 'border-gray-600',
    white: 'border-white'
  }

  if (variant === 'spinner') {
    return <div className={`${sizes[size]} border-4 ${colors[color]} border-t-transparent rounded-full animate-spin`} />
  }
  if (variant === 'progress') {
    return (
      <div className="w-full h-2 bg-gray-200 rounded">
        <div className={`h-2 ${color==='secondary'?'bg-secondary-600':color==='gray'?'bg-gray-600':'bg-primary-600'} rounded animate-pulse`} style={{ width: '60%' }} />
      </div>
    )
  }
  // skeleton
  return <div className="animate-pulse bg-gray-200 rounded h-6 w-full" />
}


