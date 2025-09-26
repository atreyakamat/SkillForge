// Detailed registration test to capture exact error
const API_BASE = 'http://localhost:5000/api'

async function testDetailedRegistration() {
  console.log('🔍 DETAILED REGISTRATION DEBUG TEST')
  console.log('=====================================')
  
  const testUser = {
    name: 'John Doe',
    email: `testuser${Date.now()}@example.com`,
    password: 'TestPassword123!',
    confirmPassword: 'TestPassword123!',
    role: 'Developer',
    terms: true
  }
  
  console.log('📤 Sending registration data:')
  console.log(JSON.stringify(testUser, null, 2))
  console.log('')
  
  try {
    console.log('🌐 Making request to:', `${API_BASE}/auth/register`)
    
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
        role: testUser.role
      })
    })
    
    console.log('📊 Response Status:', response.status)
    console.log('📊 Response Status Text:', response.statusText)
    console.log('📊 Response Headers:')
    for (const [key, value] of response.headers.entries()) {
      console.log(`   ${key}: ${value}`)
    }
    console.log('')
    
    const responseText = await response.text()
    console.log('📋 Raw Response Body:')
    console.log(responseText)
    console.log('')
    
    let responseData
    try {
      responseData = JSON.parse(responseText)
      console.log('📋 Parsed Response:')
      console.log(JSON.stringify(responseData, null, 2))
    } catch (parseError) {
      console.log('❌ Response is not valid JSON')
    }
    
    if (response.ok) {
      console.log('✅ Registration SUCCESS!')
      if (responseData?.user) {
        console.log('👤 Created User ID:', responseData.user.id)
        console.log('👤 Created User Email:', responseData.user.email)
        console.log('👤 Created User Role:', responseData.user.role)
      }
      if (responseData?.tokens) {
        console.log('🔑 Access Token:', responseData.tokens.access ? 'Present' : 'Missing')
        console.log('🔄 Refresh Token:', responseData.tokens.refresh ? 'Present' : 'Missing')
      }
    } else {
      console.log('❌ Registration FAILED!')
      console.log('🚨 Error Details:')
      if (responseData?.message) {
        console.log('   Message:', responseData.message)
      }
      if (responseData?.errors) {
        console.log('   Validation Errors:', responseData.errors)
      }
    }
    
  } catch (error) {
    console.log('❌ NETWORK ERROR!')
    console.log('🚨 Error Type:', error.name)
    console.log('🚨 Error Message:', error.message)
    console.log('🚨 Full Error:', error)
  }
}

testDetailedRegistration()