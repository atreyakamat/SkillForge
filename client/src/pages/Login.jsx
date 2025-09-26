import LoginForm from '../components/auth/LoginForm.tsx'
import NavBar from '../components/common/NavBar.jsx'

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <NavBar />
      <div className="flex min-h-screen">
        <div className="w-full lg:w-3/5 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Welcome Back</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your Personal Learning Skill Gap Analyzer account.</p>
            </div>
            <div className="bg-white dark:bg-gray-800/60 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <LoginForm />
            </div>
            <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              <a className="font-medium text-primary-600 hover:underline" href="/forgot-password">Forgot password?</a>
            </p>
          </div>
        </div>
        <div className="hidden lg:flex w-2/5 bg-primary-50 dark:bg-primary-950 items-center justify-center p-12">
          <div className="text-center max-w-md">
            <img alt="Skill Gap Analysis illustration" className="max-w-sm mx-auto rounded-lg shadow" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLIGErBYJcDh9PZK3DxVNBeKpLyqbLjEt_oqwE84cQhBCa_7kR79kw7Fyc7X5fs-o4FKWNKxmIyr4HqAOOdInsVXP9pqIDS3truLx8OP-WJ8dw8omzclm0izKcfRjJqUZtu_Vre8Tsj9eE-_kYgSVFc402eYV-fZf1EEYg-k4uxN6HqjY1BYf6aR2vBVFfFmaw3lPCifOEyCfNGW0ckez_Avcor5H61-aHc0I1q7tLxhTYco5ohopQTqJVGYm3qx4TUZeLe45L98E" />
            <h2 className="mt-6 text-2xl font-bold">Unlock Your Potential</h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">Identify your skill gaps and get personalized learning recommendations to advance your career.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

