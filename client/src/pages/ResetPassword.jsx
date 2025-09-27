import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

export default function ResetPassword() {
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const strength = useMemo(() => {
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score // 0..4
  }, [pw])
  const strengthClass = strength >= 4 ? 'strong' : strength >= 2 ? 'medium' : pw ? 'weak' : ''
  const mismatch = confirm && pw !== confirm

  function submit(e) {
    e.preventDefault()
    if (mismatch || strength < 3) return
    alert('Password reset!')
  }

  return (
    <div className="font-sans bg-gray-50 dark:bg-gray-900 text-slate-800 dark:text-slate-200 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <header className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 text-primary-600">
              <svg viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"/></svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">SkillForge</h1>
          </div>
        </header>
        <main className="bg-white dark:bg-slate-900/60 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reset Your Password</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Please create a new password for your account.</p>
          </div>
          <form className="space-y-6" onSubmit={submit}>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
              <input id="new-password" type="password" value={pw} onChange={(e)=>setPw(e.target.value)} placeholder="Enter new password" className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 transition" />
              <div className={`password-strength-indicator grid grid-cols-4 gap-2 mt-2 ${strengthClass}`}>
                <span className="strength-1 block h-1 rounded bg-slate-200"></span>
                <span className="strength-2 block h-1 rounded bg-slate-200"></span>
                <span className="strength-3 block h-1 rounded bg-slate-200"></span>
                <span className="strength-4 block h-1 rounded bg-slate-200"></span>
              </div>
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
              <input id="confirm-password" type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} placeholder="Confirm new password" className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 transition" />
              {mismatch && <p className="text-red-500 text-xs mt-1">Passwords do not match.</p>}
            </div>
            <button type="submit" disabled={mismatch || strength < 3} className="w-full bg-primary-600 disabled:bg-primary-600/60 text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 focus:ring-primary-600 transition-colors">Reset Password</button>
          </form>
          <div className="text-center mt-6">
            <Link to="/login" className="text-sm text-primary-600 hover:underline">Back to Login</Link>
          </div>
        </main>
      </div>
    </div>
  )
}


