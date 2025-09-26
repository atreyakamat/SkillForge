import { Link } from 'react-router-dom'
import { PlayCircle, Users, Lightbulb, GraduationCap } from 'lucide-react'
import Footer from '../components/ui/Footer.jsx'

export default function Landing() {
  const logos = [
    'Acme','Globex','Initech','Umbrella'
  ]
  return (
    <div className="bg-white text-gray-800">
      {/* Hero */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">Discover Your Skill Gaps, Accelerate Your Career</h1>
            <p className="text-lg text-gray-600 mb-8">Take control of your professional development. Identify strengths and weaknesses to create a personalized learning path for success.</p>
            <div className="flex justify-center md:justify-start gap-4">
              <Link to="/assessment" className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition">Start Free Assessment</Link>
              <a href="#how-it-works" className="bg-white border border-gray-300 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-primary-600" />
                <span>Watch 2-min Demo</span>
              </a>
            </div>
          </div>
          <div>
            <img className="rounded-lg shadow-xl" alt="Professional analyzing skill gaps" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFaX5Zh8_ZKh87-SaoaBedBkCw_TuwV2dDK2rRRYcdcI7Tlhw_PxZGnzl-_UPjuyu5NVCjiKAebju4i5n7wZzMCnZSbDbCjgsEBlP4fn3U5vt4qHRJ-A3dpDgZWcbAggiYrsSKgDZwDDa5rcGYWukpyVCZhbSkIAWSvFMGS6Iitg4gfrZIFrDB-a6sJYk8vNIvzevdpNf7Do1ITt38rouVwIXIQP54H3zjXga21nLxrgmHo9Sk5rwWUPrWNQq0uLFQvk5hDxcyLcM" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features to Guide Your Growth</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">Everything you need to understand your skills and plan your development journey.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="bg-primary-100 text-primary-700 rounded-full p-3 inline-flex mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Self & Peer Assessment</h3>
              <p className="text-gray-600">Get a 360° view via self-evaluation and anonymous feedback from peers and managers.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="bg-secondary-100 text-secondary-700 rounded-full p-3 inline-flex mb-4">
                <Lightbulb className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Intelligent Gap Analysis</h3>
              <p className="text-gray-600">Compare against industry benchmarks to highlight critical gaps and priorities.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="bg-accent-100 text-accent-700 rounded-full p-3 inline-flex mb-4">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Learning</h3>
              <p className="text-gray-600">Curated resources and actionable steps to close gaps and achieve your goals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Get Started in 4 Simple Steps</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[1,2,3,4].map((n, idx) => (
              <div key={n} className="text-center">
                <div className="bg-primary-600 text-white rounded-full w-12 h-12 mx-auto flex items-center justify-center text-xl font-bold mb-4 border-4 border-blue-200">{n}</div>
                <h3 className="text-lg font-semibold mb-2">{['Create Your Profile','Take Assessments','Analyze Your Gaps','Start Learning'][idx]}</h3>
                <p className="text-gray-600">{['Sign up and define your goals.','Complete self and peer feedback.','Review your personalized report.','Follow your learning path.'][idx]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Video */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Watch a 2‑minute Demo</h2>
          <p className="text-gray-600 mb-6">Get a quick overview of how SkillForge helps you identify and close skill gaps.</p>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-black">
            <video src="/demo.mp4" controls className="w-full h-auto" preload="metadata"></video>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section id="social-proof" className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-gray-600 font-semibold">TRUSTED BY PROFESSIONALS</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
              {[
                { name: 'Satya Nadella', company: 'Microsoft', img: 'https://unavatar.io/satyanadella' },
                { name: 'Sundar Pichai', company: 'Google', img: 'https://unavatar.io/sundarpichai' },
                { name: 'Tim Cook', company: 'Apple', img: 'https://unavatar.io/tim_cook' }
              ].map((p, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4 text-left">
                  <img alt={p.name} src={p.img} className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-gray-900">{p.name}</p>
                    <p className="text-sm text-gray-600">{p.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { quote: 'Game-changer for my career development.', name: 'Sarah L.', role: 'Software Engineer' },
              { quote: 'Invaluable for team growth.', name: 'Michael B.', role: 'Engineering Manager' },
              { quote: 'Clear roadmap and easy to follow.', name: 'Jessica T.', role: 'UX Designer' },
            ].map((t, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-lg">
                <p className="text-gray-600 mb-6">"{t.quote}"</p>
                <div>
                  <p className="font-bold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-600">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}





