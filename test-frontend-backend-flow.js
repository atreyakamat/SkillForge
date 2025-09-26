// Registration Form Validation Test
// This script tests the registration flow from frontend to backend

const axios = require('axios');

// Test data that matches the frontend form structure
const testRegistrationData = {
  name: 'John Doe SkillForge',
  email: 'johndoe.test@skillforge.com',
  password: 'TestPassword123!',
  role: 'Developer'
};

console.log('🧪 SkillForge Registration Flow Test');
console.log('=====================================');

async function testRegistrationAPI() {
  try {
    console.log('\n📝 Testing registration endpoint...');
    console.log('Data being sent:', JSON.stringify(testRegistrationData, null, 2));
    
    const response = await axios.post('http://localhost:5000/api/auth/register', testRegistrationData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('\n✅ Registration successful!');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    // Test if we received proper tokens
    if (response.data.tokens && response.data.tokens.access) {
      console.log('\n🔑 Access token received:', response.data.tokens.access.substring(0, 20) + '...');
      
      // Test if we can use the token to access a protected endpoint
      console.log('\n🔐 Testing token with protected endpoint...');
      const profileResponse = await axios.get('http://localhost:5000/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${response.data.tokens.access}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Protected endpoint access successful!');
      console.log('Profile data:', JSON.stringify(profileResponse.data, null, 2));
    }
    
  } catch (error) {
    console.log('\n❌ Registration test failed');
    console.log('Error status:', error.response?.status);
    console.log('Error message:', error.response?.data?.message || error.message);
    console.log('Full error:', error.response?.data || error.message);
  }
}

async function testLoginAPI() {
  try {
    console.log('\n🔐 Testing login endpoint...');
    const loginData = {
      email: testRegistrationData.email,
      password: testRegistrationData.password
    };
    
    console.log('Login data:', JSON.stringify(loginData, null, 2));
    
    const response = await axios.post('http://localhost:5000/api/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('\n✅ Login successful!');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('\n❌ Login test failed');
    console.log('Error status:', error.response?.status);
    console.log('Error message:', error.response?.data?.message || error.message);
  }
}

// Run the tests
async function runTests() {
  await testRegistrationAPI();
  await testLoginAPI();
  console.log('\n🏁 Test completed!');
}

runTests().catch(console.error);