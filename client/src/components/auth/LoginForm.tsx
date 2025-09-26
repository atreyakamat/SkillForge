import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import { useState } from 'react'

type LoginInputs = {
  email: string
  password: string
  remember: boolean
}

export default function LoginForm() {
  const { register: rhfRegister, handleSubmit, formState: { errors } } = useForm<LoginInputs>({
    defaultValues: { email: '', password: '', remember: true }
  })
  const { login } = useAuthContext()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(values: LoginInputs) {
    console.log('🔐 Login form submission started with:', { email: values.email })
    setServerError('')
    setLoading(true)
    try {
      await login(values.email, values.password)
      console.log('✅ Login successful, navigating to dashboard')
      navigate('/dashboard')
    } catch (err: any) {
      console.error('❌ Login error:', err)
      setServerError(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-1">Sign in</h1>
        <p className="text-sm text-gray-600 mb-6">Welcome back to SkillForge</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              {...rhfRegister('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              {...rhfRegister('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
            />
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
          </div>
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded" {...rhfRegister('remember')} />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline">Forgot password?</Link>
          </div>
          {serverError && <p className="text-sm text-red-600">{serverError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white rounded-lg py-2.5 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
