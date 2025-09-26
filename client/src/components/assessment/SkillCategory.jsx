import { useRef, useState } from 'react'
import SkillRating from './SkillRating.jsx'

export default function SkillCategory({ title, color = 'primary', skills = [], onChange }) {
  const [open, setOpen] = useState(true)
  const [items, setItems] = useState(skills)
  const [newSkill, setNewSkill] = useState('')
  const panelRef = useRef(null)

  const addSkill = () => {
    if (!newSkill.trim()) return
    const s = { id: crypto.randomUUID(), name: newSkill, previous: 0 }
    const next = [...items, s]
    setItems(next)
    setNewSkill('')
  }

  return (
    <div className="border rounded-xl overflow-hidden bg-white">
      <button
        onClick={()=>setOpen(!open)}
        className={`w-full text-left px-4 py-3 font-semibold border-b`}
        aria-expanded={open}
        aria-controls={`panel-${title}`}
      >
        <span className={`inline-block h-2 w-2 rounded-full mr-2 ${color==='primary'?'bg-primary-500':color==='secondary'?'bg-secondary-500':'bg-accent-500'}`}></span>
        {title}
      </button>
      <div
        id={`panel-${title}`}
        ref={panelRef}
        className={`transition-base overflow-hidden ${open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <input className="flex-1 border rounded-lg px-3 py-2" placeholder="Add custom skill" value={newSkill} onChange={(e)=>setNewSkill(e.target.value)} />
            <button className="bg-primary-600 text-white rounded-lg px-3" onClick={addSkill}>Add</button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {items.map(s => (
              <SkillRating key={s.id || s.name} name={s.name} previous={s.previous} onChange={(v)=>onChange?.(title, s.name, v)} />
            ))}
          </div>
          <div className="text-sm text-gray-600">Category completion: {(items.length ? Math.round((items.filter(i=>i.previous>0).length)/items.length*100) : 0)}%</div>
        </div>
      </div>
    </div>
  )
}


