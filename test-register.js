const API_BASE = 'http://localhost:5000/api'

async function testServerHealth() {
  try {
    const response = await fetch('http://localhost:5000/')
    const data = await response.json()
    console.log('🏥 Server health check:', response.ok ? '✅ OK' : '❌ Failed')
    return response.ok
  } catch (error) {
    console.error('❌ Server not reachable:', error.message)
    return false
  }
}

async function testApiRoute() {
  console.log('🔍 Testing API route accessibility...')
  
  // Test if we can reach any API endpoint
  try {
    console.log('📡 Testing GET /api/auth (should get method not allowed)...')
    const response = await fetch(`${API_BASE}/auth`, {
      method: 'GET'
    })
    console.log('📊 Status:', response.status)
    const text = await response.text()
    console.log('📋 Response:', text)
    
    if (response.status === 404) {
      console.log('❌ API routes not found - routing issue')
    } else if (response.status === 405) {
      console.log('✅ API routes are accessible (method not allowed is expected)')
    }
  } catch (error) {
    console.error('❌ API route error:', error.message)
  }
}

async function testRegister() {
  console.log('🧪 Testing registration API...')
  
  // First check server health
  const serverOk = await testServerHealth()
  if (!serverOk) {
    console.log('❌ Server is not responding. Make sure the server is running on port 5000.')
    return
  }
  
  // Test API route accessibility
  await testApiRoute()
  
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'TestPassword123!',
    role: 'Developer'
  }
  
  console.log('📤 Sending registration request for:', testUser.email)
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    console.log('📊 Status:', response.status)
    console.log('📋 Headers:', JSON.stringify(Object.fromEntries(response.headers), null, 2))
    
    const contentType = response.headers.get('content-type')
    let data
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }
    
    console.log('📋 Response:', typeof data === 'string' ? data : JSON.stringify(data, null, 2))
    
    if (response.ok) {
      console.log('✅ Registration successful!')
      console.log('👤 User ID:', data.user?.id)
      console.log('👤 User Name:', data.user?.name)
      console.log('📧 User Email:', data.user?.email)
      console.log('🎭 User Role:', data.user?.role)
      console.log('🔑 Access Token:', data.tokens?.access ? '✅ Present' : '❌ Missing')
      console.log('🔄 Refresh Token:', data.tokens?.refresh ? '✅ Present' : '❌ Missing')
      
      console.log('\n🎯 RESULT: Registration API is working correctly!')
    } else {
      console.log('❌ Registration failed!')
      console.log('🚨 Error message:', data.message || data)
    }
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('❌ Request timeout after 10 seconds')
    } else {
      console.error('❌ Network error:', error.message)
      console.error('❌ Error details:', error)
    }
  }
}

testRegister()