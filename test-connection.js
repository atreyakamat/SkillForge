// Simple server connectivity test
import http from 'http'

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/',
  method: 'GET'
}

console.log('🔍 Testing HTTP connection to localhost:5000...')

const req = http.request(options, (res) => {
  console.log('✅ Connected! Status:', res.statusCode)
  console.log('📋 Headers:', res.headers)
  
  let data = ''
  res.on('data', (chunk) => {
    data += chunk
  })
  
  res.on('end', () => {
    console.log('📋 Response body:', data)
  })
})

req.on('error', (error) => {
  console.error('❌ Connection failed:', error.message)
  console.error('❌ Error code:', error.code)
})

req.setTimeout(5000, () => {
  console.error('❌ Request timeout')
  req.destroy()
})

req.end()