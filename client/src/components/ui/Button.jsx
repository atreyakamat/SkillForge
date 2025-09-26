export default function Button({ variant = 'primary', size = 'md', loading = false, disabled = false, leftIcon, rightIcon, className = '', children, ...props }) {
  const variants = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    danger: 'btn btn-danger',
    ghost: 'inline-flex items-center justify-center rounded-md border border-transparent text-gray-700 bg-transparent hover:bg-gray-100 font-medium'
  }
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-6',
    lg: 'h-12 px-6 text-lg'
  }
  return (
    <button
      disabled={disabled || loading}
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {leftIcon && <span className="mr-2 inline-flex">{leftIcon}</span>}
      {loading && <span className="mr-2 h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />}
      {children}
      {rightIcon && <span className="ml-2 inline-flex">{rightIcon}</span>}
    </button>
  )
}


