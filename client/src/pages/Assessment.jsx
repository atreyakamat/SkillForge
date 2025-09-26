import { useState } from 'react'

export default function Assessment() {
  const [answers, setAnswers] = useState({})

  const update = (key, value) => setAnswers((prev)=>({ ...prev, [key]: value }))

  const submit = (e) => {
    e.preventDefault()
    // TODO: POST to /assessments with answers
    // eslint-disable-next-line no-console
    console.log('Submitting answers', answers)
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Skill Assessment</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">JavaScript Proficiency (1-5)</label>
          <input type="number" min="1" max="5" className="border rounded px-3 py-2" onChange={(e)=>update('javascript', Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm mb-1">React Proficiency (1-5)</label>
          <input type="number" min="1" max="5" className="border rounded px-3 py-2" onChange={(e)=>update('react', Number(e.target.value))} />
        </div>
        <button className="bg-blue-600 text-white rounded px-4 py-2">Submit</button>
      </form>
    </section>
  )
}

