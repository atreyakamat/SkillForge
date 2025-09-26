// Simple registration test
import http from 'http';

async function testRegister() {
  console.log('🧪 Testing registration endpoint...');
  
  const postData = JSON.stringify({
    name: 'Test User',
    email: 'test' + Date.now() + '@example.com', // Use unique email
    password: 'TestPassword123!',
    role: 'Developer',
    industry: 'Technology'
  });

  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log('✅ Registration Response:', res.statusCode);
          console.log('📝 Response Data:', parsed);
          resolve(parsed);
        } catch (e) {
          console.log('❌ Response parsing error:', e.message);
          console.log('📝 Raw response:', data);
          reject(e);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Registration request failed:', err.message);
      reject(err);
    });

    req.on('timeout', () => {
      console.log('❌ Registration request timed out');
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.write(postData);
    req.end();
  });
}

// Test login with the registered user
async function testLogin(email) {
  console.log('🧪 Testing login endpoint...');
  
  const postData = JSON.stringify({
    email: email,
    password: 'TestPassword123!'
  });

  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log('✅ Login Response:', res.statusCode);
          console.log('📝 Response Data:', parsed);
          resolve(parsed);
        } catch (e) {
          console.log('❌ Login response parsing error:', e.message);
          console.log('📝 Raw response:', data);
          reject(e);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Login request failed:', err.message);
      reject(err);
    });

    req.on('timeout', () => {
      console.log('❌ Login request timed out');
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.write(postData);
    req.end();
  });
}

async function runTests() {
  try {
    console.log('🚀 Starting backend login tests...\n');
    
    // Test registration
    const registerResult = await testRegister();
    const testEmail = registerResult.user?.email;
    
    if (!testEmail) {
      throw new Error('Registration did not return user email');
    }
    
    console.log('\n⏱️  Waiting 2 seconds before login test...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test login with the registered user
    await testLogin(testEmail);
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.log('\n❌ Tests failed:', error.message);
    process.exit(1);
  }
}

runTests();