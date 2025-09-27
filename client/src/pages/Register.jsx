import { Link } from 'react-router-dom'
import RegisterForm from '../components/auth/RegisterForm.tsx'
import NavBar from '../components/common/NavBar.jsx'

export default function Register() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <NavBar />
      <div className="flex min-h-screen">
        <div className="w-full lg:w-3/5 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Create Your Account</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Join us to analyze and improve your skills.</p>
            </div>
            <div className="bg-white dark:bg-gray-800/60 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <RegisterForm />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Already have an account? <Link className="font-medium text-primary-600 hover:underline" to="/login">Sign in</Link></p>
            </div>
          </div>
        </div>
        <div className="hidden lg:block w-2/5 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC10j58RJu-h5V6KnybdId9iwJurfKwWcAC_Ath5l7IqDQVNnyrAvtv_tUMq3Obg1p7Jy6Rd6wTPnEbXtooSYuwFLABukRj_GA4psED4S6Y6nP7nE9SBFhRXyowc-Of5Xwg2YNgrt74n1S0CSb4sKuYucaX76QroiVZekoB6-ClIjPUD_i0cKMxyPdqOtPJh0d235PsltqcBBOXyrRocsetfWVQeteQvEe_gDtG6APcd4B5fbwrqrWg73aYntUPr1dL-TCx8_7QF7A')" }} />
      </div>
    </div>
  )
}

