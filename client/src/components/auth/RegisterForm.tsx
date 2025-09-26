import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import { useMemo, useState } from 'react'

type RegisterInputs = {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: 'Developer' | 'Designer' | 'Manager' | string
  terms: boolean
}

function getStrength(pw: string) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score // 0..4
}

export default function RegisterForm() {
  const { register: rhfRegister, handleSubmit, watch, formState: { errors } } = useForm<RegisterInputs>({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', role: 'Developer', terms: false }
  })
  const { register } = useAuthContext()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const password = watch('password')
  const strength = useMemo(() => getStrength(password || ''), [password])

  async function onSubmit(values: RegisterInputs) {
    setServerError('')
    setLoading(true)
    try {
      if (values.password !== values.confirmPassword) {
        setServerError('Passwords do not match')
        return
      }
      await register({ name: values.name, email: values.email, password: values.password, role: values.role })
      navigate('/dashboard')
    } catch (err: any) {
      setServerError(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-1">Create account</h1>
        <p className="text-sm text-gray-600 mb-6">Join SkillForge to analyze your skill gaps</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Full name</label>
            <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              {...rhfRegister('name', { required: 'Name is required' })} />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              {...rhfRegister('email', { required: 'Email is required' })} />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input type="password" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              {...rhfRegister('password', { required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } })} />
            <div className="h-2 bg-gray-200 rounded mt-2">
              <div className={`h-2 rounded ${strength <= 1 ? 'bg-red-500 w-1/4' : strength === 2 ? 'bg-yellow-500 w-2/4' : strength === 3 ? 'bg-green-500 w-3/4' : 'bg-primary-600 w-full'}`}></div>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Confirm password</label>
            <input type="password" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              {...rhfRegister('confirmPassword', { required: 'Please confirm your password' })} />
          </div>
          <div>
            <label className="block text-sm mb-1">Role</label>
            <select className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" {...rhfRegister('role')}>
              <option>Developer</option>
              <option>Designer</option>
              <option>Manager</option>
              <option>Product</option>
              <option>Data</option>
            </select>
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" className="rounded" {...rhfRegister('terms', { required: 'You must accept terms' })} />
            I agree to the terms and conditions
          </label>
          {errors.terms && <p className="text-xs text-red-600">{errors.terms.message}</p>}
          {serverError && <p className="text-sm text-red-600">{serverError}</p>}
          <button type="submit" disabled={loading} className="w-full bg-primary-600 text-white rounded-lg py-2.5 disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}
