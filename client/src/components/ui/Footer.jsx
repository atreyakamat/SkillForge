export default function Footer() {
  return (
    <footer className="mt-10 py-6 text-sm text-gray-600 border-t">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>© {new Date().getFullYear()} SkillForge</div>
        <nav className="flex items-center gap-4">
          <a className="hover:underline" href="#">Docs</a>
          <a className="hover:underline" href="#">Privacy</a>
          <a className="hover:underline" href="#">Terms</a>
        </nav>
      </div>
    </footer>
  )
}


