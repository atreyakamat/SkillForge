export default function TestPage() {
  return (
    <div style={{ 
      backgroundColor: 'red', 
      color: 'white', 
      padding: '20px',
      minHeight: '100vh',
      fontSize: '24px'
    }}>
      <h1>TEST PAGE - If you can see this, React is working!</h1>
      <p>This is a test page with inline styles to verify basic functionality.</p>
      <div className="bg-blue-500 text-white p-4 mt-4">
        This div uses Tailwind classes - if it appears blue, Tailwind is working.
      </div>
    </div>
  )
}