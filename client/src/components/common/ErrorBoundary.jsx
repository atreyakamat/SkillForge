import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Global error boundary caught an error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white border rounded-lg p-6 text-center">
            <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-4">An unexpected error occurred. Try refreshing the page.</p>
            <pre className="text-xs text-left bg-gray-50 border rounded p-3 overflow-auto max-h-48">{String(this.state.error)}</pre>
            <button className="mt-4 bg-primary-600 text-white px-4 py-2 rounded" onClick={()=>window.location.reload()}>Reload</button>
          </div>
        </div>
      )
    }
    // eslint-disable-next-line react/prop-types
    return this.props.children
  }
}


