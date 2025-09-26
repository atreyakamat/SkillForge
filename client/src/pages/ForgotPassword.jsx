export default function ForgotPassword() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 font-sans min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800/70 rounded-xl shadow-lg m-4 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Forgot Your Password?</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">No worries, we'll send you reset instructions.</p>
        </div>
        <form className="mt-6 space-y-4" onSubmit={(e)=>{ e.preventDefault(); alert('If this email exists, a reset link will be sent.')}}>
          <div>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email address"
              className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-primary-600 focus:border-primary-600 sm:text-sm"
            />
          </div>
          <div>
            <button type="submit" className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600">
              Send Reset Link
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <a className="font-medium text-primary-600 hover:underline" href="/login">Return to Sign In</a>
        </div>
      </div>
    </div>
  )
}


